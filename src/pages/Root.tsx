import Loading from '@/components/loading';
import { useUser } from '@/hooks/use-user';
import { Navigate } from 'react-router-dom';

export default function RootPage() {
    const { user, loading, error, isAuthenticated } = useUser();

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Terjadi kesalahan. Harap coba lagi</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user.role === 'admin') {
        return <Navigate to="/admin" />;
    }

    if (user.role === 'user') {
        return <Navigate to="/user" />;
    }

    return <Navigate to="/login" />;
}