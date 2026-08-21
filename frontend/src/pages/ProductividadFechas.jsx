import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import SearchIcon from "@mui/icons-material/Search";
import { getRendicionDiaria } from "../services/Rendicion";
import { getRendicionPorCoradorDetalles } from "../services/Rendicion";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MaterialReactTable } from "material-react-table";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { formatearNumero } from "../components/utils/FormatearNumero";
import { formatearFecha } from "../components/utils/FormatearFecha";

const Productividad = () => {
  const [token] = useState(localStorage.getItem("user-token"));
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [productividad, setProductividad] = useState([]);

  // 👉 estado para el modal
  const [openModal, setOpenModal] = useState(false);
  const [detalles, setDetalles] = useState([]);

  const OnchangePickedDesde = (newValue) => {
    setFechaDesde(dayjs(newValue).format("YYYY-MM-DD"));
  };
  const OnchangePickedHasta = (newValue) => {
    setFechaHasta(dayjs(newValue).format("YYYY-MM-DD"));
  };

  const fetchProductividadActual = async (post, tokens) => {
    const productividadData = await getRendicionDiaria(post, tokens);
    if (productividadData.status === 200) {
      setProductividad(productividadData.data);
    } else {
      console.log("Error: ", productividadData.response.data.message);
    }
  };

const BuscarProductvidad = async () => {
  const Post = { fechadesde: fechaDesde, fechahasta: fechaHasta };
  if ([fechaDesde, fechaHasta].includes("")) {
    Swal.fire({
      icon: "error",
      title: "Todos los campos son obligatorios",
    });
  } else {
    // 👉 guardo las fechas usadas en la búsqueda
    localStorage.setItem("fdesde", fechaDesde);
    localStorage.setItem("fhasta", fechaHasta);

    await fetchProductividadActual(Post, token);
  }
};

  const columns = useMemo(
    () => [
      {
        accessorKey: "Fecha",
        header: "Fecha",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearFecha(row.original.Fecha)}</div>,
      },
      {
        accessorKey: "cobrador",
        header: "Cobrador",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "Estimado",
        header: "Estimado",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.Estimado)}</div>,
      },
      {
        accessorKey: "Real",
        header: "Real",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.Real)}</div>,
      },
      {
        accessorKey: "Productividad",
        header: "Productividad",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() < 80
                  ? theme.palette.error.dark
                  : theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {cell.getValue()}%
          </Box>
        ),
      },
      {
        accessorKey: "acciones",
        header: "Acciones",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleOpenDetalles(row.original)}
          >
            Ver Detalles
          </Button>
        ),
      },
    ],
    []
  );

  // 👉 columnas para el modal
  const detalleColumns = useMemo(
    () => [
      { accessorKey: "cliente", header: "Cliente" },
      { accessorKey: "idcredito", header: "Crédito" },
      { accessorKey: "Cuota", header: "Cuota" },
      {
        accessorKey: "FechaPago",
        header: "Fecha Pago",
        Cell: ({ row }) => <div>{formatearFecha(row.original.FechaPago)}</div>,
      },
      { accessorKey: "Estado", header: "Estado" },
      { accessorKey: "MontoCuota", header: "Monto Cuota" },
      { accessorKey: "MontoPago", header: "Monto Pago" },
    ],
    []
  );

  const calcularResumen = () => {
    const cuotasPendientes = detalles.filter(
      (d) => d.MontoCuota - d.MontoPago > 0
    );

    const totalCuotasPend = cuotasPendientes.length;

    const totalMontoPend = cuotasPendientes.reduce((acc, d) => {
      const saldo = Math.max(d.MontoCuota - d.MontoPago, 0);
      return acc + saldo;
    }, 0);

    return { totalCuotasPend, totalMontoPend };
  };

const handleOpenDetalles = async (row) => {
  const Post = {
    fechadesde: fechaDesde || localStorage.getItem("fdesde"),
    fechahasta: fechaHasta || localStorage.getItem("fhasta"),
    idcobrador: row.idcobrador,
  };

  console.log("POST Detalle", Post);
  const res = await getRendicionPorCoradorDetalles(Post, token);
  if (res.status === 200) {
    setDetalles(res.data);
    setOpenModal(true);
  }
};

  return (
    <>
      <BoxGeneral texto="Productividad entre Fechas">
        <Box>
          <Grid container justifyContent="center">
            <Grid sx={{ m: 1 }} item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Fecha Desde"
                      onChange={(newValue) => OnchangePickedDesde(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid sx={{ m: 1 }} item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Fecha Hasta"
                      onChange={(newValue) => OnchangePickedHasta(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid sx={{ m: 1 }} item xs={12} sm={6} md={3}>
              <Button sx={{ m: 1, p: 5 }} onClick={BuscarProductvidad}>
                <SearchIcon />
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <MaterialReactTable data={productividad} columns={columns} />
        </Box>
      </BoxGeneral>

      {/* Modal de detalles */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Detalles de Rendición</DialogTitle>
        <DialogContent>
        {detalles.length > 0 && (
            <Box
              mt={2}
              p={2}
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>
                Cuotas Pendientes: {calcularResumen().totalCuotasPend}
              </strong>
              <strong style={{ color: "red" }}>
                Monto Pendiente:{" "}
                {formatearNumero(calcularResumen().totalMontoPend)}
              </strong>
            </Box>
          )}
          <MaterialReactTable
            data={detalles}
            columns={detalleColumns}
            muiTableBodyRowProps={({ row }) => ({
              sx: {
                backgroundColor:
                  row.original.MontoPago > 0 &&
                  row.original.MontoPago < row.original.MontoCuota
                    ? "#ffe0b2" // naranja claro (parcial)
                    : row.original.Estado === "Pendiente"
                    ? "#fff3cd" // amarillo (pendiente sin pago)
                    : "inherit",
              },
            })}
          />

          {/* Resumen */}
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Productividad;
