import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import { formatearFecha } from "../components/utils/FormatearFecha";
import { formatearNumero } from "../components/utils/FormatearNumero";
import { getAllCaja, postCaja } from "../services/Caja";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";

const Caja = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [user, setUser] = useState(localStorage.getItem("usuario"));
  const [detalle, setDetalle] = useState([]);
  const [mostrarBox, setMostrarBox] = useState(false);
  const [monto, setMonto] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [tipoTransaccion, setTipoTransaccion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const fetchCaja = async () => {
    const cajaData = await getAllCaja(token);
    if (cajaData.status === 200) {
      setDetalle(cajaData.data);
      console.log("creditos = ", detalle);
    } else {
      console.log("Error: ", cajaData.response.data.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "transaccion",
        header: "Transacción",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "transacciondocumento", //normal accessorKey
        header: "Documento",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "tipo",
        header: "Movimiento",
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

      {
        accessorKey: "observaciones",
        header: "Observaciones",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "monto",
        header: "Monto",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.monto)}</div>,
      },

      {
        accessorKey: "fechaalta",
        header: "Fecha alta",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearFecha(row.original.fechaalta)}</div>,
      },

      {
        accessorKey: "usuarioalta",
        header: "Usuario",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
    ],
    []
  );

  const NuevoMovimiento = () => {
    console.log("add");
    setMostrarBox(!mostrarBox);
  };

  const GuardarMovimiento = async () => {
    if ([tipoMovimiento, tipoTransaccion, monto].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Todos los campos son obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: "<a>Revisar campos monto y tipos</a>",
      });
    } else {
      Swal.fire({
        title: "Deseas guardar el movimiento?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          EjecutaPost();
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
    }
  };
  const resetCampos = () => {
    setTipoMovimiento("");
    setMonto("");
    setTipoTransaccion("");
    setObservaciones("");
  };

  const EjecutaPost = async () => {
    const Post = {
      transaccion: "Movimiento Caja",
      transacciondocumento: "X",
      tipo: tipoMovimiento,
      monto: monto,
      tipotransaccion: tipoTransaccion,
      observaciones: observaciones,
      usuarioalta: user,
    };

    const CajaPost = await postCaja(Post, token);
    if (CajaPost.status === 200) {
      console.log("Request:", Post);
      console.log("Respuesta:", CajaPost);
      Swal.fire(CajaPost.data.message, "", "success");
      fetchCaja();
      resetCampos();
      setMostrarBox(false);
    } else {
      console.log("Error NO VA: ", CajaPost);
      Swal.fire("Error : " + CajaPost.response.data.message, "", "error");
    }
  };

  const movimientos = [
    { label: "Ingreso", value: "Ingreso" },
    { label: "Egreso", value: "Egreso" },
  ];

  const transacciones = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
  ];

  useEffect(() => {
    fetchCaja();
  }, []);
  return (
    <>
      <BoxGeneral texto="Balance Caja">
        <ButtonNuevo Texto="Nuevo Movimiento" Funcion={NuevoMovimiento} />
        {mostrarBox === true ? (
          <>
            <Grid
              container
              spacing={2}
              sx={{ mt: 2, mb: 3 }}
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <Autocomplete
                  id="Tipo Movimiento"
                  options={movimientos}
                  inputValue={tipoMovimiento}
                  onChange={(event, newValue) => {
                    setTipoMovimiento(newValue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Tipo Movimiento" />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
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

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Monto"
                  variant="outlined"
                  fullWidth
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <TextField
                  label="Observaciones"
                  variant="outlined"
                  fullWidth
                  multiline
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
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
                  onClick={() => GuardarMovimiento()}
                >
                  {" "}
                  Guardar{" "}
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <></>
        )}
        <Box sx={{ mt: 2 }}>
          <MaterialReactTable data={detalle} columns={columns} />
        </Box>
      </BoxGeneral>
    </>
  );
};

export default Caja;
