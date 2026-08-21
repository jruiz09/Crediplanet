import { Box, Grid, Paper, Typography } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const servicios = [
  {
    icon: <AccountBalanceIcon fontSize="large" color="primary" />,
    texto: "Créditos diarios personalizados",
  },
  {
    icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />,
    texto: "Préstamos con mínima documentación",
  },
  {
    icon: <PeopleAltIcon fontSize="large" color="primary" />,
    texto: "Asistencia personalizada en todo momento",
  },
];

export default function Servicios() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fafafa",
        py: 10,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Nuestros Servicios
      </Typography>

      <Grid container spacing={4} justifyContent="center" mt={4}>
        {servicios.map((serv, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                borderRadius: 3,
              }}
            >
              {serv.icon}
              <Typography variant="h6">{serv.texto}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
