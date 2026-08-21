import { Box, Grid, Typography, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const beneficios = [
  "Sin letra chica",
  "Aprobación en minutos",
  "Atención cercana y humana",
];

export default function Beneficios() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fafafa",
        py: 10,
        px: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        ¿Por qué elegirnos?
      </Typography>

      <Grid container spacing={4} justifyContent="center" mt={4} maxWidth="md">
        {beneficios.map((b, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                borderRadius: 3,
              }}
            >
              <CheckCircleIcon color="success" fontSize="large" />
              <Typography variant="h6">{b}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
