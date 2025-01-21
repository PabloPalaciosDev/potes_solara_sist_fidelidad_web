import { apiClient, getToken } from "../utils/axios";

export const getCards = async (idTarjeta) => {
    try {
        const token = getToken();
        const response = await apiClient.get(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GET_CARD_BY_GUID_ENDPOINT}?id=${idTarjeta}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en getCards:", error);
        throw error;
    }
};
