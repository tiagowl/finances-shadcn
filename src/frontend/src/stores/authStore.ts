import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types/api';
import { firebaseService } from '@/services/firebaseService';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: async () => {
    await firebaseService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  initialize: () => {
    // Listen to auth state changes
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await firebaseService.getUser(firebaseUser.uid);
          const token = await firebaseUser.getIdToken();
          get().setAuth(userDoc, token);
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
      set({ isLoading: false });
    });
  },
}));

