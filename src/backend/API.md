# API Documentation - Sistema de Controle Financeiro

## Base URL

```
http://localhost:3000/api
```

## Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Autenticação

#### POST /api/auth/register

Registra um novo usuário.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "joao@example.com",
    "name": "João Silva",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "token": "jwt-token"
}
```

---

#### POST /api/auth/login

Faz login e retorna token JWT.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "joao@example.com",
    "name": "João Silva"
  },
  "token": "jwt-token"
}
```

---

### Receitas

#### GET /api/revenues

Lista todas as receitas do usuário autenticado.

**Query Parameters:**
- `limit` (opcional): Número máximo de resultados (padrão: 100)
- `offset` (opcional): Número de resultados para pular (padrão: 0)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Salário",
      "amount": 5000.00,
      "date": "2024-01-15",
      "notes": "Salário mensal",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### POST /api/revenues

Cria uma nova receita.

**Request Body:**
```json
{
  "name": "Salário",
  "amount": 5000.00,
  "date": "2024-01-15",
  "notes": "Salário mensal"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Salário",
  "amount": 5000.00,
  "date": "2024-01-15",
  "notes": "Salário mensal",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

#### GET /api/revenues/:id

Obtém uma receita específica.

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Salário",
  "amount": 5000.00,
  "date": "2024-01-15",
  "notes": "Salário mensal",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

#### PUT /api/revenues/:id

Atualiza uma receita existente.

**Request Body:**
```json
{
  "name": "Salário Atualizado",
  "amount": 5500.00,
  "date": "2024-01-15",
  "notes": "Salário mensal com aumento"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Salário Atualizado",
  "amount": 5500.00,
  "date": "2024-01-15",
  "notes": "Salário mensal com aumento",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

#### DELETE /api/revenues/:id

Exclui uma receita.

**Response (204):** No content

---

### Despesas

#### GET /api/expenses

Lista todas as despesas do usuário autenticado.

**Query Parameters:**
- `limit` (opcional): Número máximo de resultados
- `offset` (opcional): Número de resultados para pular

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "categoryId": "uuid",
      "name": "Supermercado",
      "amount": 500.00,
      "date": "2024-01-15",
      "notes": "Compras do mês",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### POST /api/expenses

Cria uma nova despesa.

**Request Body:**
```json
{
  "name": "Supermercado",
  "amount": 500.00,
  "date": "2024-01-15",
  "categoryId": "uuid",
  "notes": "Compras do mês"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "categoryId": "uuid",
  "name": "Supermercado",
  "amount": 500.00,
  "date": "2024-01-15",
  "notes": "Compras do mês",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### Categorias

#### GET /api/categories

Lista todas as categorias do usuário com estatísticas.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Alimentação",
      "budgetMax": 1000.00,
      "totalSpent": 750.00,
      "remaining": 250.00,
      "color": "#3b82f6",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### POST /api/categories

Cria uma nova categoria.

**Request Body:**
```json
{
  "name": "Alimentação",
  "budgetMax": 1000.00,
  "color": "#3b82f6"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Alimentação",
  "budgetMax": 1000.00,
  "color": "#3b82f6",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### Dashboard

#### GET /api/dashboard

Obtém estatísticas do dashboard.

**Response (200):**
```json
{
  "totalRevenue": 5000.00,
  "totalExpense": 2000.00,
  "balance": 3000.00,
  "recentTransactions": [
    {
      "id": "uuid",
      "type": "revenue",
      "name": "Salário",
      "amount": 5000.00,
      "date": "2024-01-15"
    },
    {
      "id": "uuid",
      "type": "expense",
      "name": "Supermercado",
      "amount": 500.00,
      "date": "2024-01-15"
    }
  ]
}
```

---

## Códigos de Erro

- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Token inválido ou ausente
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## Formato de Erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": [
      {
        "path": ["name"],
        "message": "Name must be at least 2 characters"
      }
    ]
  }
}
```

---

**Documentação gerada pelo Backend Developer**  
**Versão 1.0**





