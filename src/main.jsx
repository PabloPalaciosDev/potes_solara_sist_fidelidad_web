import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import "./index.css";
import Login from "./pages/login"; // Ruta para el login
import MainView from "./pages/main"; // Ruta principal
import EventPage from "./pages/eventpage"; // Ruta dinámica para eventos
import CardPoints from "./pages/app/cardpoints";
import Profile from "./pages/app/profile";
import Register from "./pages/register";
import { AuthProvider } from "./utils/AuthProvider";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<Router>
				<Routes>
					{/* Layout envolviendo las rutas principales */}
					<Route element={<Layout />}>
						<Route path="/" element={<MainView />} />
						<Route path="/cardpoints" element={<CardPoints />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/event/:idevento" element={<EventPage />} />{" "}
						{/* Ruta dinámica */}
					</Route>
					{/* Ruta para login */}
					<Route path="/login" element={<Login />} />
					{/* Ruta para registro */}
					<Route path="/register" element={<Register />} />
				</Routes>
			</Router>
		</AuthProvider>
	</StrictMode>,
);

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
	  navigator.serviceWorker
		.register("/sw.js")
		.then((registration) => {
		  console.log("Service Worker registrado con éxito:", registration);
		})
		.catch((registrationError) => {
		  console.log("Error al registrar el Service Worker:", registrationError);
		});
	});
  }
  