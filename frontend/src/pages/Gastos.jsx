import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import { MaterialReactTable } from "material-react-table";
import { formatearFecha } from "../components/utils/FormatearFecha";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import Modals from "../components/utils/Modal";
import { deleteGastos, getGastos, postGastos, putGastos } from "../services/Gastos";
import { Autocomplete, Box, Button, IconButton, TextField, Tooltip } from "@mui/material";

const Gastos = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [user, setUser] = useState(localStorage.getItem("usuario"));
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [gastos, setGastos] = useState([]);
  const [id, setId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [tipoTransaccion, setTipoTransaccion] = useState("");

  
  const transacciones = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
  ];

  const abrirCerrarModalNuevo = () => {
    setModalNuevo(!modalNuevo);
  };
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const resetCampos = () => {
    setDescripcion("");
    setMonto("");
    setTipoTransaccion("");
  };

  const fetchGastos = async () => {
    const gastosData = await getGastos(token);
    if (gastosData.status === 200) {
      setGastos(gastosData.data);
      console.log("gastos = ", gastos);
    } else {
      console.log("Error: ", gastosData.response.data.message);
      if (gastosData.response.data.message === "Unauthorized!") {
        localStorage.clear();
        navigate("/auth/login");
      }
    }
  };

  //Nuevo Gasto
  const GuardarGasto = () => {
    abrirCerrarModalNuevo();
    if ([descripcion, monto].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
      });
    } else {
      Swal.fire({
        title: "Deseas guardar el gasto?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          EjecutaPost();
          resetCampos();
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
    }
  };

  //POST GUARDA GASTO
  const EjecutaPost = async () => {
    const Post = {
      descripcion: descripcion,
      tipotransaccion: tipoTransaccion,
      monto: monto,
      usuarioalta: user,
    };

    const gastosPost = await postGastos(Post, token);
    if (gastosPost.status === 200) {
      console.log("Request:", Post);
      console.log("Respuesta:", gastosPost);
      Swal.fire(gastosPost.data.message, "", "success");
      fetchGastos();
      resetCampos();
    } else {
      console.log("Error NO VA: ", gastosPost);
      Swal.fire("Error : " + gastosPost.response.data.message, "", "error");
    }
  };

  //Edita Gastos

  const AccionEditar = (fila) =>{
    setDescripcion(fila.row.original.descripcion);
    setMonto(fila.row.original.monto);
    setId(fila.row.original.idgasto);
    setModalEditar(!modalEditar)
  } 
  const editarGasto = () => {
    abrirCerrarModalEditar();
    if ([descripcion, monto].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
      });
    } else {
      Swal.fire({
        title: "Deseas guardar el gasto?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          EjecutarPut();
          resetCampos();
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
    }
  };

  const EjecutarPut = async () => {
    const Post = {
      descripcion: descripcion,
      tipotransaccion: tipoTransaccion,
      monto: monto,
      usuarioalta: user
    };

    const gastosPost = await putGastos(Post, id, token);
    if (gastosPost.status === 200) {
      console.log("Request:", Post);
      console.log("Respuesta:", gastosPost);
      Swal.fire(gastosPost.data.message, "", "success");
      fetchGastos();
      resetCampos();
    } else {
      console.log("Error NO VA: ", gastosPost);
      Swal.fire("Error : " + gastosPost.response.data.message, "", "error");
    }
  };

  //TABLA

  const columns = useMemo(
    () => [
      {
        accessorKey: "idgasto",
        header: "Acciones",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Editar">
              <IconButton onClick={() => AccionEditar(cell)}>
                <UpdateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Eliminar">
              <IconButton onClick={() => AccionEliminar(cell)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
      {
        accessorKey: "descripcion",
        header: "Descripción Gasto",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
      {
        accessorKey: "monto", //normal accessorKey
        header: "Monto",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
    ],
    []
  );

  //Funcion eliminar.

  const AccionEliminar = (fila) => {
    console.log("fila ", fila.row.original);

    setId(fila.row.original.idgasto);

    Swal.fire({
      title: "Deseas eliminar el gasto?",
      showDenyButton: true,
      confirmButtonText: "Si, Eliminar",
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        EjecutarDelete(fila.row.original.idgasto);
      } else if (result.isDenied) {
        Swal.fire("La operación fue cancelada", "", "info");
      }
    });
  };

  const EjecutarDelete = async (IDGASTO) => {
    const gastosPost = await deleteGastos(IDGASTO, token);
    if (gastosPost.status === 200) {
      console.log("Respuesta:", gastosPost);
      Swal.fire(gastosPost.data.message, "", "success");
      fetchGastos();
      resetCampos();
    } else {
      console.log("Error NO VA: ", gastosPost);
      Swal.fire(
        "Error : " + gastosPost.response.data.message,
        "",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);
  return (
    <>
      <BoxGeneral texto="Adminsitración Gastos">
        <ButtonNuevo
          Texto="Nuevo Gasto"
          Funcion={abrirCerrarModalNuevo}
        ></ButtonNuevo>
        <Box sx={{ mt: 2 }}>
          <MaterialReactTable data={gastos} columns={columns} />
        </Box>
        <Modals
          modalabrir={modalNuevo}
          titulo={"Nuevo gasto"}
          contenido={
            <>
              {" "}
              <TextField
                sx={{ mt: 2 }}
                label="Descripcion"
                variant="outlined"
                fullWidth
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
               <Autocomplete
               sx={{ mt: 2 }}
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
                sx={{ mt: 2 }}
                label="Monto"
                variant="outlined"
                fullWidth
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />


            </>
          }
          botones={
            <>
              <Button onClick={() => abrirCerrarModalNuevo()} sx={{ pt: 4 }}>
                Cancelar
              </Button>
              <Button
                color="error"
                onClick={() => GuardarGasto()}
                sx={{ pt: 4 }}
              >
                Guardar
              </Button>
            </>
          }
        />
         <Modals
            modalabrir={modalEditar}
            titulo={
              "Editar gasto"}
            contenido={<>
    
    <TextField
                sx={{ mt: 2}}
                label="Descripcion"
                variant="outlined"
                fullWidth
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
               <Autocomplete
               sx={{ mt: 2 }}
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
                sx={{ mt: 2 }}
                label="Monto"
                variant="outlined"
                fullWidth
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />

            </>}
            botones={
              <>
                <Button
                  onClick={() => abrirCerrarModalEditar()}
                  sx={{ pt: 4 }}
                >
                  Cancelar
                </Button>
                <Button
                  color="error"
                  onClick={() => editarGasto()}
                  sx={{ pt: 4 }}
                >
                  Guardar
                </Button>
              </>
            }
          />
      </BoxGeneral>
    </>
  );
};

export default Gastos;