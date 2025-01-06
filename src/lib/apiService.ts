import axios from 'axios';

const apiService = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: 'http://localhost:8000/api',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        }
    });
};

export const apiServiceFetcher = (url: string) => apiService()
                                                        .get(url)
                                                        .then(res => res.data);

export default apiService;