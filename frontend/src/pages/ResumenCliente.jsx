import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Fade,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Alert,
  Divider,
  Stack,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import {
  getClientes,
  getResumenClienteEstado,
  getResumenClienteUltimosCreditos,
  getResumenClienteUltimosCreditosDetalles,
  getCreditosRefinanciados,
} from "../services/Clientes";
import { getDetallexCredito } from "../services/CreditoDetalles";
import { formatearFecha } from "../components/utils/FormatearFecha";
import { formatearNumero } from "../components/utils/FormatearNumero";

const getColorByEstado = (estado) => {
  switch (estado) {
    case "Finalizado":
      return "success";
    case "En Proceso":
      return "warning";
    case "Pendiente":
    case "Refinanciado":
      return "error";
    default:
      return "default";
  }
};

const getColorByDias = (dias) => {
  if (dias <= 0) return "success";
  if (dias <= 4) return "warning";
  return "error";
};

const getColorByEstadoCuota = (estado) => {
  switch (estado) {
    case "Pago Registrado":
      return "success";
    case "Pago Parcial":
      return "warning";
    case "Pendiente":
      return "error";
    default:
      return "default";
  }
};

const NIVELES_RIESGO = {
  alto: { titulo: "Riesgo alto", icono: "❌", color: "error.main", bg: "#ffebee" },
  moderado: { titulo: "Riesgo moderado", icono: "⚠️", color: "warning.main", bg: "#fff8e1" },
  bajo: { titulo: "Riesgo bajo", icono: "✅", color: "success.main", bg: "#e8f5e9" },
  sindatos: { titulo: "Sin historial", icono: "ℹ️", color: "info.main", bg: "#e3f2fd" },
};

const pesos = (monto) => "$" + formatearNumero(monto || 0);

const diasDeAtraso = (cuota) => {
  if (!cuota.fechapago || !cuota.fechaedicion || cuota.estado === "Pendiente")
    return null;
  // Mismo criterio que DATEDIFF(fechaedicion, fechapago) del backend
  const pago = Date.parse(String(cuota.fechapago).slice(0, 10));
  const registro = Date.parse(String(cuota.fechaedicion).slice(0, 10));
  return Math.round((registro - pago) / 86400000);
};

const BarraCuotas = ({ credito }) => {
  const tramos = [
    { label: "Sin atraso", valor: credito.sinatraso || 0, color: "success.main" },
    { label: "1 a 4 días", valor: credito.atrasohasta4dias || 0, color: "warning.main" },
    { label: "Más de 4 días", valor: credito.atrasomas4dias || 0, color: "error.main" },
    { label: "Refinanciadas", valor: credito.cuotasrefinanciadas || 0, color: "grey.500" },
  ];
  const total = tramos.reduce((acc, t) => acc + t.valor, 0);
  if (!total) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          height: 10,
          borderRadius: 5,
          overflow: "hidden",
          bgcolor: "grey.200",
        }}
      >
        {tramos
          .filter((t) => t.valor > 0)
          .map((t) => (
            <Tooltip key={t.label} title={`${t.label}: ${t.valor}`}>
              <Box sx={{ width: `${(t.valor / total) * 100}%`, bgcolor: t.color }} />
            </Tooltip>
          ))}
      </Box>
      <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={0.5} sx={{ mt: 1 }}>
        {tramos
          .filter((t) => t.valor > 0 || t.label !== "Refinanciadas")
          .map((t) => (
            <Stack key={t.label} direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: t.color }} />
              <Typography variant="caption" color="text.secondary">
                {t.label}: <strong>{t.valor}</strong>
              </Typography>
            </Stack>
          ))}
      </Stack>
    </Box>
  );
};

const AvisoRefinanciado = ({ credito, onVerCredito }) => (
  <Alert
    severity="error"
    variant="outlined"
    icon={<AutorenewIcon fontSize="small" />}
    sx={{ mt: 1.5, py: 0, alignItems: "center" }}
    action={
      credito.refinanciadoen && (
        <Button
          size="small"
          color="error"
          endIcon={<ArrowForwardIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onVerCredito(credito.refinanciadoen);
          }}
        >
          Ver #{credito.refinanciadoen.idcredito}
        </Button>
      )
    }
  >
    <Typography variant="body2">
      Refinanciado
      {credito.cuotasrefinanciadas > 0 && ` (${credito.cuotasrefinanciadas} cuotas)`}
      {credito.fecharefinanciacion && ` el ${formatearFecha(credito.fecharefinanciacion)}`}
      {credito.refinanciadoen
        ? ` en el crédito #${credito.refinanciadoen.idcredito} por ${pesos(
            credito.refinanciadoen.monto
          )}`
        : " — no se encontró el crédito nuevo"}
    </Typography>
  </Alert>
);

