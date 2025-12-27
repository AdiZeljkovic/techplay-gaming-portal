'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getCsrfToken } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                await getCsrfToken();
                await refreshUser();
            } catch {
                // Not authenticated
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const login = async (email: string, password: string) => {
        await getCsrfToken();
        await api.post('/login', { email, password });
        await refreshUser();
    };

    const logout = async () => {
        await api.post('/logout');
        setUser(null);
    };

    const register = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
        await getCsrfToken();
        await api.post('/register', data);
        await refreshUser();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                register,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
