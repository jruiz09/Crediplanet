import { Box, Typography, Button, Container } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        bgcolor: "secondary.main",
        width: "100%", // ✅ se adapta sin desbordar
        minHeight: "100vh",     // 🔁 ocupa todo el alto
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" color="primary" fontWeight="bold" gutterBottom>
          Crediplanet
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Créditos diarios, humanos y sin vueltas.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          ¡QUIERO MI CRÉDITO!
        </Button>
      </Container>
    </Box>
  );
}
