import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  FolderTree,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  LineChart,
  Heart,
  ShoppingCart,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Receitas', href: '/revenues', icon: TrendingUp },
  { name: 'Despesas', href: '/expenses', icon: TrendingDown },
  { name: 'Categorias', href: '/categories', icon: FolderTree },
  { name: 'Receitas Mensais', href: '/monthly-revenues', icon: Calendar },
  { name: 'Despesas Mensais', href: '/monthly-expenses', icon: CalendarDays },
  { name: 'Simulação', href: '/simulation', icon: LineChart },
  { name: 'Desejos', href: '/wishes', icon: Heart },
  { name: 'Lista de Compras', href: '/shopping-list', icon: ShoppingCart },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Controle Financeiro</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

