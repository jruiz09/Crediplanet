import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        textAlign: "center",
        py: 4,
        width: "100%",
      }}
      id="contacto"
    >
      <Container maxWidth="md">
        <Typography variant="body1" fontWeight="bold">
          © {new Date().getFullYear()} Crediplanet — Todos los derechos reservados
        </Typography>
      </Container>
    </Box>
  );
}
