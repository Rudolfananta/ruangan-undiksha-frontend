import { AuthContext } from '@/providers/AuthProvider';
import { useContext } from 'react';

export function useUser() {
    const context = useContext(AuthContext);
    
    return context;
}