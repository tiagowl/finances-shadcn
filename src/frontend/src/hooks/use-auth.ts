import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import type { LoginFormData, RegisterFormData } from '@/utils/validators';

export function useAuth() {
  const navigate = useNavigate();
  const { setAuth, logout: logoutStore, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const login = async (data: LoginFormData) => {
    try {
      const response = await apiService.login(data);
      setAuth(response.user, response.token);
      toast({
        title: 'Login realizado com sucesso!',
        variant: 'success',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.response?.data?.error?.message || 'Credenciais inválidas',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      const response = await apiService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(response.user, response.token);
      toast({
        title: 'Conta criada com sucesso!',
        variant: 'success',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.response?.data?.error?.message || 'Erro ao criar conta',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    await logoutStore();
    navigate('/login');
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso',
    });
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
  };
}





