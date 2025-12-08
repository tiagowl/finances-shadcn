# Scripts de Automação - Testes de Performance

## Visão Geral

Este documento contém exemplos de scripts para testes de performance usando k6 ou Artillery.

## Configuração - k6

### k6.config.js

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up para 100 usuários
    { duration: '5m', target: 100 }, // Manter 100 usuários
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições < 2s
    http_req_failed: ['rate<0.01'],    // Taxa de erro < 1%
  },
};
```

## Teste de Performance - APIs

### Exemplo 1: Teste de Carga - GET /categories

```javascript
// tests/performance/categories-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors: ['rate<0.1'],
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  const token = __ENV.AUTH_TOKEN;

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // Teste GET /categories
  const response = http.get(`${BASE_URL}/api/categories`, params);
  
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'has data array': (r) => {
      const body = JSON.parse(r.body);
      return Array.isArray(body.data);
    },
  });

  errorRate.add(!success);
  sleep(1);
}
```

### Exemplo 2: Teste de Stress - POST /expenses

```javascript
// tests/performance/expenses-stress.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  const token = __ENV.AUTH_TOKEN;
  const categoryId = __ENV.CATEGORY_ID;

  const payload = JSON.stringify({
    name: `Despesa ${Math.random()}`,
    amount: Math.random() * 1000,
    categoryId: categoryId,
    date: new Date().toISOString().split('T')[0],
  });

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(
    `${BASE_URL}/api/expenses`,
    payload,
    params
  );

  check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
```

### Exemplo 3: Teste de Endurance - Dashboard

```javascript
// tests/performance/dashboard-endurance.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  duration: '30m', // 30 minutos
  vus: 50,         // 50 usuários simultâneos
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  const token = __ENV.AUTH_TOKEN;

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  // Sequência de requisições do dashboard
  const dashboardResponse = http.get(`${BASE_URL}/api/dashboard`, params);
  check(dashboardResponse, {
    'dashboard status 200': (r) => r.status === 200,
  });

  sleep(2);

  const categoriesResponse = http.get(`${BASE_URL}/api/categories`, params);
  check(categoriesResponse, {
    'categories status 200': (r) => categoriesResponse.status === 200,
  });

  sleep(3);
}
```

## Teste de Performance - Database

### Query Performance Test

```typescript
// tests/performance/database-queries.test.ts
import { db } from '@/infrastructure/database/knex';

describe('Database Query Performance', () => {
  it('should fetch categories with stats in < 100ms', async () => {
    const start = Date.now();
    
    const categories = await db('categories')
      .where({ user_id: 'test-user-id' });
    
    for (const category of categories) {
      await db('expenses')
        .where({ category_id: category.id })
        .sum('amount as total')
        .first();
    }
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('should aggregate expenses efficiently', async () => {
    const start = Date.now();
    
    const result = await db('expenses')
      .where({ user_id: 'test-user-id' })
      .sum('amount as total')
      .first();
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
  });
});
```

## Teste de Performance - Frontend

### Lighthouse CI

```yaml
# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:5173/dashboard'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
      },
    },
  },
};
```

### Playwright Performance

```typescript
// tests/performance/frontend-performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Frontend Performance', () => {
  test('dashboard should load in < 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('categories page should be interactive quickly', async ({ page }) => {
    await page.goto('/categories');
    
    // Medir Time to Interactive
    const metrics = await page.evaluate(() => {
      return {
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
      };
    });
    
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });
});
```

## Métricas de Performance

### Backend - Thresholds

```javascript
export const backendThresholds = {
  'GET /api/categories': {
    p50: 500,   // 50% das requisições < 500ms
    p95: 2000,  // 95% das requisições < 2s
    p99: 3000,  // 99% das requisições < 3s
  },
  'POST /api/expenses': {
    p50: 300,
    p95: 1500,
    p99: 2500,
  },
  'GET /api/dashboard': {
    p50: 800,
    p95: 2000,
    p99: 3000,
  },
};
```

### Frontend - Thresholds

```javascript
export const frontendThresholds = {
  'Time to First Byte (TTFB)': 800,
  'First Contentful Paint (FCP)': 1800,
  'Largest Contentful Paint (LCP)': 2500,
  'Time to Interactive (TTI)': 3800,
  'Total Blocking Time (TBT)': 300,
  'Cumulative Layout Shift (CLS)': 0.1,
};
```

## Comandos de Execução

```bash
# Teste de carga com k6
k6 run tests/performance/categories-load.js

# Com variáveis de ambiente
BASE_URL=http://localhost:3000 AUTH_TOKEN=xxx k6 run tests/performance/expenses-stress.js

# Teste de endurance
k6 run --duration 30m tests/performance/dashboard-endurance.js

# Lighthouse CI
npm run lighthouse

# Playwright Performance
npm run test:performance
```

## Relatórios de Performance

### Formato do Relatório

```
Performance Test Results
=======================

Test: Categories Load Test
Duration: 6 minutes
Users: 0 -> 100 -> 0

Results:
- Total Requests: 15,432
- Failed Requests: 12 (0.08%)
- Avg Response Time: 856ms
- P95 Response Time: 1,892ms
- P99 Response Time: 2,456ms

Thresholds:
✅ p95 < 2000ms: PASSED (1,892ms)
✅ Error Rate < 1%: PASSED (0.08%)
```

---

**Versão**: 1.0  
**Última Atualização**: 2024



