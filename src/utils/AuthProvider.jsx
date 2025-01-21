import React, { createContext, useState, useEffect } from "react";
import { apiClient, getToken, clearToken } from "./axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Usuario autenticado
    const [loading, setLoading] = useState(true); // Estado de carga

    const VALIDATE_TOKEN_ENDPOINT = import.meta.env.VITE_VALIDATE_TOKEN_ENDPOINT;
    const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT;
    const REGISTER_ENDPOINT = import.meta.env.VITE_REGISTER_ENDPOINT;

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = getToken();
                if (token) {
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        const response = await apiClient.get(VALIDATE_TOKEN_ENDPOINT, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (response?.data?.success) {
                            const userData = { token };
                            setUser(userData);
                            localStorage.setItem("user", JSON.stringify(userData));
                        } else {
                            clearToken();
                        }
                    }
                }
            } catch (error) {
                console.error("Error en ValidateToken:", error);
                clearToken();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post(LOGIN_ENDPOINT, { email, password });
            const userMapped = {
                id: response.data.idCliente,
                nombre: response.data.name,
                lastname: response.data.lastname,
                cedula: response.data.cedula,
                token: response.data.token,
                email: response.data.email,
            };

            localStorage.setItem("token", userMapped.token);
            localStorage.setItem("user", JSON.stringify(userMapped));
            setUser(userMapped);

            return true;
        } catch (error) {
            console.error("Error en el login:", error);
            return false;
        }
    };

    const logout = () => {
        try {
            clearToken();
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const register = async (data) => {
        try {
            const response = await apiClient.post(REGISTER_ENDPOINT, data);
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return error.response.data;
            }

            return { success: false, message: "Ocurrió un error inesperado." };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
