import React, { useEffect, useState, useContext } from "react";
import {
	Box,
	Typography,
	CircularProgress,
	Card,
	CardContent,
	CardActions,
	Button,
	Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthProvider";
import { handleUnauthorizedError } from "../utils/axios";
import { getEventos } from "../services/events";
import Grid from "@mui/material/Grid2";

export default function Main() {
	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate(); // Para navegación
	const { user } = useContext(AuthContext);

	useEffect(() => {
		async function fetchEventos() {
			setLoading(true);
			try {
				const data = await getEventos();
				setEventos(data.data);
			} catch (error) {
				if (error.isUnauthorized) {
					// Manejar error 401
					await handleUnauthorizedError(navigate);
				} else {
					console.error("Error al cargar eventos:", error);
					alert("Ocurrió un problema al cargar los eventos.");
				}
			} finally {
				setLoading(false);
			}
		}
		fetchEventos();
	}, [navigate]);

	return (
		<Box
			sx={{
				backgroundColor: "#f4f4f4",
				minHeight: "100vh",
				padding: 2,
			}}
		>
			{/* Encabezado */}
			<Box
				sx={{
					marginBottom: 2,
					padding: 2,
					backgroundColor: "#52b62c",
					color: "#fff",
					borderRadius: 1,
				}}
			>
				<Typography variant="h5" fontWeight="bold">
					Bienvenido, {user?.nombre} {user?.lastname}
				</Typography>
			</Box>

			{/* Contenido principal */}
			<Box sx={{ padding: 2 }}>
				<Typography variant="h4" fontWeight="bold" marginBottom={2}>
					Talleres
				</Typography>

				{loading ? (
					<Box sx={{ textAlign: "center", marginTop: 4 }}>
						<CircularProgress color="primary" />
					</Box>
				) : eventos.length > 0 ? (
					<Grid container spacing={2}>
						{eventos.map((evento) => (
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								key={evento.idEvento}
								width={"100%"}
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Card
									sx={{
										borderRadius: 2,
										boxShadow: 3,
										transition: "transform 0.2s",
										"&:hover": { transform: "scale(1.03)" },
										width: {
											xs: "100%", // 100% del ancho para pantallas extra pequeñas
											sm: "90%", // 90% del ancho para pantallas pequeñas
											md: "80%", // 80% del ancho para pantallas medianas
										},
										maxWidth: {
											xs: "300px", // Límite máximo de ancho en pantallas extra pequeñas
											sm: "350px", // Límite máximo en pantallas pequeñas
											md: "400px", // Límite máximo en pantallas medianas
										},
									}}
								>
									<CardContent>
										<Typography variant="h6" fontWeight="bold" marginBottom={1}>
											{evento.nombreEvento}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											📅 Fecha:{" "}
											{new Date(evento.fechaEvento).toLocaleDateString("es-ES")}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											🕒 Hora: {evento.horaEvento}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											📍 Lugar: {evento.lugarEvento}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											💵 Precio: {evento.precioEvento}$
										</Typography>
									</CardContent>
									<CardActions>
										<Button
											variant="contained"
											color="primary"
											fullWidth
											onClick={() => navigate(`/event/${evento.idEvento}`)}
											sx={{ fontWeight: "bold", color: "white" }}
										>
											Ver detalles
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				) : (
					<Alert severity="info" sx={{ marginTop: 4 }}>
						No hay Talleres para este mes.
					</Alert>
				)}
			</Box>
		</Box>
	);
}
