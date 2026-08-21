import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router";
import BoxGeneral from "../components/utils/BoxGeneral";
import { formatearFecha } from "../components/utils/FormatearFecha";
import { formatearNumero } from "../components/utils/FormatearNumero";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Modals from "../components/utils/Modal";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";

import DeleteIcon from "@mui/icons-material/Delete";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  deleteCuota,
  getDetallexCredito,
  postRefinanciamiento,
  putPagoCuota,
} from "../services/CreditoDetalles";
import { deleteCreditos } from "../services/Creditos";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

const CreditosDetalle = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [user, setUser] = useState(localStorage.getItem("usuario"));
  const location = useLocation();
  const [idCredito, setIdCredito] = useState(location.state.Datos.idcredito);
  const [nombreCliente, setNombreCliente] = useState(
    location.state.Datos.cliente
  );
  const [cobrador, setCobrador] = useState(location.state.Datos.cobrador);
  const [cantidadCuotas, setcCantidadCuotas] = useState(
    location.state.Datos.dias
  );
  const [modalPago, setModalPago] = useState(false);
  const [idCreditoDetalle, setIdCreditoDetalle] = useState("");
  const [montoPago, setMontoPago] = useState("");
  const [monto, setMonto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [estadoCredito, setEstadoCredito] = useState(
    location.state.Datos.estado
  );

  const [noContabiliza, setNoContabiliza] = useState(false);
  const [detalle, setDetalle] = useState([]);
  const transacciones = ["Efectivo", "Transferencia"];

  const [value, setValue] = React.useState(transacciones[0]);
  const [inputValue, setInputValue] = React.useState("");
  const [tipoTransaccion, setTipoTransaccion] = useState(transacciones[0]);
  const fetchCredito = async () => {
    const creditosData = await getDetallexCredito(idCredito, token);
    if (creditosData.status === 200) {
      setDetalle(creditosData.data);
      console.log("creditos = ", detalle);
    } else {
      console.log("Error: ", creditosData.response.data.message);
    }
  };

  const resetCampos = () => {
    setIdCreditoDetalle("");
    setMonto("");
    setMontoPago("");
    setTipoTransaccion("");
    setObservaciones("");
    setNoContabiliza(false);
  };
  const abrirCerrarModalPago = (datos) => {
    resetCampos();
    setModalPago(!modalPago);
    setMonto(datos.row.original.monto);
    setIdCreditoDetalle(datos.row.original.idcreditodetalle);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "idcreditodetalle",
        header: "Pagar",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ cell }) => (
          <>
            {cell.row.original.estado === "Pago Registrado" ? (
              <>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Tooltip arrow placement="left" title="Detalle crédito">
                    <Button
                      disabled={true}
                      onClick={() => abrirCerrarModalPago(cell)}
                    >
                      <AttachMoneyIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip arrow placement="right" title="Eliminar">
                    <IconButton onClick={() => AccionEliminar(cell)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Tooltip arrow placement="left" title="Detalle crédito">
                    <Button onClick={() => abrirCerrarModalPago(cell)}>
                      <AttachMoneyIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip arrow placement="right" title="Eliminar">
                    <IconButton onClick={() => AccionEliminar(cell)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )}
          </>
        ),
      },
      {
        accessorKey: "cuota",
        header: "Cuota",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "estado",
        header: "Estado",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() === "Pendiente"
                  ? theme.palette.primary.dark
                  : cell.getValue() === "Pago Parcial"
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "fechapago", //normal accessorKey
        header: "Fecha de pago",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearFecha(row.original.fechapago)}</div>,
      },
      {
        accessorKey: "monto",
        header: "Monto Cuota",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.monto)}</div>,
      },
      {
        accessorKey: "montopago",
        header: "Monto Pago",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.montopago)}</div>,
      },

      {
        accessorKey: "observaciones",
        header: "Observaciones",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },

      {
        accessorKey: "tipotransaccion",
        header: "Tipo Transac.",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
    ],
    []
  );

  const EjecutarPagoCuota = async () => {
    const Post = {
      montopago: parseInt(montoPago),
      tipotransaccion: value,
      usuario: user,
      observaciones: observaciones,
      nocontabiliza: noContabiliza,
    };

    const PagoCuota = await putPagoCuota(Post, idCreditoDetalle, token);
    if (PagoCuota.status === 200) {
      console.log("Request:", Post);
      console.log("Respuesta:", PagoCuota);
      Swal.fire(PagoCuota.data.message, "", "success");
      fetchCredito();
      resetCampos();
      abrirCerrarModalPago();
    } else {
      console.log("Error NO VA: ", PagoCuota);
      Swal.fire(" " + PagoCuota.response.data.message, "", "error");
    }
  };

  const RegistrarPago = async () => {
    console.log("idcreditodetalle ==>", idCreditoDetalle);
    if ([montoPago, idCreditoDetalle, value].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: "<a>TODOS LOS CAMPOS SON OBLIGATORIOS</a>",
      });

      abrirCerrarModalPago();
    } else {
      Swal.fire({
        title:
          "Deseas registrar el pago de la cuota por un monto de " +
          formatearNumero(parseInt(montoPago)) +
          "?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          EjecutarPagoCuota();
          resetCampos();
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
      abrirCerrarModalPago();
    }
  };

  const AccionEliminar = (fila) => {
    console.log("fila ", fila.row.original.estado);

    if (fila.row.original.estado === "Pendiente") {
      setIdCreditoDetalle(fila.row.original.idcreditodetalle);

      Swal.fire({
        title: "Deseas eliminar la cuota?",
        showDenyButton: true,
        confirmButtonText: "Si, Eliminar",
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          EjecutarDelete(fila.row.original.idcreditodetalle);
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
    } else {
      Swal.fire(
        "Error : No se pueden eliminar cuotas que no tengan estado Pendiente",
        " ",
        "error"
      );
    }
  };

  const EjecutarDelete = async (IDCREDITODETALLE) => {
    const creditodetallePost = await deleteCuota(IDCREDITODETALLE, token);
    if (creditodetallePost.status === 200) {
      Swal.fire(creditodetallePost.data.message, "", "success");
      fetchCredito();
    } else {
      Swal.fire(
        "Error : " + creditodetallePost.response.data.message,
        "",
        "error"
      );
    }
  };

  const AccionRefinanciar = () => {
    Swal.fire({
      title: "Deseas refinanciar el credito?",
      showDenyButton: true,
      confirmButtonText: "Si, refinanciar",
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        refinanciarCreditoPost(idCredito);
      } else if (result.isDenied) {
        Swal.fire("La operación fue cancelada", "", "info");
      }
    });
  };

  const refinanciarCreditoPost = async (credito) => {
    console.log("muestra credito", credito);
    const creditodetallePost = await postRefinanciamiento(credito, token);
    if (creditodetallePost.status === 200) {
      Swal.fire(creditodetallePost.data.message, "", "success");
      fetchCredito();
    } else {
      Swal.fire(
        "Error : " + creditodetallePost.response.data.message,
        "",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchCredito();
  }, []);
  return (
    <>
      <BoxGeneral texto={"Crédito N° " + idCredito}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "#fafafa",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cliente
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {nombreCliente}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center">
                <AssignmentIndIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cobrador Asignado
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cobrador}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center">
                <FormatListNumberedIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cantidad de Cuotas
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cantidadCuotas}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={3} textAlign={{ xs: "left", md: "right" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => AccionRefinanciar()}
              >
                Refinanciar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 2 }}>
          <MaterialReactTable data={detalle} columns={columns} pageCount="25" />
          <Modals
            modalabrir={modalPago}
            titulo={"Registrar pago"}
            contenido={
              <>
                <TextField
                  label="Monto a pagar"
                  variant="outlined"
                  fullWidth
                  value={montoPago}
                  onChange={(e) => setMontoPago(e.target.value)}
                />

                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="TipoTransaccion"
                  options={transacciones}
                  sx={{ mt: 2 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Tipo de Transacción" />
                  )}
                />

                <TextField
                  sx={{ mt: 2 }}
                  label="Observaciones"
                  variant="outlined"
                  fullWidth
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value={noContabiliza}
                      onChange={(e) => setNoContabiliza(e.target.checked)}
                    />
                  }
                  label="No Contabiliza"
                />
              </>
            }
            botones={
              <>
                <Button onClick={() => abrirCerrarModalPago()} sx={{ pt: 4 }}>
                  Cancelar
                </Button>
                <Button
                  color="error"
                  onClick={() => RegistrarPago()}
                  sx={{ pt: 4 }}
                >
                  Registrar
                </Button>
              </>
            }
          />
        </Box>
      </BoxGeneral>
    </>
  );
};

export default CreditosDetalle;
