import { Box, Typography, Container } from "@mui/material";

export default function Nosotros() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          ¿Quiénes somos?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          En <strong>Crediplanet</strong> ofrecemos créditos diarios con trato humano y atención personalizada.
          Creemos en la cercanía y el acompañamiento en cada paso para brindar soluciones simples, claras y accesibles.
        </Typography>
      </Container>
    </Box>
  );
}
