import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Validate Firebase configuration
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if any required environment variable is missing or has default values
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => {
    if (!value) return true;
    // Check for default placeholder values
    const lowerValue = value.toLowerCase();
    return lowerValue.includes('your-') || 
           lowerValue.includes('demo-') ||
           lowerValue === 'your-api-key' ||
           lowerValue === 'your-project-id';
  })
  .map(([key]) => key);

if (missingVars.length > 0 && import.meta.env.DEV) {
  console.warn(
    '⚠️ Firebase configuration is missing or incomplete. Please set the following environment variables in your .env file:',
    missingVars.map((key) => {
      const envKey = key
        .replace(/([A-Z])/g, '_$1')
        .toUpperCase()
        .replace(/^_/, '');
      return `VITE_FIREBASE_${envKey}`;
    }).join(', ')
  );
  console.warn('📝 See FIREBASE_SETUP.md for instructions on how to configure Firebase.');
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || 'demo-api-key',
  authDomain: requiredEnvVars.authDomain || 'demo-project.firebaseapp.com',
  projectId: requiredEnvVars.projectId || 'demo-project',
  storageBucket: requiredEnvVars.storageBucket || 'demo-project.appspot.com',
  messagingSenderId: requiredEnvVars.messagingSenderId || '123456789',
  appId: requiredEnvVars.appId || '1:123456789:web:abcdef',
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw new Error(
      'Firebase configuration error. Please check your .env file and ensure all Firebase environment variables are set correctly.'
    );
  }
} else {
  app = getApps()[0];
}

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Connect to emulators in development if configured
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  if (!auth._delegate._config?.emulator) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  }
  if (!db._delegate._settings?.host?.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
}

export default app;

