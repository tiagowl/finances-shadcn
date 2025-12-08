import { LoginForm } from '@/components/auth/login-form';
import { Link } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const TEST_USERS = [
  { email: 'maria@teste.com', password: '12345678', name: 'Maria Silva' },
  { email: 'joao@teste.com', password: 'senha123', name: 'João Santos' },
  { email: 'ana@teste.com', password: 'teste123', name: 'Ana Costa' },
];

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Controle Financeiro</h1>
          <p className="text-muted-foreground">Gerencie suas finanças de forma simples</p>
        </div>

        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>

        <Collapsible className="mt-6">
          <CollapsibleTrigger className="group flex w-full items-center justify-center gap-1.5 text-[10px] text-muted-foreground/70 hover:text-muted-foreground transition-colors">
            <span className="uppercase tracking-wider">Dados de teste</span>
            <ChevronDown className="h-2.5 w-2.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1.5">
            <div className="rounded border border-dashed border-muted-foreground/20 bg-muted/20 p-2.5 text-[10px]">
              <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                Usuários de Teste
              </div>
              <div className="space-y-1.5">
                {TEST_USERS.map((user) => (
                  <div
                    key={user.email}
                    className="rounded border border-border/30 bg-background/40 p-1.5"
                  >
                    <div className="text-[10px] font-medium text-foreground/70">{user.name}</div>
                    <div className="mt-0.5 space-y-0.5 text-[9px] text-muted-foreground/80">
                      <div>
                        <span className="font-medium">E:</span> {user.email}
                      </div>
                      <div>
                        <span className="font-medium">S:</span>{' '}
                        <code className="rounded bg-muted/40 px-1 py-0.5 font-mono text-[9px]">
                          {user.password}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

