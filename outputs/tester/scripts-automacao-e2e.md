# Scripts de Automação - Testes End-to-End (E2E)

## Visão Geral

Este documento contém exemplos de scripts E2E usando Playwright ou Cypress para testar fluxos completos de usuário.

## Configuração - Playwright

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Exemplo 1: Fluxo Completo - Login e Dashboard

```typescript
// tests/e2e/auth-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Autenticação e Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Aguardar redirecionamento
    await page.waitForURL('/dashboard');

    // Verificar dashboard
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('[data-testid="total-balance"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Credenciais inválidas'
    );
  });
});
```

## Exemplo 2: Fluxo - Criar Categoria e Despesa

```typescript
// tests/e2e/category-expense-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo Categoria e Despesa', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should create category and add expense', async ({ page }) => {
    // Criar categoria
    await page.goto('/categories');
    await page.click('[data-testid="add-category-button"]');
    
    await page.fill('[data-testid="category-name-input"]', 'Alimentação');
    await page.fill('[data-testid="category-budget-input"]', '1000');
    await page.click('[data-testid="save-button"]');

    // Verificar categoria na lista
    await expect(page.locator('text=Alimentação')).toBeVisible();
    await expect(page.locator('text=R$ 1.000,00')).toBeVisible();

    // Criar despesa na categoria
    await page.goto('/expenses');
    await page.click('[data-testid="add-expense-button"]');

    await page.fill('[data-testid="expense-name-input"]', 'Supermercado');
    await page.fill('[data-testid="expense-amount-input"]', '500');
    await page.selectOption('[data-testid="expense-category-select"]', {
      label: 'Alimentação',
    });
    await page.fill('[data-testid="expense-date-input"]', new Date().toISOString().split('T')[0]);
    await page.click('[data-testid="save-button"]');

    // Verificar despesa
    await expect(page.locator('text=Supermercado')).toBeVisible();
    await expect(page.locator('text=R$ 500,00')).toBeVisible();

    // Verificar atualização na categoria
    await page.goto('/categories');
    await expect(page.locator('text=R$ 500,00')).toBeVisible(); // Gasto
    await expect(page.locator('text=R$ 500,00')).toContainText('Restante'); // Restante
  });
});
```

## Exemplo 3: Fluxo - Marcar Desejo como Comprado

