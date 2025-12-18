# Configuração do Firebase

## Passo a passo para configurar o Firebase

### 1. Criar projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Preencha o nome do projeto
4. Siga as instruções para criar o projeto

### 2. Configurar Authentication

1. No painel do Firebase, vá em "Authentication"
2. Clique em "Get Started"
3. Vá na aba "Sign-in method"
4. Habilite "Email/Password"
5. Clique em "Save"

### 3. Configurar Firestore Database

1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (você pode configurar regras de segurança depois)
4. Escolha a localização do banco de dados
5. Clique em "Enable"

### 4. Obter as credenciais do Firebase

1. No painel do Firebase, clique no ícone de engrenagem ao lado de "Project Overview"
2. Clique em "Project settings"
3. Role até a seção "Your apps"
4. Clique no ícone da Web (`</>`)
5. Registre o app (pode usar qualquer nome)
6. Copie as credenciais do Firebase

### 5. Configurar variáveis de ambiente

1. No diretório `src/frontend`, crie um arquivo `.env` (se não existir)
2. Adicione as seguintes variáveis com os valores do seu projeto Firebase:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

### 6. Configurar regras de segurança do Firestore (Opcional mas recomendado)

No Firebase Console, vá em Firestore Database > Rules e use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /{collection}/{document} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Reiniciar o servidor de desenvolvimento

Após configurar as variáveis de ambiente, reinicie o servidor:

```bash
cd src/frontend
npm run dev
```

## Estrutura de coleções do Firestore

O sistema criará automaticamente as seguintes coleções:

- `users` - Dados dos usuários
- `revenues` - Receitas
- `expenses` - Despesas
- `categories` - Categorias
- `monthlyExpenses` - Despesas mensais
- `monthlyRevenues` - Receitas mensais
- `simulationExpenses` - Despesas de simulação
- `simulationRevenues` - Receitas de simulação
- `simulationCreditPurchases` - Compras no crédito
- `wishes` - Desejos
- `shoppingList` - Lista de compras
- `notifications` - Notificações

## Solução de problemas

### Erro: "Firebase: Error (auth/configuration-not-found)"

- Verifique se todas as variáveis de ambiente estão configuradas no arquivo `.env`
- Certifique-se de que o arquivo `.env` está no diretório `src/frontend`
- Reinicie o servidor de desenvolvimento após adicionar/modificar as variáveis

### Erro: "Firebase: Error (auth/invalid-api-key)"

- Verifique se a API key está correta
- Certifique-se de que copiou a API key do projeto correto no Firebase Console

### Erro: "Firebase: Error (auth/email-already-in-use)"

- O email já está cadastrado. Tente fazer login ao invés de se registrar.


