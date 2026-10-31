import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface LoginResult {
  success: boolean;
  message?: string;
  role?: UserRole;
}

interface RegisterResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  login: (userData: User, token?: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<LoginResult>;
  registerUser: (data: { name: string; email: string; phone: string; password: string }) => Promise<RegisterResult>;
  logout: () => void;
  switchRolePreview: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DUMMY_ACCOUNTS: Record<string, { user: User; password: string }> = {
  'admin@driveease.com': {
    user: {
      id: 1,
      name: 'Administrator DriveEase',
      email: 'admin@driveease.com',
      role: 'admin',
      phone: '081234567890',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    },
    password: 'password123',
  },
  'petugas@driveease.com': {
    user: {
      id: 2,
      name: 'Rudi Pratama (Petugas)',
      email: 'petugas@driveease.com',
      role: 'staff',
      phone: '082198765432',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
    password: 'password123',
  },
  'customer@driveease.com': {
    user: {
      id: 3,
      name: 'Budi Santoso (Customer)',
      email: 'customer@driveease.com',
      role: 'customer',
      phone: '081377889900',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    },
    password: 'password123',
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('driveease_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DUMMY_ACCOUNTS['customer@driveease.com'].user;
      }
    }
    return DUMMY_ACCOUNTS['customer@driveease.com'].user;
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

  const loginWithCredentials = async (email: string, password: string): Promise<LoginResult> => {
    // Artificial small delay for realistic UX feeling
    await new Promise((res) => setTimeout(res, 400));

    const account = DUMMY_ACCOUNTS[email.trim().toLowerCase()];
    if (!account) {
      return { success: false, message: 'Email tidak ditemukan di sistem. Silakan periksa kembali atau gunakan akun demo.' };
    }

    if (account.password !== password) {
      return { success: false, message: 'Password salah. Gunakan "password123" untuk akun demo.' };
    }

    setUser(account.user);
    localStorage.setItem('driveease_token', `mock_sanctum_token_${account.user.role}_${Date.now()}`);
    return { success: true, role: account.user.role };
  };

  const registerUser = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<RegisterResult> => {
    await new Promise((res) => setTimeout(res, 400));

    const emailKey = data.email.trim().toLowerCase();
    if (DUMMY_ACCOUNTS[emailKey]) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
    }

    const newUser: User = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };

    DUMMY_ACCOUNTS[emailKey] = {
      user: newUser,
      password: data.password,
    };

    setUser(newUser);
    localStorage.setItem('driveease_token', `mock_sanctum_token_customer_${Date.now()}`);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('driveease_user');
    localStorage.removeItem('driveease_token');
  };

  const switchRolePreview = (newRole: UserRole) => {
    const target = Object.values(DUMMY_ACCOUNTS).find((acc) => acc.user.role === newRole);
    if (target) {
      setUser(target.user);
    }
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
        loginWithCredentials,
        registerUser,
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
