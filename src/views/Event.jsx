import React, { useEffect, useState, useContext } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Modal,
    Backdrop,
    CircularProgress,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { getEventoByGuid, crearAsistncia } from "../services/events";
import { AuthContext } from "../utils/AuthProvider";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";

export default function EventScreen({ idevento }) {
    const { user } = useContext(AuthContext);
    const [evento, setEvento] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [asistido, setAsistido] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchEvento() {
            try {
                const data = await getEventoByGuid(idevento);
                setEvento(data.data);
            } catch (error) {
                console.error("Error al cargar el evento:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvento();
    }, [idevento]);

    const handleAsistencia = async () => {
        try {
            const response = await crearAsistncia(idevento, user?.id);
            setResponseMessage(response?.message || "¡Operación completada!");
            setAsistido(true);
        } catch (error) {
            console.error("Error en handleAsistencia:", error);
            setResponseMessage(
                error?.response?.message ||
                    "Hubo un error al registrar tu asistencia"
            );
        } finally {
            setModalVisible(false);
            setResponseModalVisible(true);
        }
    };

    if (loading) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f4f4", pb: 4 }}>
            {/* Header con botón de regreso */}
            <Box
                sx={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <IconButton
                    onClick={() => navigate("/")}
                    sx={{ color: "black", mr: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {evento?.nombreEvento}
                </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mb={2}
                            textAlign={"center"}
                        >
                            {evento?.nombreEvento}
                        </Typography>
                        <Typography mb={1}>
                            📅 Fecha:{" "}
                            {new Date(evento?.fechaEvento).toLocaleDateString(
                                "es-ES"
                            )}
                        </Typography>
                        <Typography mb={1}>
                            🕒 Hora: {evento?.horaEvento}
                        </Typography>
                        <Typography mb={1}>
                            📍 Lugar: {evento?.lugarEvento}
                        </Typography>
                        <Typography mb={2}>
                            💵 Precio: {evento?.precioEvento}$
                        </Typography>

                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Detalles del Taller:
                        </Typography>
                        <Typography sx={{ textAlign: "justify" }}>
                            {evento?.descripcionEvento}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Botón Apuntarse */}
                <Box textAlign="center">
                    {evento?.asistenciaEventos?.find(
                        (asistencia) => asistencia.idCliente === user?.id
                    ) ? (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#52b62c",
                                color: "white",
                                width: "80%",
                            }}
                            disabled
                        >
                            ¡Ya estás apuntado a este taller!
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#52b62c",
                                color: "white",
                                width: "80%",
                            }}
                            onClick={() => setModalVisible(true)}
                            disabled={asistido}
                        >
                            {asistido
                                ? "¡Ya estás apuntado a este taller!"
                                : "Apuntarse al taller 📝"}
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Modal de confirmación */}
            <Modal
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                closeAfterTransition
                BackdropProps={{ timeout: 500 }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        backgroundColor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        id="modal-title"
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        ¿Deseas apuntarte a este taller?
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant="outlined"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#52b62c",
                                    color: "white",
                                }}
                                onClick={handleAsistencia}
                            >
                                Confirmar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            {/* Modal de respuesta */}
            <Modal
                open={responseModalVisible}
                onClose={() => setResponseModalVisible(false)}
                aria-labelledby="response-title"
                aria-describedby="response-description"
                closeAfterTransition
                BackdropProps={{ timeout: 500 }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        backgroundColor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        id="response-title"
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        {responseMessage}
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#52b62c", color: "white" }}
                        onClick={() => setResponseModalVisible(false)}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

EventScreen.propTypes = {
    idevento: PropTypes.string.isRequired,
};
