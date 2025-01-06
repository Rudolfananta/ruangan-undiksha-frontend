import apiService from '@/lib/apiService';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { mutate } from 'swr';

export default function LogoutPage() {
    const [logoutDone, setLogoutDone] = useState(false);

    useEffect(() => {
        if (logoutDone) return;

        apiService().post('/logout')
            .then(() => {
                localStorage.removeItem('token');
                mutate('/user');
                setLogoutDone(true);
            });
    }, [logoutDone]);

    if (!logoutDone) {
        return <div>Logging out...</div>;
    }

    return <Navigate to="/login" />;
}