import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  countryCode?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAuthModalOpen: boolean;
  initialTab: 'login' | 'register';
  registerUser: (userData: User) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  login: (userData: User) => void;
  logout: () => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('my_app_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('my_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [initialTab, setInitialTab] = useState<'login' | 'register'>('register');

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('my_app_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('my_app_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('my_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const registerUser = (userData: User) => {
    setRegisteredUsers((prev) => {
      const filtered = prev.filter((u) => u.email.toLowerCase() !== userData.email.toLowerCase());
      return [...filtered, userData];
    });
  };

  const loginWithCredentials = (email: string, password: string): boolean => {
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (found) {
      setUser(found);
      setIsAuthModalOpen(false);
      return true;
    }

    return false;
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'register') => {
    setInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAuthModalOpen,
        initialTab,
        registerUser,
        loginWithCredentials,
        login,
        logout,
        openAuthModal,
        closeAuthModal,
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