const CreditoCard = ({ credito, onVerCredito }) => (
  <Card
    variant="outlined"
    onClick={() => onVerCredito(credito)}
    sx={{
      p: 2,
      cursor: "pointer",
      transition: "box-shadow .2s, border-color .2s",
      "&:hover": { boxShadow: 3, borderColor: "primary.main" },
    }}
  >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Crédito #{credito.idcredito}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pesos(credito.monto)}
            {credito.fechainicio && ` · Inicio ${formatearFecha(credito.fechainicio)}`}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {credito.estado && (
            <Chip size="small" label={credito.estado} color={getColorByEstado(credito.estado)} />
          )}
          <Typography variant="caption" color="primary" fontWeight={600}>
            Ver detalle
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ mt: 1.5 }}>
        <BarraCuotas credito={credito} />
      </Box>
      {(credito.cuotasrefinanciadas > 0 || credito.estado === "Refinanciado") && (
        <AvisoRefinanciado credito={credito} onVerCredito={onVerCredito} />
      )}
  </Card>
);

const CreditoDetalleModal = ({ credito, onClose, onVerCredito, token }) => {
  const [cuotas, setCuotas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!credito) return;
    const fetchCuotas = async () => {
      setCuotas([]);
      setCargando(true);
      const detalleData = await getDetallexCredito(credito.idcredito, token);
      if (detalleData.status === 200) {
        setCuotas(detalleData.data);
      } else {
        console.log("Error: ", detalleData?.response?.data?.message);
      }
      setCargando(false);
    };
    fetchCuotas();
  }, [credito]);

  const totalPagado = cuotas
    .filter((c) => !c.refinanciado)
    .reduce((acc, c) => acc + (c.montopago || 0), 0);
  const refinanciadas = cuotas.filter((c) => c.refinanciado);
  const saldoRefinanciado = refinanciadas.reduce((acc, c) => acc + (c.monto || 0), 0);

  return (
    <Dialog open={!!credito} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <span>Crédito #{credito?.idcredito}</span>
          {credito?.monto != null && (
            <Typography variant="h6" color="text.secondary" component="span">
              {pesos(credito.monto)}
            </Typography>
          )}
          {credito?.estado && (
            <Chip label={credito.estado} color={getColorByEstado(credito.estado)} size="small" />
          )}
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {credito?.refinanciadoen && (
          <Alert
            severity="error"
            icon={<AutorenewIcon />}
            sx={{ mb: 2 }}
            action={
              <Button
                color="error"
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => onVerCredito(credito.refinanciadoen)}
              >
                Ver crédito #{credito.refinanciadoen.idcredito}
              </Button>
            }
          >
            Este crédito fue refinanciado en el crédito #{credito.refinanciadoen.idcredito} (
            {pesos(credito.refinanciadoen.monto)} — {credito.refinanciadoen.estado}).
          </Alert>
        )}
        {cargando ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : cuotas.length === 0 ? (
          <Typography color="text.secondary">El crédito no tiene cuotas.</Typography>
        ) : (
          <>
            <Stack direction="row" spacing={3} sx={{ mb: 2 }} flexWrap="wrap">
              <Typography variant="body2">
                Cuotas: <strong>{cuotas.length}</strong>
              </Typography>
              <Typography variant="body2">
                Total pagado: <strong>{pesos(totalPagado)}</strong>
              </Typography>
              {refinanciadas.length > 0 && (
                <Typography variant="body2" color="error.main">
                  Refinanciadas: <strong>{refinanciadas.length}</strong> (
                  {pesos(saldoRefinanciado)})
                </Typography>
              )}
            </Stack>
            <TableContainer sx={{ maxHeight: "60vh" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Cuota</TableCell>
                    <TableCell>Vencimiento</TableCell>
                    <TableCell>Registro del pago</TableCell>
                    <TableCell align="center">Días atraso</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="right">Pagado</TableCell>
                    <TableCell>Forma de pago</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Observaciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cuotas.map((cuota) => {
                    const dias = cuota.refinanciado ? null : diasDeAtraso(cuota);
                    return (
                      <TableRow
                        key={cuota.idcreditodetalle}
                        hover
                        sx={cuota.refinanciado ? { bgcolor: "#fafafa" } : undefined}
                      >
                        <TableCell>{cuota.cuota}</TableCell>
                        <TableCell>
                          {cuota.fechapago ? formatearFecha(cuota.fechapago) : "-"}
                        </TableCell>
                        <TableCell>
                          {cuota.estado !== "Pendiente" && cuota.fechaedicion
                            ? formatearFecha(cuota.fechaedicion)
                            : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {dias === null ? (
                            "-"
                          ) : (
                            <Chip label={dias} size="small" color={getColorByDias(dias)} />
                          )}
                        </TableCell>
                        <TableCell align="right">{pesos(cuota.monto)}</TableCell>
                        <TableCell align="right">
                          {cuota.refinanciado ? "-" : pesos(cuota.montopago)}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {cuota.tipotransaccion || "-"}
                        </TableCell>
                        <TableCell>
                          {cuota.refinanciado ? (
                            <Chip label="Refinanciada" size="small" color="error" variant="outlined" />
                          ) : (
                            <Chip
                              label={cuota.estado}
                              size="small"
                              color={getColorByEstadoCuota(cuota.estado)}
                            />
                          )}
                        </TableCell>
                        <TableCell>{cuota.observaciones || ""}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default function ResumenCliente() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("user-token"));
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [resumenEstado, setResumenEstado] = useState([]);
  const [resumenCreditos, setResumenCreditos] = useState([]);
  const [detalleCuotas, setDetallesCuotas] = useState([]);
  const [creditosRefinanciados, setCreditosRefinanciados] = useState([]);
  const [creditoSeleccionado, setCreditoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

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
      manejarError(clientesData);
    }
  };

  const handleClienteChange = async (_event, nuevoCliente) => {
    setCliente(nuevoCliente);
    setDetallesCuotas([]);
    setResumenCreditos([]);
    setResumenEstado([]);
    setCreditosRefinanciados([]);
    if (!nuevoCliente) return;

    const idCliente = nuevoCliente.idcliente;
    setLoading(true);
    try {
      const [detallesData, resumenCreditosData, resumenEstadoData, refinanciadosData] =
        await Promise.all([
          getResumenClienteUltimosCreditosDetalles(idCliente, token),
          getResumenClienteUltimosCreditos(idCliente, token),
          getResumenClienteEstado(idCliente, token),
          getCreditosRefinanciados(idCliente, token),
        ]);

      if (
        detallesData.status === 200 &&
        resumenCreditosData.status === 200 &&
        resumenEstadoData.status === 200
      ) {
        setDetallesCuotas(detallesData.data);
        setResumenCreditos(resumenCreditosData.data);
        setResumenEstado(resumenEstadoData.data);
        setCreditosRefinanciados(
          Array.isArray(refinanciadosData?.data) ? refinanciadosData.data : []
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

  // Las cuotas refinanciadas no se pagaron, no cuentan para puntualidad ni forma de pago
  const cuotasPagadas = useMemo(
    () => detalleCuotas.filter((c) => !Number(c.refinanciado)),
    [detalleCuotas]
  );

  const evaluacion = useMemo(() => {
    const total = cuotasPagadas.length;
    if (!total) return { nivel: "sindatos", porcentaje: 0, total: 0, atrasadas: 0 };
    const atrasadas = cuotasPagadas.filter((c) => c.diasdeatraso > 4).length;
    const porcentaje = (atrasadas / total) * 100;
    const nivel = porcentaje >= 20 ? "alto" : porcentaje >= 5 ? "moderado" : "bajo";
    return { nivel, porcentaje, total, atrasadas };
  }, [cuotasPagadas]);

  const formasPago = useMemo(() => {
    const conTipo = cuotasPagadas.filter((c) => c.tipotransaccion);
    const contar = (tipo) =>
      conTipo.filter((c) => c.tipotransaccion.toLowerCase() === tipo).length;
    const porcentaje = (n) => (conTipo.length ? Math.round((n / conTipo.length) * 100) : 0);
    return [
      { label: "Efectivo", valor: porcentaje(contar("efectivo")), color: "secondary" },
      { label: "Transferencia", valor: porcentaje(contar("transferencia")), color: "primary" },
    ];
  }, [cuotasPagadas]);

  const fechaPrimerCredito = useMemo(() => {
    const fechas = resumenEstado.map((e) => e.fecha).filter(Boolean).sort();
    return fechas.length ? formatearFecha(fechas[0]) : null;
  }, [resumenEstado]);

  const totalCreditos = resumenEstado.reduce((acc, e) => acc + e.Cantidad, 0);
  const idsUltimos = resumenCreditos.map((c) => c.idcredito);
  const otrosRefinanciados = creditosRefinanciados.filter(
    (c) => !idsUltimos.includes(c.idcredito)
  );
  const nivel = NIVELES_RIESGO[evaluacion.nivel];

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        📊 Evaluación de Riesgo Crediticio
      </Typography>

      <Autocomplete
        options={clientes}
        value={cliente}
        onChange={handleClienteChange}
        getOptionLabel={(c) => c.nombreyapellido || ""}
        isOptionEqualToValue={(a, b) => a.idcliente === b.idcliente}
        renderOption={(props, c) => (
          <li {...props} key={c.idcliente}>
            {c.nombreyapellido}
          </li>
        )}
        loading={!clientes.length}
        noOptionsText="No se encontraron clientes"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar cliente"
            placeholder="Escribí el nombre del cliente"
          />
        )}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : !cliente ? (
        <Paper
          variant="outlined"
          sx={{ p: 6, textAlign: "center", color: "text.secondary", borderStyle: "dashed" }}
        >
          <PersonSearchIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography>Seleccioná un cliente para ver su evaluación de riesgo.</Typography>
        </Paper>
      ) : (
        <Fade in>
          <Box>
            <Paper
              elevation={2}
              sx={{ backgroundColor: nivel.bg, borderLeft: 8, borderColor: nivel.color, mb: 3, p: 3 }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="overline" color="text.secondary">
                    Evaluación general · {cliente.nombreyapellido}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} sx={{ color: nivel.color }}>
                    {nivel.icono} {nivel.titulo}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {evaluacion.total
                      ? `En los últimos ${resumenCreditos.length} créditos pagó ${evaluacion.atrasadas} de ${evaluacion.total} cuotas con más de 4 días de atraso.`
                      : "El cliente todavía no tiene créditos finalizados para evaluar."}
                  </Typography>
                </Grid>
                {evaluacion.total > 0 && (
                  <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                    <Typography variant="h3" fontWeight={700} sx={{ color: nivel.color }}>
                      {Math.round(evaluacion.porcentaje)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      cuotas con más de 4 días de atraso
                    </Typography>
                  </Grid>
                )}
              </Grid>
              {creditosRefinanciados.length > 0 && (
                <Alert severity="error" icon={<AutorenewIcon />} sx={{ mt: 2 }}>
                  Cliente con {creditosRefinanciados.length}{" "}
                  {creditosRefinanciados.length === 1
                    ? "crédito refinanciado"
                    : "créditos refinanciados"}
                  : {creditosRefinanciados.map((c) => `#${c.idcredito}`).join(", ")}
                </Alert>
              )}
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        📌 Historial
                      </Typography>
                      <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Créditos
                          </Typography>
                          <Typography variant="h5" fontWeight={600}>
                            {totalCreditos}
                          </Typography>
                        </Box>
                        {fechaPrimerCredito && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Primer crédito
                            </Typography>
                            <Typography variant="h5" fontWeight={600}>
                              {fechaPrimerCredito}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                      <Divider sx={{ mb: 1 }} />
                      {resumenEstado.map((estado) => (
                        <Chip
                          key={estado.estado}
                          label={`${estado.estado}: ${estado.Cantidad}`}
                          color={getColorByEstado(estado.estado)}
                          size="small"
                          sx={{ mr: 1, mt: 1 }}
                        />
                      ))}
                    </CardContent>
                  </Card>

                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        💰 Forma de pago
                      </Typography>
                      {cuotasPagadas.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Sin pagos registrados.
                        </Typography>
                      ) : (
                        formasPago.map((f) => (
                          <Box key={f.label} sx={{ mt: 1.5 }}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">{f.label}</Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {f.valor}%
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={f.valor}
                              color={f.color}
                              sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                            />
                          </Box>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💳 Últimos {resumenCreditos.length || 3} créditos
                    </Typography>
                    {resumenCreditos.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No hay créditos finalizados.
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        {resumenCreditos.map((credito) => (
                          <CreditoCard
                            key={credito.idcredito}
                            credito={credito}
                            onVerCredito={setCreditoSeleccionado}
                          />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                {otrosRefinanciados.length > 0 && (
                  <Card elevation={2} sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        ♻️ Otros créditos refinanciados
                      </Typography>
                      <Stack spacing={2}>
                        {otrosRefinanciados.map((credito) => (
                          <CreditoCard
                            key={credito.idcredito}
                            credito={credito}
                            onVerCredito={setCreditoSeleccionado}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}

      <CreditoDetalleModal
        credito={creditoSeleccionado}
        onClose={() => setCreditoSeleccionado(null)}
        onVerCredito={setCreditoSeleccionado}
        token={token}
      />
    </Container>
  );
}
