import axios from 'axios';
import { store } from '../Redux/store';
import { logoutUser } from '../Redux/userActions';
import { jwtDecode } from "jwt-decode";

const api = axios.create();

const dispatch = store.dispatch;

function isTokenExpired(token) {
    if (!token) return true;

    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    return decoded.exp < now;
}

api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('access');

        if (isTokenExpired(token)) {
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_APP_BASE_URL}token/refresh/`,
                        { refresh: refreshToken }
                    );

                    localStorage.setItem('access', response.data.access);
                    token = response.data.access;
                } catch (error) {
                    dispatch(logoutUser());
                    return Promise.reject(error);
                }
            } else {
                dispatch(logoutUser());
                return Promise.reject('Refresh token not available');
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_APP_BASE_URL}token/refresh/`,
                        { refresh: refreshToken }
                    );

                    localStorage.setItem('access', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    dispatch(logoutUser());
                }
            } else {
                dispatch(logoutUser());
            }
        }

        return Promise.reject(error);
    }
);

export default api;
