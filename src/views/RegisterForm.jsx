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

const RegisterForm = () => {
    const { register, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        cedula: Yup.string()
            .required("La cédula es obligatoria")
            .matches(/^\d+$/, "La cédula debe contener solo números"),
        nombre: Yup.string()
            .required("El nombre es obligatorio")
            .min(2, "El nombre debe tener al menos 2 caracteres"),
        apellido: Yup.string()
            .required("El apellido es obligatorio")
            .min(2, "El apellido debe tener al menos 2 caracteres"),
        telefono: Yup.string()
            .required("El teléfono es obligatorio")
            .matches(/^\d+$/, "El teléfono debe contener solo números")
            .min(8, "El teléfono debe tener al menos 8 dígitos"),
        email: Yup.string()
            .email("Correo electrónico inválido")
            .required("El correo es obligatorio"),
        password: Yup.string()
            .required("La contraseña es obligatoria")
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
        fechaNacimiento: Yup.date()
            .required("La fecha de nacimiento es obligatoria")
            .max(new Date(new Date().getFullYear() - 3, 11, 31), "La fecha de nacimiento no puede ser del mismo año actual")
            .min(new Date(new Date().getFullYear() - 100, 0, 1), "La fecha de nacimiento no puede ser mayor a 100 años")

    });

    const handleRegister = async (values, { setSubmitting }) => {
        setLoading(true);
        try {
            const response = await register(values);
            if (response?.success) {
                setModalMessage("¡Registro exitoso! Ahora se iniciará sesión.");
                setModalOpen(true);
            } else {
                setModalMessage(response?.message || "Error al registrar.");
                setModalOpen(true);
            }
        } catch (error) {
            setModalMessage(
                "Ocurrió un error inesperado. Por favor, inténtalo nuevamente."
            );
            setModalOpen(true);
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    const handleModalClose = async () => {
        setModalOpen(false);
        if (modalMessage.includes("Registro exitoso")) {
            const loginResponse = await login();
            if (loginResponse) {
                navigate("/");
            }
        }
    };

    return (
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
            <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography
                        variant="h5"
                        component="h1"
                        textAlign="center"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Registrarse
                    </Typography>

                    <Formik
                        initialValues={{
                            cedula: "",
                            nombre: "",
                            apellido: "",
                            telefono: "",
                            email: "",
                            password: "",
                            fechaNacimiento: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleRegister}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            setFieldValue,
                        }) => (
                            <Box>
                                <TextField
                                    label="Cédula"
                                    fullWidth
                                    variant="outlined"
                                    value={values.cedula}
                                    onChange={handleChange("cedula")}
                                    onBlur={handleBlur("cedula")}
                                    error={touched.cedula && !!errors.cedula}
                                    helperText={touched.cedula && errors.cedula}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Nombre"
                                    fullWidth
                                    variant="outlined"
                                    value={values.nombre}
                                    onChange={handleChange("nombre")}
                                    onBlur={handleBlur("nombre")}
                                    error={touched.nombre && !!errors.nombre}
                                    helperText={touched.nombre && errors.nombre}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Apellido"
                                    fullWidth
                                    variant="outlined"
                                    value={values.apellido}
                                    onChange={handleChange("apellido")}
                                    onBlur={handleBlur("apellido")}
                                    error={touched.apellido && !!errors.apellido}
                                    helperText={touched.apellido && errors.apellido}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Teléfono"
                                    fullWidth
                                    variant="outlined"
                                    value={values.telefono}
                                    onChange={handleChange("telefono")}
                                    onBlur={handleBlur("telefono")}
                                    error={touched.telefono && !!errors.telefono}
                                    helperText={touched.telefono && errors.telefono}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Correo Electrónico"
                                    fullWidth
                                    variant="outlined"
                                    value={values.email}
                                    onChange={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    error={touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Contraseña"
                                    fullWidth
                                    variant="outlined"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    error={touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Fecha de Nacimiento"
                                    fullWidth
                                    variant="outlined"
                                    type="date"
                                    value={values.fechaNacimiento}
                                    onChange={(e) =>
                                        setFieldValue("fechaNacimiento", e.target.value)
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    error={
                                        touched.fechaNacimiento &&
                                        !!errors.fechaNacimiento
                                    }
                                    helperText={
                                        touched.fechaNacimiento &&
                                        errors.fechaNacimiento
                                    }
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ backgroundColor: "#4CAF50", mb: 2 }}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                                    ) : (
                                        "Registrarse"
                                    )}
                                </Button>
                                <Typography textAlign="center">
                                    ¿Ya tienes una cuenta?{" "}
                                    <Button
                                        variant="text"
                                        onClick={() => navigate("/login")}
                                        sx={{ color: "#4CAF50" }}
                                    >
                                        Inicia sesión
                                    </Button>
                                </Typography>
                            </Box>
                        )}
                    </Formik>
                </CardContent>
            </Card>

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography id="modal-description" sx={{ mb: 2 }}>
                        {modalMessage}
                    </Typography>
                    <Button variant="contained" onClick={handleModalClose}>
                        Continuar
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default RegisterForm;
