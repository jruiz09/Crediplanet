import { Box, Button, Grid, IconButton, MenuItem, TextField, Tooltip, Checkbox, FormControlLabel } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Modals from "../components/utils/Modal";
import { deletePantalla, getPantallas, postPantalla, putPantalla } from "../services/Pantallas";

const Pantallas = () => {
  const [token] = useState(localStorage.getItem("user-token"));
  const [modalEditar, setModalEditar] = useState(false);
  const [pantallas, setPantallas] = useState([]);
  const [mostrarBox, setMostrarBox] = useState(false);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [app, setApp] = useState("adm");
  const [activo, setActivo] = useState(true);
  const [idPantalla, setIdPantalla] = useState("");

  const resetCampos = () => {
    setCodigo("");
    setNombre("");
    setApp("adm");
    setActivo(true);
    setIdPantalla("");
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    resetCampos();
  };

  const fetchPantallas = async () => {
    const data = await getPantallas(token);
    if (data.status === 200) {
      setPantallas(data.data);
    } else {
      console.log("Error: ", data.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchPantallas();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Acciones",
        muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } },
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
      { accessorKey: "codigo", header: "Codigo", muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
      { accessorKey: "nombre", header: "Nombre", muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
      { accessorKey: "app", header: "App", muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
      {
        accessorKey: "activo",
        header: "Activo",
        muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } },
        Cell: ({ cell }) => (cell.getValue() ? "Si" : "No"),
      },
    ],
    []
  );

  const AccionEditar = (fila) => {
    setCodigo(fila.row.original.codigo);
    setNombre(fila.row.original.nombre);
    setApp(fila.row.original.app);
    setActivo(fila.row.original.activo);
    setIdPantalla(fila.row.original.id);
    setModalEditar(true);
  };

  const AddPantalla = () => {
    resetCampos();
    setMostrarBox(!mostrarBox);
  };

  const GuardarPantalla = () => {
    if ([codigo, nombre, app].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "codigo, nombre y app son obligatorios.",
      });
      return;
    }
    EjecutaPost();
  };

  const EjecutaPost = async () => {
    const Post = { codigo, nombre, app, activo };
    const resultado = await postPantalla(Post, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchPantallas();
      resetCampos();
      setMostrarBox(false);
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const EditarPantalla = async () => {
    setModalEditar(false);
    const Post = { codigo, nombre, app, activo };
    const resultado = await putPantalla(Post, idPantalla, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchPantallas();
      resetCampos();
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const AccionEliminar = (fila) => {
    Swal.fire({
      title: "Deseas eliminar la pantalla?",
      showDenyButton: true,
      confirmButtonText: "Si, Eliminar",
      denyButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        EjecutarDelete(fila.row.original.id);
      }
    });
  };

  const EjecutarDelete = async (id) => {
    const resultado = await deletePantalla(id, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchPantallas();
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const CamposFormulario = () => (
    <Grid container spacing={2} sx={{ mt: 2, mb: 3 }} justifyContent="center">
      <Grid item xs={12} sm={3} md={3}>
        <TextField label="Codigo" variant="outlined" fullWidth value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} />
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <TextField label="Nombre" variant="outlined" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </Grid>
      <Grid item xs={12} sm={2} md={2}>
        <TextField select label="App" variant="outlined" fullWidth value={app} onChange={(e) => setApp(e.target.value)}>
          <MenuItem value="adm">adm</MenuItem>
          <MenuItem value="mobile">mobile</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={2} md={2}>
        <FormControlLabel
          control={<Checkbox checked={activo} onChange={(e) => setActivo(e.target.checked)} />}
          label="Activo"
        />
      </Grid>
    </Grid>
  );

  return (
    <BoxGeneral texto="Pantallas">
      <ButtonNuevo Texto="Nueva" Funcion={AddPantalla} />
      {mostrarBox ? (
        <Box sx={{ boxShadow: 4, mx: 5, my: 5, p: 4 }}>
          {CamposFormulario()}
          <Grid container justifyContent="center">
            <Button
              sx={{ boxShadow: 4, color: "white", m: 1, p: 1, backgroundColor: "#922b3e", "&:hover": { background: "#d87d8e" } }}
              onClick={() => GuardarPantalla()}
            >
              Guardar
            </Button>
          </Grid>
        </Box>
      ) : null}

      <Box sx={{ mt: 2 }}>
        <MaterialReactTable data={pantallas} columns={columns} />
        <Modals
          modalabrir={modalEditar}
          titulo="Editar Pantalla"
          contenido={CamposFormulario()}
          botones={
            <>
              <Button onClick={() => abrirCerrarModalEditar()} sx={{ pt: 4 }}>Cancelar</Button>
              <Button color="error" onClick={() => EditarPantalla()} sx={{ pt: 4 }}>Guardar</Button>
            </>
          }
        />
      </Box>
    </BoxGeneral>
  );
};

export default Pantallas;
