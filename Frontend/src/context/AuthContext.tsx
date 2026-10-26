import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  demoLogin: (role: UserRole) => Promise<User>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await storageService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to load current user:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, preferredRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = await storageService.getUsers();
      let match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!match && preferredRole) {
        match = users.find(u => u.role === preferredRole);
      }

      if (match) {
        await storageService.setCurrentUser(match);
        setCurrentUser(match);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const users = await storageService.getUsers();
      let match = users.find(u => u.role === role);
      if (!match) {
        // Fallback to default user array
        match = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
      }
      await storageService.setCurrentUser(match);
      setCurrentUser(match);
      return match;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    setIsLoading(true);
    try {
      const newUser = await storageService.registerUser(userData);
      setCurrentUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await storageService.setCurrentUser(null);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!currentUser) throw new Error('Not logged in');
    const updated = await storageService.updateUser(currentUser.id, updates);
    setCurrentUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
