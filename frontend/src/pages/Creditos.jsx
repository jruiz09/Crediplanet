import { Autocomplete, Box, Button, CircularProgress, FormControl, Grid, IconButton, Snackbar, TextField, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import { deleteCreditos, getCreditos, postCreditos } from "../services/Creditos";
import { getPlanes } from "../services/Planes";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import { formatearNumero } from "../components/utils/FormatearNumero";
import { formatearFecha } from "../components/utils/FormatearFecha";
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { getClientes } from "../services/Clientes";

const Creditos = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const navigate = useNavigate();
  const [creditos, setCreditos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [mostrarBox, setMostrarBox] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("usuario"))

  const [idCliente, setIdCliente] = useState("");
  const [cliente, setCliente] = useState("");
  const [idCobrador, setIdCobrador] = useState("");
  const [cobrador, setCobrador] = useState("");
  const [idPlan, setIdPlan] = useState("");
  const [dias, setDias] = useState("");
  const [idCredito, setIdCredito] = useState("");
  const [monto, setMonto] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);
  const [interes, setInteres] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [tipoTransaccion, setTipoTransaccion] = useState("");
  const transacciones = [
    {label: "Efectivo", value: "Efectivo"},
    {label: "Transferencia", value: "Transferencia"}
  ]
  const [refresh, setRefresh] = useState(false); // Nueva variable de estado para forzar la recarga



  useEffect(() => {
    setLoading(true);
    Promise.all([getCreditos(token), getClientes(token), getPlanes(token)])
      .then(([creditosData, clientesData, planesData]) => {
        setCreditos(creditosData.data || []);
        setClientes(clientesData.data.map(({ idcliente, nombreyapellido }) => ({ value: idcliente, label: nombreyapellido })));
        setPlanes(planesData.data.map(({ idplan, dias }) => ({ value: idplan, label: dias })));
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        setSnackbarMsg("Error al cargar datos.");
        setOpenSnackbar(true);
      })
      .finally(() => setLoading(false));
  }, [refresh]); // 🔥 Se ejecuta cada vez que 'refresh' cambia

  const resetCampos = () => {
    setIdCliente("");
    setCliente("");
    setIdCobrador("");
    setCobrador("");
    setIdPlan("");
    setDias("");
    setMonto("");
    setMontoTotal("");
    setInteres("");
    setFechaInicio("");
    setTipoTransaccion("");
  };

  const AccionEliminar = useCallback((fila) => {
    if (fila.row.original.estado !== "Pendiente") {
      Swal.fire("Error", "No se puede eliminar un crédito en proceso", "error");
      return;
    }
  
    Swal.fire({
      title: "¿Eliminar este crédito?",
      showDenyButton: true,
      confirmButtonText: "Sí, eliminar",
      denyButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminando crédito...",
          html: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Muestra el spinner de SweetAlert2
          }
        });
  
        deleteCreditos(fila.row.original.idcredito, token)
          .then((response) => {
            setCreditos(prev => prev.filter(c => c.idcredito !== fila.row.original.idcredito));
  
            // Asegurar que la API devuelve un mensaje y mostrarlo
            const mensaje = response?.message || "Crédito eliminado correctamente";
            Swal.fire("Eliminado", mensaje, "success");
          })
          .catch((error) => {
            const errorMsg = error.response?.data?.message || "Error al eliminar";
            Swal.fire("Error", errorMsg, "error");
          });
      }
    });
  }, [token]);
  

  const Detalle = (Datos) => {
    console.log("Detalle")
    console.log("Detalle", Datos);
   navigate("/CreditosDetalle", { state: { Datos: Datos } });
  }
  const columns = useMemo(() => [
    {
      header: "Acciones",
      muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } },
      Cell: ({ cell }) => (
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <Tooltip title="Detalle crédito">
            <IconButton onClick={() => Detalle(cell.row.original)}>
              <ReceiptIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={() => AccionEliminar(cell)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    { accessorKey: "idcredito", header: "N° Crédito" ,muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } }},
    { accessorKey: "fechainicio", header: "Fecha Inicio",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } }, Cell: ({ row }) => dayjs(row.original.fechainicio).format("DD/MM/YYYY") },
    { accessorKey: "estado", header: "Estado",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } }, 
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() === "Pendiente"
                      ? theme.palette.primary.dark
                      : cell.getValue() === "En Proceso"
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
            ), },
    { accessorKey: "cliente", header: "Cliente",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
    { accessorKey: "cobrador", header: "Cobrador",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
    { accessorKey: "dias", header: "Plan días",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
    { accessorKey: "monto", header: "Monto crédito",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } }, Cell: ({ row }) => `$${row.original.monto}` },
    { accessorKey: "interes", header: "Interés",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } }, Cell: ({ row }) => `${row.original.interes}%` },
    { accessorKey: "montototal", header: "Monto total",muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } }, Cell: ({ row }) => `$${row.original.montototal}` },
    { accessorKey: "tipotransaccion", header: "Tipo Transacción" ,muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } }},
  ], [AccionEliminar]);



  const AddCredito = () => {
    setMostrarBox(!mostrarBox);
  };

  const CalculoInteres = (interes) => {
    setInteres(interes),
      setMontoTotal(parseInt(monto) + parseInt((monto * interes) / 100));
  };
  const CalculoMonto = (monto) => {
    setMonto(monto),
      setMontoTotal(parseInt(monto) + parseInt((monto * interes) / 100));
  };

  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (newValue) => {
    const NuevaFecha = dayjs(newValue).format("YYYY-MM-DD");
    console.log("fecha", NuevaFecha)
    setSelectedDate(NuevaFecha);
  };

  const GuardarCredito = async () => {
    if (!cliente || !dias || !monto || !interes || !montoTotal || !selectedDate) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: '<a>TODOS LOS CAMPOS SON OBLIGATORIOS</a>'
      });
      return;
    }
  
    Swal.fire({
      title: `¿Deseas generar el crédito por un monto total de ${formatearNumero(parseInt(montoTotal))}?`,
      showDenyButton: true,
      confirmButtonText: "Sí, guardar",
      denyButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        EjecutarPost();
      } else {
        Swal.fire("La operación fue cancelada", "", "info");
      }
    });
  };
  
  const EjecutarPost = async () => {
    Swal.fire({
      title: "Guardando crédito...",
      html: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Muestra el spinner de SweetAlert2
      }
    });
  
    const Post = {
      idcliente: idCliente,
      cliente: cliente,
      idplan: idPlan,
      dias: dias,
      monto: monto,
      montototal: montoTotal,
      tipotransaccion: tipoTransaccion,
      interes: interes,
      fechainicio: selectedDate,
      usuarioalta: user
    };
  
    try {
      const creditoPost = await postCreditos(Post, token);
  
      if (creditoPost.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Crédito generado",
          text: creditoPost.data.message
        });
  
        // 🔥 **Forzar actualización de la tabla**
        setRefresh(prev => !prev);
  
        // **Reiniciar los campos y ocultar el formulario**
        resetCampos();
        setMostrarBox(false);
      } else {
        throw new Error(creditoPost.response?.data?.message || "Error desconocido");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <>
      <BoxGeneral texto="Créditos">
        <ButtonNuevo Texto="Nuevo Crédito" Funcion={AddCredito} />
        {mostrarBox === true ? (
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              boxShadow: 4,
              marginLeft: "40px",
              marginRight: "40px",
              marginBottom: "40px",
              marginTop: "40px",
              p: 4,
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{ mt: 2, mb: 3 }}
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={12}>
              <FormControl  fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Fecha inicio crédito"
                      onChange={(newValue) => handleDateChange(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
    
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                {" "}
                <Autocomplete
                  id="Clientes"
                  options={clientes}
                  inputValue={cliente}
                  onChange={(event, newValue) => {
                    setIdCliente(newValue.value);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setCliente(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cliente" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                {" "}
                <Autocomplete
                  id="Plan"
                  options={planes}
                  inputValue={dias}
                  onChange={(event, newValue) => {
                    setIdPlan(newValue.value);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setDias(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Plan" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
              {" "}
              <Autocomplete
                id="Tipo Transacción"
                options={transacciones}
                inputValue={tipoTransaccion}
                onChange={(event, newValue) => {
                  setTipoTransaccion(newValue.value);
                }}
              
                renderInput={(params) => (
                  <TextField {...params} label="Tipo Transacción" />
                )}
              />
            </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  label="Monto"
                  variant="outlined"
                  fullWidth
                  value={monto}
                  onChange={(e) => CalculoMonto(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                {" "}
                <TextField
                  label="Interés"
                  variant="outlined"
                  fullWidth
                  value={interes}
                  onChange={(e) => CalculoInteres(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                {" "}
                <TextField
                  label="Monto Total"
                  variant="outlined"
                  fullWidth
                  value={montoTotal}
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <Button
                  sx={{
                    boxShadow: 4,
                    color: "white",
                    m: 1,
                    p: 1,
                    backgroundColor: "#922b3e",
                    "&:hover": {
                      background: "#d87d8e",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => GuardarCredito("OK")}
                >
                  {" "}
                  Guardar{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <></>
        )}
              {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={100} thickness={5} color="primary" />
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
        <MaterialReactTable data={creditos} columns={columns} enablePagination enableGlobalFilter/>
      </Box>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} message={snackbarMsg} />
    
     
      </BoxGeneral>
    </>
  );
};

export default Creditos;
