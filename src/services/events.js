import { apiClient, getToken } from "../utils/axios";

export const getEventos = async () => {
    try {
        const token = getToken();
        const response = await apiClient.get(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GET_ALL_EVENTOS_ENDPOINT}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en getEventos:", error);
        throw error;
    }
};

export const getEventoByGuid = async (guid) => {
    try {
        const token = getToken();
        const response = await apiClient.get(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GET_EVENTO_BY_ID_ENDPOINT}?id=${guid}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en getEventoByGuid:", error);
        throw error;
    }
};

export const crearAsistncia = async (eventoId, clienteId) => {
    try {
        const token = getToken();
        const response = await apiClient.post(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADD_ASISTENCIA_ENDPOINT}?idEvento=${eventoId}&idCliente=${clienteId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en crearAsistncia:", error);
        throw error;
    }
};
