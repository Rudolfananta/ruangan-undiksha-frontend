import { useUser } from '@/hooks/use-user';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from './loading';

export function RoleProtector({
    role,
    children
}: {
    role: 'admin' | 'user',
    children: ReactNode
}) {
    const { user, loading, error } = useUser();

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Terjadi kesalahan</div>
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    if (user.role === role) {
        return <>{children}</>;
    }

    return <Navigate to="/" />;
}