```typescript
// tests/e2e/wish-purchase-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Compra de Desejo', () => {
  test.beforeEach(async ({ page }) => {
    // Login e setup
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should purchase wish and create expense', async ({ page }) => {
    // Criar categoria primeiro
    await page.goto('/categories');
    await page.click('[data-testid="add-category-button"]');
    await page.fill('[data-testid="category-name-input"]', 'Eletrônicos');
    await page.fill('[data-testid="category-budget-input"]', '10000');
    await page.click('[data-testid="save-button"]');
    await page.waitForTimeout(500);

    // Criar desejo
    await page.goto('/wishes');
    await page.click('[data-testid="add-wish-button"]');
    
    await page.fill('[data-testid="wish-name-input"]', 'iPhone 15');
    await page.selectOption('[data-testid="wish-category-select"]', {
      label: 'Eletrônicos',
    });
    await page.fill('[data-testid="wish-amount-input"]', '5000');
    await page.fill('[data-testid="wish-link-input"]', 'https://example.com/iphone');
    await page.click('[data-testid="save-button"]');
    await page.waitForTimeout(500);

    // Verificar desejo na lista
    await expect(page.locator('text=iPhone 15')).toBeVisible();
    await expect(page.locator('[data-testid="purchase-wish-button"]')).toBeVisible();

    // Marcar como comprado
    await page.click('[data-testid="purchase-wish-button"]');
    
    // Confirmar no dialog
    await page.waitForSelector('[data-testid="confirm-purchase-dialog"]');
    await page.click('[data-testid="confirm-purchase-button"]');

    // Aguardar processamento
    await page.waitForTimeout(1000);

    // Verificar que desejo foi removido
    await expect(page.locator('text=iPhone 15')).not.toBeVisible();

    // Verificar despesa criada
    await page.goto('/expenses');
    await expect(page.locator('text=iPhone 15')).toBeVisible();
    await expect(page.locator('text=R$ 5.000,00')).toBeVisible();
  });

  test('should show warning when budget exceeded', async ({ page }) => {
    // Setup: categoria com orçamento baixo
    await page.goto('/categories');
    await page.click('[data-testid="add-category-button"]');
    await page.fill('[data-testid="category-name-input"]', 'Alimentação');
    await page.fill('[data-testid="category-budget-input"]', '1000');
    await page.click('[data-testid="save-button"]');
    await page.waitForTimeout(500);

    // Criar despesa que gasta quase todo orçamento
    await page.goto('/expenses');
    await page.click('[data-testid="add-expense-button"]');
    await page.fill('[data-testid="expense-name-input"]', 'Supermercado');
    await page.fill('[data-testid="expense-amount-input"]', '950');
    await page.selectOption('[data-testid="expense-category-select"]', {
      label: 'Alimentação',
    });
    await page.fill('[data-testid="expense-date-input"]', new Date().toISOString().split('T')[0]);
    await page.click('[data-testid="save-button"]');
    await page.waitForTimeout(500);

    // Criar desejo que ultrapassa orçamento
    await page.goto('/wishes');
    await page.click('[data-testid="add-wish-button"]');
    await page.fill('[data-testid="wish-name-input"]', 'Restaurante');
    await page.selectOption('[data-testid="wish-category-select"]', {
      label: 'Alimentação',
    });
    await page.fill('[data-testid="wish-amount-input"]', '100');
    await page.click('[data-testid="save-button"]');
    await page.waitForTimeout(500);

    // Marcar como comprado
    await page.click('[data-testid="purchase-wish-button"]');
    
    // Primeira confirmação
    await page.waitForSelector('[data-testid="confirm-purchase-dialog"]');
    await page.click('[data-testid="confirm-purchase-button"]');

    // Deve aparecer aviso de orçamento ultrapassado
    await page.waitForSelector('[data-testid="budget-warning-dialog"]');
    await expect(page.locator('text=orçamento máximo')).toBeVisible();
    
    // Confirmar mesmo assim
    await page.click('[data-testid="confirm-anyway-button"]');
    await page.waitForTimeout(1000);

    // Verificar que foi criado mesmo assim
    await page.goto('/expenses');
    await expect(page.locator('text=Restaurante')).toBeVisible();
  });
});
```

## Exemplo 4: Teste de Responsividade

```typescript
// tests/e2e/responsive.spec.ts
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

test.describe('Layout Responsivo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  for (const viewport of viewports) {
    test(`should work correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Testar sidebar
      if (viewport.width < 768) {
        // Mobile: sidebar deve estar colapsado
        await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible();
        // Ou deve estar como drawer
      } else {
        // Desktop: sidebar visível
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
      }

      // Testar cards do dashboard
      await expect(page.locator('[data-testid="balance-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="revenue-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="expense-card"]')).toBeVisible();
    });
  }
});
```

## Helpers E2E

```typescript
// tests/e2e/helpers/auth.ts
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

export async function createTestUser(page: Page) {
  await page.goto('/register');
  const email = `test-${Date.now()}@example.com`;
  await page.fill('[data-testid="name-input"]', 'Test User');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.fill('[data-testid="confirm-password-input"]', 'password123');
  await page.click('[data-testid="register-button"]');
  await page.waitForURL('/login');
  return { email, password: 'password123' };
}
```

## Estrutura de Testes E2E

```
tests/
├── e2e/
│   ├── auth-dashboard.spec.ts
│   ├── category-expense-flow.spec.ts
│   ├── wish-purchase-flow.spec.ts
│   ├── responsive.spec.ts
│   ├── helpers/
│   │   ├── auth.ts
│   │   ├── category.ts
│   │   └── ...
│   └── fixtures/
│       └── test-data.json
```

## Comandos de Execução

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar em modo UI
npm run test:e2e:ui

# Executar apenas em Chrome
npm run test:e2e -- --project=chromium

# Executar com debug
npm run test:e2e -- --debug
```

## Cobertura E2E

- **Fluxos Críticos**: Login, Dashboard, CRUD básico
- **Fluxos de Negócio**: Criar categoria → Criar despesa → Ver estatísticas
- **Responsividade**: Principais breakpoints
- **Cross-browser**: Chrome, Firefox, Safari, Mobile

---

**Versão**: 1.0  
**Última Atualização**: 2024



