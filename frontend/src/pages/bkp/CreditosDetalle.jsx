import { Alert, Autocomplete, Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
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

import DeleteIcon from '@mui/icons-material/Delete';

import { deleteCuota, getDetallexCredito, putPagoCuota } from "../services/CreditoDetalles";
import { deleteCreditos } from "../services/Creditos";

const CreditosDetalle = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [user, setUser] = useState(localStorage.getItem("usuario"));
  const location = useLocation();
  const [idCredito, setIdCredito] = useState(location.state.Datos.idcredito);
  const [modalPago, setModalPago] = useState(false);
  const [idCreditoDetalle, setIdCreditoDetalle] = useState("");
  const [montoPago, setMontoPago] = useState("");
  const [monto, setMonto] = useState("");
  const [observaciones , setObservaciones] = useState("");
  const [detalle, setDetalle] = useState([]);
  const [tipoTransaccion, setTipoTransaccion] = useState("");
  const transacciones = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
  ];

  console.log("detalle => ", localStorage);
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
      tipotransaccion: tipoTransaccion,
      usuario: user,
      observaciones: observaciones,
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
    if ([montoPago, idCreditoDetalle, tipoTransaccion].includes("")) {
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
  console.log("fila ", fila.row.original.estado)

  if(fila.row.original.estado === "Pendiente")
{
  setIdCreditoDetalle(fila.row.original.idcreditodetalle)

  Swal.fire({
    title: "Deseas eliminar la cuota?",
    showDenyButton: true,
    confirmButtonText: "Si, Eliminar",
    denyButtonText: `No, cancelar`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {          
      EjecutarDelete(fila.row.original.idcreditodetalle)
      
    } else if (result.isDenied) {
      Swal.fire("La operación fue cancelada", "", "info");
    }
  })}
  else
  {

    Swal.fire("Error : No se pueden eliminar cuotas que no tengan estado Pendiente"," ", "error");
  }
}
  

const EjecutarDelete = async (IDCREDITODETALLE) => {


  const creditodetallePost =  await deleteCuota(IDCREDITODETALLE, token);
  if (creditodetallePost.status === 200) {
    Swal.fire(creditodetallePost.data.message, "", "success");
    fetchCredito();
  } else {
    Swal.fire("Error : " + creditodetallePost.response.data.message, "", "error");
  }
}

  useEffect(() => {
    fetchCredito();
  }, []);
  return (
    <>
      <BoxGeneral texto={"Crédito N° " + idCredito}>
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
              sx={{mt: 2}}
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
              
              <TextField 
              sx={{mt: 2}}
                  label="Observaciones"
                  variant="outlined"
                  fullWidth
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
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
