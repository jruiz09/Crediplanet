import { Box, Typography } from "@mui/material";

const Bienvenida = () => {
  const usuario = localStorage.getItem("usuario");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ color: "var(--color-primario)", mb: 2 }}>
        Bienvenido a Credi-Planet
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {usuario ? `Hola ${usuario}. ` : ""}
        Todavia no tenes ninguna pantalla asignada. Pedile a un administrador que te asigne un rol con permisos.
      </Typography>
    </Box>
  );
};

export default Bienvenida;
