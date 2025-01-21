import axios from "axios";

// Crear cliente Axios
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
});

// Función para limpiar el token del almacenamiento
export const clearToken = () => {
    try {
        localStorage.removeItem("token");
    } catch (error) {
        console.error("Error al limpiar el token:", error);
    }
};

// Función para manejar errores de autorización
export const handleUnauthorizedError = (navigate) => {
    clearToken();
    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    navigate("/login");
};

// Función para obtener el token
export const getToken = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("No se encontró un token almacenado.");
        }
        return token;
    } catch (error) {
        console.error("Error al obtener el token:", error);
        return null;
    }
};

// Interceptor de solicitudes
apiClient.interceptors.request.use(
    (config) => {
        try {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error en el interceptor de solicitud:", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuestas
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                return Promise.reject({ isUnauthorized: true });
            }
        }
        console.error("Error en la respuesta HTTP:", error);
        return Promise.reject(error);
    }
);
