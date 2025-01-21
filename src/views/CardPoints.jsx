import React, { useState, useContext } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Snackbar,
	CircularProgress,
	IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CakeIcon from "@mui/icons-material/Cake";
import EventIcon from "@mui/icons-material/Event";
import { AuthContext } from "../utils/AuthProvider";
import { getCards } from "../services/cards";
import { handleUnauthorizedError } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import logosolara from "../assets/potessolara.png";
import Grid from "@mui/material/Grid2";

export default function CardScreen() {
	const { user } = useContext(AuthContext);
	const [cardData, setCardData] = useState({ puntos: 0 });
	const [loading, setLoading] = useState(false);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const navigate = useNavigate();

	const fetchCardData = async () => {
		setLoading(true);
		try {
			const response = await getCards(user?.id);
			if (response?.success) {
				setCardData(response.data);
			} else {
				setSnackbarMessage(
					response?.message || "No se pudo obtener los datos.",
				);
				setSnackbarVisible(true);
			}
		} catch (error) {
			if (error.isUnauthorized) {
				await handleUnauthorizedError(navigate);
			} else {
				console.error("Error al obtener los datos:", error);
				setSnackbarMessage("Ocurrió un error al obtener los datos.");
				setSnackbarVisible(true);
			}
		} finally {
			setLoading(false);
		}
	};

	const isBirthdayToday = () => {
		if (!user?.nacimiento) return false;

		const today = new Date();
		const birthDate = new Date(user.nacimiento);

		return (
			today.getDate() === birthDate.getDate() &&
			today.getMonth() === birthDate.getMonth()
		);
	};

	const handleClaimReward = (pointsRequired) => {
		if (cardData.puntos >= pointsRequired) {
			setSnackbarMessage(
				`¡Puedes reclamar tu premio de ${pointsRequired} puntos con Potes Solara!`,
			);
		} else {
			setSnackbarMessage(
				`Necesitas ${pointsRequired} puntos para reclamar este premio.`,
			);
		}
		setSnackbarVisible(true);
	};

	const handleClaimBirthdayReward = () => {
		if (isBirthdayToday()) {
			setSnackbarMessage(
				"¡Feliz cumpleaños! 🎉 Puedes reclamar tu recompensa.",
			);
		} else {
			setSnackbarMessage("Hoy no es tu cumpleaños.");
		}
		setSnackbarVisible(true);
	};

	const renderPuntitos = () => {
		const puntos = cardData?.puntos || 0;
		return Array.from({ length: 12 }).map((_, i) => (
			<IconButton
				key={`puntito-${i}-${Math.random()}`}
				sx={{
					color: i < puntos ? "#FFD700" : "#ccc",
					fontSize: 15,
				}}
			>
				●
			</IconButton>
		));
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "#f4f4f4",
				py: 4,
			}}
		>
			<Card sx={{ width: "90%", maxWidth: 600, mb: 4 }}>
				<CardContent
					sx={{
						textAlign: "center",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<img src={logosolara} alt="Logo Solara" style={{ width: 75 }} />
					<Typography variant="h5" fontWeight="bold" color="text.primary">
						Puntos Acumulados
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
						{renderPuntitos()}
					</Box>
					<Typography variant="h6" color="primary" sx={{ mt: 2 }}>
						{cardData.puntos}/12
					</Typography>
				</CardContent>
			</Card>

			<Button
				variant="contained"
				onClick={fetchCardData}
				disabled={loading}
				sx={{
					backgroundColor: "#52b62c",
					"&:hover": { backgroundColor: "#45a049" },
					mb: 4,
					color: "#fff",
					fontWeight: "bold",
				}}
			>
				{loading ? (
					<CircularProgress size={24} sx={{ color: "#fff" }} />
				) : (
					"Consultar Puntos"
				)}
			</Button>

			<Card sx={{ width: "90%", maxWidth: 600 }}>
				<CardContent>
					<Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
						Recompensas
					</Typography>
					<Grid container spacing={2} justifyContent="center">
						<Grid
							item
							xs={12}
							width={"100%"}
							justifyContent={"center"}
							display={"flex"}
						>
							{/* Recompensas */}
							<Box
								display="flex"
								flexDirection={"column"}
								justifyContent="space-between"
								mb={2}
							>
								<Typography>Premio por 6 puntos:</Typography>
								<Button
									variant="outlined"
									onClick={() => handleClaimReward(6)}
									startIcon={
										cardData.puntos >= 6 ? (
											<CheckCircleIcon color="success" />
										) : (
											<ErrorOutlineIcon color="disabled" />
										)
									}
								>
									{cardData.puntos >= 6 ? "Disponible" : "No disponible"}
								</Button>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							width={"100%"}
							justifyContent={"center"}
							display={"flex"}
						>
							<Box
								display="flex"
								flexDirection={"column"}
								justifyContent="space-between"
								mb={2}
							>
								<Typography>Premio por 12 puntos:</Typography>
								<Button
									variant="outlined"
									onClick={() => handleClaimReward(12)}
									startIcon={
										cardData.puntos >= 12 ? (
											<CheckCircleIcon color="success" />
										) : (
											<ErrorOutlineIcon color="disabled" />
										)
									}
								>
									{cardData.puntos >= 12 ? "Disponible" : "No disponible"}
								</Button>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							width={"100%"}
							justifyContent={"center"}
							display={"flex"}
						>
							<Box
								display="flex"
								flexDirection={"column"}
								justifyContent="space-between"
								mb={2}
							>
								<Typography>Recompensa de cumpleaños:</Typography>
								<Button
									variant="outlined"
									onClick={handleClaimBirthdayReward}
									startIcon={
										isBirthdayToday() ? (
											<CakeIcon color="success" />
										) : (
											<EventIcon color="disabled" />
										)
									}
								>
									{isBirthdayToday() ? "Disponible" : "No disponible"}
								</Button>
							</Box>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Snackbar para notificaciones */}
			<Snackbar
				open={snackbarVisible}
				autoHideDuration={6000}
				onClose={() => setSnackbarVisible(false)}
				message={snackbarMessage}
				action={
					<Button
						color="inherit"
						size="small"
						onClick={() => setSnackbarVisible(false)}
					>
						Cerrar
					</Button>
				}
			/>
		</Box>
	);
}
