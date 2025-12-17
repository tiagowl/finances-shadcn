// Vercel Serverless Function Entry Point for Hono
import { IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';
import app from '../dist/src/presentation/http/server.js';

// Convert Node.js IncomingMessage to Web API Request
async function nodeRequestToWebRequest(req: IncomingMessage): Promise<Request> {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url || '/'}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  const method = req.method || 'GET';
  let body: BodyInit | undefined = undefined;

  // Read body for non-GET/HEAD requests
  if (method !== 'GET' && method !== 'HEAD') {
    const chunks: Buffer[] = [];
    for await (const chunk of req as Readable) {
      chunks.push(Buffer.from(chunk));
    }
    if (chunks.length > 0) {
      body = Buffer.concat(chunks);
    }
  }

  return new Request(url, {
    method,
    headers,
    body,
  });
}

// Convert Web API Response to Node.js ServerResponse
async function webResponseToNodeResponse(
  webResponse: Response,
  res: ServerResponse
): Promise<void> {
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;

  // Copy headers
  webResponse.headers.forEach((value, key) => {
    // Skip certain headers that Node.js handles automatically
    if (key.toLowerCase() !== 'transfer-encoding') {
      res.setHeader(key, value);
    }
  });

  // Handle body
  if (webResponse.body) {
    const reader = webResponse.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          res.write(decoder.decode(value, { stream: true }));
        }
      }
      res.end();
    } catch (error) {
      if (!res.headersSent) {
        res.end();
      }
      throw error;
    }
  } else {
    res.end();
  }
}

// Vercel serverless handler
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    // Convert Node.js request to Web API Request
    const webRequest = await nodeRequestToWebRequest(req);

    // Handle request with Hono app
    const webResponse = await app.fetch(webRequest);

    // Convert Web API Response to Node.js response
    await webResponseToNodeResponse(webResponse, res);
  } catch (error) {
    console.error('Error handling request:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}
