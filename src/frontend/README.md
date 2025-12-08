# Frontend - Sistema de Controle Financeiro

Frontend desenvolvido com React 19, TypeScript, Vite, shadcn/ui e Tailwind CSS.

## 🚀 Tecnologias

- **React 19**: Framework JavaScript
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **shadcn/ui**: Componentes UI
- **Tailwind CSS**: Estilização
- **React Router**: Roteamento
- **Zustand**: Gerenciamento de estado
- **React Hook Form + Zod**: Formulários e validação
- **Axios**: Cliente HTTP
- **Lucide React**: Ícones

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura

```
src/
├── components/       # Componentes React
│   ├── ui/          # Componentes shadcn/ui
│   ├── layout/      # Layout (Sidebar, Navbar)
│   ├── auth/        # Componentes de autenticação
│   ├── revenues/    # Componentes de receitas
│   ├── expenses/    # Componentes de despesas
│   └── categories/  # Componentes de categorias
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks
├── stores/          # Zustand stores
├── services/        # Serviços de API
├── utils/           # Utilitários
├── types/           # Tipos TypeScript
└── lib/             # Bibliotecas e configurações
```

## 🔧 Configuração

O frontend está configurado para se conectar ao backend em `http://localhost:3000` através do proxy do Vite.

Para alterar a URL da API, edite `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

## 🎨 Design System

O projeto utiliza o design system do shadcn/ui com tokens customizados para finanças:
- Cores semânticas (receitas, despesas, saldo)
- Tipografia (Inter)
- Espaçamento (8px base)
- Componentes acessíveis

## 🔐 Autenticação

A autenticação é gerenciada através do Zustand store (`authStore`) e tokens JWT são armazenados no localStorage.

## 📱 Responsividade

O layout é responsivo e adapta-se a:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test
```

## 📚 Documentação

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)





