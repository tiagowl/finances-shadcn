import { RegisterForm } from '@/components/auth/register-form';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Controle Financeiro</h1>
          <p className="text-muted-foreground">Crie sua conta e comece a gerenciar suas finanças</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}





