import React, { useContext, useState, useEffect } from "react";
import { AuthProvider, AuthContext } from "./utils/AuthProvider";
import { useNavigate, Outlet } from "react-router-dom";
import {
	ThemeProvider,
	createTheme,
	CssBaseline,
	CircularProgress,
	Box,
	Typography,
	IconButton,
	Tooltip,
	AppBar,
	Toolbar,
	Modal,
	Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RedeemIcon from "@mui/icons-material/Redeem";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const theme = createTheme({
	palette: {
		primary: {
			main: "#52b62c",
		},
		secondary: {
			main: "#e74c3c",
		},
		icons: {
			main: "#fff",
		},
	},
	typography: {
		fontFamily: "Roboto, Arial, sans-serif",
	},
});

export default function Layout() {
	return (
		<AuthProvider>
			<AuthConsumerLayout />
		</AuthProvider>
	);
}

function AuthConsumerLayout() {
	const { user, loading, logout } = useContext(AuthContext);
	const [isReady, setIsReady] = useState(false);
	const [logoutModalOpen, setLogoutModalOpen] = useState(false); // Estado para el modal
	const navigate = useNavigate();

	useEffect(() => {
		// Marca el layout como listo una vez montado
		setIsReady(true);
	}, []);

	useEffect(() => {
		if (isReady && !loading && !user) {
			// Redirige al login solo después de que todo esté listo
			navigate("/login");
		}
	}, [isReady, loading, user, navigate]);

	if (loading || !isReady) {
		// Muestra un spinner mientras se carga el estado de autenticación
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	// Función para cerrar sesión tras confirmar en el modal
	const handleConfirmLogout = () => {
		logout();
		setLogoutModalOpen(false); // Cierra el modal tras logout
	};

	// Renderiza el contenido principal si el usuario está autenticado
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{/* Barra de navegación */}
			<AppBar position="static" color="primary">
				<Toolbar sx={{ justifyContent: "space-between", padding: "20px" }}>
					{/* Botones de navegación con Tooltips */}
					<Tooltip title="Inicio" arrow>
						<IconButton color="icons" onClick={() => navigate("/")}>
							<HomeIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Recompensas" arrow>
						<IconButton color="icons" onClick={() => navigate("/cardpoints")}>
							<RedeemIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Perfil" arrow>
						<IconButton color="icons" onClick={() => navigate("/profile")}>
							<PersonIcon />
						</IconButton>
					</Tooltip>
					{/* Botón de logout */}
					<Tooltip title="Cerrar sesión" arrow>
						<IconButton color="icons" onClick={() => setLogoutModalOpen(true)}>
							<LogoutIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>

			{/* Modal de confirmación de logout */}
			<Modal
				open={logoutModalOpen}
				onClose={() => setLogoutModalOpen(false)}
				aria-labelledby="logout-modal-title"
				aria-describedby="logout-modal-description"
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 300,
						bgcolor: "background.paper",
						boxShadow: 24,
						borderRadius: 2,
						p: 3,
						textAlign: "center",
					}}
				>
					<Typography id="logout-modal-title" variant="h6" fontWeight="bold" mb={2}>
						¿Estás seguro de cerrar sesión?
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
						<Button
							variant="outlined"
							color="secondary"
							fullWidth
							onClick={() => setLogoutModalOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							variant="contained"
							color="primary"
							fullWidth
							onClick={handleConfirmLogout}
						>
							Confirmar
						</Button>
					</Box>
				</Box>
			</Modal>

			{/* Renderiza las rutas hijas */}
			<Outlet />
		</ThemeProvider>
	);
}
