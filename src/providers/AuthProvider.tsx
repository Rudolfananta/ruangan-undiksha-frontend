import { apiServiceFetcher } from '@/lib/apiService';
import { AxiosError } from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

interface AuthContextProps {
    user: null | any;
    loading: boolean;
    error: null | AxiosError;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const {
        data: fetchData,
        isLoading: fetchLoading,
        error: fetchError
    } = useSWRImmutable('/user', apiServiceFetcher);

    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        if (fetchLoading) {
            setLoading(true);
            return;
        }

        setLoading(false);

        // Jika fetch error
        if (fetchError) {
            setUser(null);
            setIsAuthenticated(false);

            if (fetchError.status !== 401) {
                setError(fetchError);
            }

            return;
        }

        setError(null);
        setUser(fetchData);
        setIsAuthenticated(true);
    }, [fetchData, fetchLoading, fetchError]);

    return (
        <AuthContext.Provider value={{ user, loading, error, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}