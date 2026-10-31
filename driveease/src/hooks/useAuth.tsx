import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  switchRolePreview: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_USERS: Record<UserRole, User> = {
  admin: {
    id: 1,
    name: 'Administrator DriveEase',
    email: 'admin@driveease.com',
    role: 'admin',
    phone: '081234567890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  staff: {
    id: 2,
    name: 'Rudi Pratama (Petugas)',
    email: 'petugas@driveease.com',
    role: 'staff',
    phone: '082198765432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  customer: {
    id: 3,
    name: 'Budi Santoso (Customer)',
    email: 'customer@driveease.com',
    role: 'customer',
    phone: '081377889900',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('driveease_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DUMMY_USERS.customer;
      }
    }
    // Default to customer for preview
    return DUMMY_USERS.customer;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('driveease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('driveease_user');
      localStorage.removeItem('driveease_token');
    }
  }, [user]);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('driveease_token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('driveease_user');
    localStorage.removeItem('driveease_token');
  };

  const switchRolePreview = (newRole: UserRole) => {
    setUser(DUMMY_USERS[newRole]);
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        isStaff,
        isCustomer,
        login,
        logout,
        switchRolePreview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

