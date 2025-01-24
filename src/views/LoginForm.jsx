import React, { useContext, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Modal,
    CircularProgress,
    Alert,
} from "@mui/material";
import { AuthContext } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import logosolara from "../assets/potessolara.png";

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        username: Yup.string().required("El usuario es obligatorio"),
        password: Yup.string().required("La contraseña es obligatoria"),
    });

    const handleLogin = async (values, { setSubmitting }) => {
        setLoading(true); // Activa el modal de carga
        setErrorMessage("");
        try {
            const loginResponse = await login(values.username, values.password);
            if (loginResponse) {
                navigate("/");
            } else {
                setErrorMessage(
                    "No se pudo iniciar sesión. Verifica tus credenciales."
                );
            }
        } catch (error) {
            setErrorMessage("Ocurrió un error inesperado. Intenta nuevamente.");
        } finally {
            setSubmitting(false);
            setLoading(false); // Desactiva el modal de carga
        }
    };

    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
            }) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                        backgroundColor: "#f5f5f5",
                        px: 2,
                    }}
                >
                    <Card
                        sx={{
                            maxWidth: 400,
                            width: "100%",
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h5"
                                component="h1"
                                textAlign="center"
                                fontWeight="bold"
                                gutterBottom
                            >
                                Iniciar Sesión
                            </Typography>

                            <Box
                                component="img"
                                src={logosolara}
                                alt="Logo"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    display: "block",
                                    mx: "auto",
                                    mb: 2,
                                }}
                            />

                            {errorMessage && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errorMessage}
                                </Alert>
                            )}

                            <TextField
                                label="Correo electrónico"
                                variant="outlined"
                                fullWidth
                                value={values.username}
                                onChange={handleChange("username")}
                                onBlur={handleBlur("username")}
                                error={touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                label="Contraseña"
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={values.password}
                                onChange={handleChange("password")}
                                onBlur={handleBlur("password")}
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ mb: 2 }}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={isSubmitting || loading}
                                sx={{
                                    backgroundColor: "#4CAF50",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#45a049" },
                                    mb: 2,
                                }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{ color: "#fff" }}
                                    />
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </Button>

                            <Button
                                variant="text"
                                fullWidth
                                onClick={() => navigate("/register")}
                                sx={{
                                    textTransform: "none",
                                    color: "#4CAF50",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Registrarse
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Modal de carga */}
                    <Modal
                        open={loading}
                        aria-labelledby="loading-modal-title"
                        aria-describedby="loading-modal-description"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress color="primary" />
                    </Modal>
                </Box>
            )}
        </Formik>
    );
};

export default LoginForm;
