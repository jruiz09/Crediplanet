import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Fade,
  Paper,
} from "@mui/material";
import {
  getClientes,
  getResumenClienteEstado,
  getResumenClienteUltimosCreditos,
  getResumenClienteUltimosCreditosDetalles,
  getRefinanciados,
} from "../services/Clientes";

const getColorByEstado = (estado) => {
  switch (estado) {
    case "Finalizado":
      return "success";
    case "En Proceso":
      return "warning";
    case "Pendiente":
      return "error";
    default:
      return "default";
  }
};

const getColorByDias = (dias) => {
  if (dias === 0) return "success";
  if (dias <= 4) return "warning";
  return "error";
};
// ... (imports y datos mock como ya los tenés arriba)

export default function ResumenCliente() {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [clientes, setClientes] = useState([]);
  const [resumenEstado, setResumenEstado] = useState([]);
  const [resumenCreditos, setResumenCreditos] = useState([]);
  const [detalleCuotas, setDetallesCuotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fechaPrimerCredito, setFechaPrimerCredito] = useState(null);
  const [tieneRefinanciados, setTieneRefinanciados] = useState(false);


  const [evaluacion, setEvaluacion] = useState({
    mensaje: "",
    color: "",
    bg: "",
  });
  const [formasPago, setFormasPago] = useState({
    Efectivo: 0,
    Transferencia: 0,
  });

  const manejarError = (error) => {
    const message = error?.response?.data?.message;
    console.log("Error: ", message);
    if (message === "Unauthorized!") {
      localStorage.clear();
      navigate("/auth/login");
    }
  };

  const fetchClientes = async () => {
    const clientesData = await getClientes(token);
    if (clientesData.status === 200) {
      setClientes(clientesData.data);
    } else {
      console.log("Error: ", clientesData.response.data.message);
      if (clientesData.response.data.message === "Unauthorized!") {
        localStorage.clear();
        navigate("/auth/login");
      }
    }
  };

  const calcularEvaluacion = (idCliente) => {
    const cuotas = detalleCuotas.filter((c) =>
      resumenCreditos.map((r) => r.idcredito).includes(c.idcredito)
    );

    console.log("cuotas", cuotas);
    const totalCuotas = cuotas.length;
    const cuotasAltoRiesgo = cuotas.filter((c) => c.diasdeatraso > 4).length;
    const porcentajeAltoRiesgo = (cuotasAltoRiesgo / totalCuotas) * 100;

    console.log("Cuotasalto riesgo ", cuotasAltoRiesgo);

    console.log("totalCuotas ", totalCuotas);

    console.log("porcentaje ", porcentajeAltoRiesgo);

    const altoRiesgo = porcentajeAltoRiesgo >= 20;
    const riesgoModerado =
      porcentajeAltoRiesgo >= 5 && porcentajeAltoRiesgo <= 20;

    if (altoRiesgo) {
      setEvaluacion({
        mensaje:
          "❌ De los últimos 3 creditos, pago fuera de termino mayor a 4 días el " +
          Math.round(porcentajeAltoRiesgo) +
          "% de las cuotas.",
        color: "error.main",
        bg: "#ffebee",
      });
    } else if (riesgoModerado) {
      setEvaluacion({
        mensaje:
          "⚠️ De los últimos 3 creditos, pago fuera de termino mayor a 4 días el " +
          Math.round(porcentajeAltoRiesgo) +
          "% de las cuotas.",
        color: "warning.main",
        bg: "#fff8e1",
      });
    } else {
      setEvaluacion({
        mensaje:
          "✅ De los últimos 3 creditos, pago fuera de termino mayor a 4 días el " +
          Math.round(porcentajeAltoRiesgo) +
          "% de las cuotas.",
        color: "success.main",
        bg: "#e8f5e9",
      });
    }
  };

  const calcularFormasPago = (idCliente) => {
    const cuotas = detalleCuotas.filter((c) =>
      resumenCreditos.map((r) => r.idcredito).includes(c.idcredito)
    );
    const total = cuotas.length;
    const efectivo = cuotas.filter(
      (c) => c.tipotransaccion === "Efectivo"
    ).length;
    const transferencia = cuotas.filter(
      (c) => c.tipotransaccion === "Transferencia"
    ).length;

    setFormasPago({
      Efectivo: total ? Math.round((efectivo / total) * 100) : 0,
      Transferencia: total ? Math.round((transferencia / total) * 100) : 0,
    });
  };

  const handleClienteChange = async (event) => {
    setDetallesCuotas("");
    setResumenCreditos("");
    setResumenEstado("");

    const idCliente = event.target.value;
    setClienteSeleccionado(idCliente);
    setLoading(true); // CORREGIDO
    try {
      // Fetch datos del cliente seleccionado
   const [
  detallesData,
  resumenCreditosData,
  resumenEstadoData,
  refinanciadosData,
] = await Promise.all([
  getResumenClienteUltimosCreditosDetalles(idCliente, token),
  getResumenClienteUltimosCreditos(idCliente, token),
  getResumenClienteEstado(idCliente, token),
  getRefinanciados(idCliente, token), // 👈 NUEVO
]);


      if (
  detallesData.status === 200 &&
  resumenCreditosData.status === 200 &&
  resumenEstadoData.status === 200
) {
  setDetallesCuotas(detallesData.data);
  setResumenCreditos(resumenCreditosData.data);
  setResumenEstado(resumenEstadoData.data);

  // 👇 lógica de refinanciados
  setTieneRefinanciados(
  Array.isArray(refinanciadosData?.data) &&
  refinanciadosData.data.length > 0 &&
  refinanciadosData.data[0].refinanciado === 1
);

} else {
  manejarError(detallesData);
  manejarError(resumenCreditosData);
  manejarError(resumenEstadoData);
}

    } catch (error) {
      console.error("Error al obtener datos del cliente:", error);
      manejarError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (detalleCuotas.length > 0 && resumenCreditos.length > 0) {
      calcularEvaluacion(clienteSeleccionado);
      calcularFormasPago(clienteSeleccionado);

      // Calcular fecha del primer crédito
      const fechas = resumenEstado
        .map((estado) => new Date(estado.fecha))
        .filter((f) => !isNaN(f)); // validación de fechas válidas

      if (fechas.length > 0) {
        const fechaMin = new Date(Math.min(...fechas));
        setFechaPrimerCredito(fechaMin.toLocaleDateString("es-AR"));
      }
    }
  }, [detalleCuotas, resumenCreditos, resumenEstado]);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        📊 Evaluación de Riesgo Crediticio
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Seleccionar Cliente</InputLabel>
        <Select
          value={clienteSeleccionado}
          onChange={handleClienteChange}
          label="Seleccionar Cliente"
        >
          {clientes.map((cliente) => (
            <MenuItem key={cliente.idcliente} value={cliente.idcliente}>
              {cliente.nombreyapellido}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : clienteSeleccionado ? (
        <Fade in={!loading}>
          <Box>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: evaluacion.bg,
                borderLeft: `8px solid ${evaluacion.color}`,
                mb: 4,
              }}
            >
              {tieneRefinanciados && (
  <Chip
    label="⚠️ Cliente con créditos refinanciados"
    color="error"
    sx={{ mt: 2 }}
  />
)}
              <Box p={2}>
                <Typography variant="h5" gutterBottom>
                  Evaluación General del Cliente
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {evaluacion.mensaje}
                </Typography>
              </Box>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📌 Resumen de Estados
                    </Typography>
                    {fechaPrimerCredito && (
                      <Typography variant="subtitle2" gutterBottom>
                        🗓️ Fecha de Primer Crédito: {fechaPrimerCredito}
                      </Typography>
                    )}
                    {resumenEstado.map((estado) => (
                      <Chip
                        key={estado.estado}
                        label={`${estado.estado}: ${estado.Cantidad}`}
                        color={getColorByEstado(estado.estado)}
                        sx={{ mr: 1, mt: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💳 Últimos 3 Créditos
                    </Typography>
                    {resumenCreditos.map((credito) => (
                      <Box key={credito.idcredito} sx={{ mt: 1 }}>
                        <Typography variant="subtitle2">
                          Crédito #{credito.idcredito} — Monto: $
                          {credito.monto?.toLocaleString("es-AR")}
                        </Typography>
                        <Chip
                          label={`Sin Atraso: ${credito.sinatraso}`}
                          color="success"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          label={`Mayor o igual a 4 días: ${credito.atrasohasta4dias}`}
                          color="warning"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          label={`Mayor a 4 días: ${credito.atrasomas4dias}`}
                          color="error"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💰 Forma de Pago Utilizada
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`Transferencia: ${formasPago.Transferencia}%`}
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label={`Efectivo: ${formasPago.Efectivo}%`}
                        color="secondary"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      ) : null}
    </Container>
  );
}
