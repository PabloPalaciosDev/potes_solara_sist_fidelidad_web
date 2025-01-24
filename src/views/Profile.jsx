import React, { useContext } from "react";
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Button,
} from "@mui/material";
import { AuthContext } from "../utils/AuthProvider";
import Grid from "@mui/material/Grid2";

export default function ProfileScreen() {
    const { user } = useContext(AuthContext);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f4f4f4",
                py: 4,
                px: 2,
            }}
        >
            {/* Encabezado con avatar */}
            <Card
                sx={{
                    maxWidth: 600,
                    mx: "auto",
                    mb: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <CardContent>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            backgroundColor: "#52b62c",
                            mx: "auto",
                            mb: 2,
                            fontSize: 40,
                        }}
                    >
                        {user?.nombre?.charAt(0) || "U"}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                        {user?.nombre} {user?.lastname}
                    </Typography>
                </CardContent>
            </Card>

            {/* Detalles del perfil */}
            <Card
                sx={{
                    maxWidth: 600,
                    mx: "auto",
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <CardContent>
                    <Grid container spacing={2} justifyContent={"center"}>
                        <Grid item xs={6}>
                            <Typography variant="body1" color="text.secondary">
                                Cédula:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                {user?.cedula || "N/A"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" color="text.secondary">
                                Correo:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                {user?.email || "N/A"}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 
            <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center" }}>
                <Button
                    variant="contained"
                    sx={{ mb: 2, width: "100%", backgroundColor: "#52b62c" }}
                    onClick={() => console.log("Editar perfil")}
                >
                    Editar perfil
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    sx={{ width: "100%" }}
                    onClick={() => console.log("Cerrar sesión")}
                >
                    Cerrar sesión
                </Button>
            </Box>
            */}
        </Box>
    );
}
