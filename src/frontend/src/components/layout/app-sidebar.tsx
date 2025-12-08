import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from '@/components/ui/sidebar';
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
  LogOut,
  User2,
  ChevronUp,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={isCollapsed ? 'justify-center px-2' : ''}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className={isCollapsed ? 'justify-center w-full' : ''}>
              <Link to="/dashboard" className={isCollapsed ? 'justify-center w-full' : ''}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                  <LayoutDashboard className="size-4" />
                </div>
                {!isCollapsed && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Controle Financeiro</span>
                    <span className="truncate text-xs">Sistema de Gestão</span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Navegação</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const isSimulation = item.name === 'Simulação';
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link to={item.href} className="relative">
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                        {isSimulation && !isCollapsed && (
                          <SidebarMenuBadge className="ml-auto bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                            Beta
                          </SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={isCollapsed ? 'justify-center px-2' : ''}>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${isCollapsed ? 'justify-center w-full' : ''}`}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                    <User2 className="size-4" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.name || 'Usuário'}</span>
                        <span className="truncate text-xs">{user?.email || ''}</span>
                      </div>
                      <ChevronUp className="ml-auto size-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <User2 className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || 'Usuário'}</span>
                      <span className="truncate text-xs">{user?.email || ''}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 size-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

