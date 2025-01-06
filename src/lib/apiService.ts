import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost/api';

const apiService = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: baseUrl,
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        }
    });
};

export const apiServiceFetcher = (url: string) => apiService()
                                                        .get(url)
                                                        .then(res => res.data);

export default apiService;