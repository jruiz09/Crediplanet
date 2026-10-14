import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Modals from "../components/utils/Modal";
import { deleteRol, getRoles, postRol, putRol, setPantallasRol } from "../services/Roles";
import { getPantallas } from "../services/Pantallas";

const Roles = () => {
  const [token] = useState(localStorage.getItem("user-token"));
  const [modalEditar, setModalEditar] = useState(false);
  const [modalPantallas, setModalPantallas] = useState(false);
  const [roles, setRoles] = useState([]);
  const [pantallas, setPantallas] = useState([]);
  const [mostrarBox, setMostrarBox] = useState(false);

  const [name, setName] = useState("");
  const [idRol, setIdRol] = useState("");
  const [pantallaIdsSeleccionadas, setPantallaIdsSeleccionadas] = useState([]);

  const resetCampos = () => {
    setName("");
    setIdRol("");
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    resetCampos();
  };

  const fetchRoles = async () => {
    const data = await getRoles(token);
    if (data.status === 200) {
      setRoles(data.data);
    } else {
      console.log("Error: ", data.response?.data?.message);
    }
  };

  const fetchPantallas = async () => {
    const data = await getPantallas(token);
    if (data.status === 200) {
      setPantallas(data.data);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPantallas();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Acciones",
        muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } },
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Editar nombre">
              <IconButton onClick={() => AccionEditar(cell)}>
                <UpdateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Pantallas del rol">
              <IconButton onClick={() => AccionPantallas(cell)}>
                <AssignmentIcon />
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
      { accessorKey: "name", header: "Nombre", muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } } },
      {
        accessorKey: "pantallas",
        header: "Pantallas asignadas",
        muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } },
        Cell: ({ cell }) => (cell.getValue() || []).map((p) => p.codigo).join(", "),
      },
    ],
    []
  );

  const AccionEditar = (fila) => {
    setName(fila.row.original.name);
    setIdRol(fila.row.original.id);
    setModalEditar(true);
  };

  const AccionPantallas = (fila) => {
    setIdRol(fila.row.original.id);
    setPantallaIdsSeleccionadas((fila.row.original.pantallas || []).map((p) => p.id));
    setModalPantallas(true);
  };

  const AddRol = () => {
    resetCampos();
    setMostrarBox(!mostrarBox);
  };

  const GuardarRol = () => {
    if (!name) {
      Swal.fire({ icon: "error", title: "Falta el nombre del rol" });
      return;
    }
    EjecutaPost();
  };

  const EjecutaPost = async () => {
    const resultado = await postRol({ name }, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchRoles();
      resetCampos();
      setMostrarBox(false);
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const EditarRol = async () => {
    setModalEditar(false);
    const resultado = await putRol({ name }, idRol, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchRoles();
      resetCampos();
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const AccionEliminar = (fila) => {
    Swal.fire({
      title: "Deseas eliminar el rol?",
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
    const resultado = await deleteRol(id, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchRoles();
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const toggleSeleccionPantalla = (idPantalla) => {
    setPantallaIdsSeleccionadas((prev) =>
      prev.includes(idPantalla) ? prev.filter((id) => id !== idPantalla) : [...prev, idPantalla]
    );
  };

  const GuardarPantallasRol = async () => {
    const resultado = await setPantallasRol(idRol, pantallaIdsSeleccionadas, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchRoles();
      setModalPantallas(false);
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const pantallasPorApp = (appFiltro) => pantallas.filter((p) => p.app === appFiltro);

  return (
    <BoxGeneral texto="Roles">
      <ButtonNuevo Texto="Nuevo" Funcion={AddRol} />
      {mostrarBox ? (
        <Box sx={{ boxShadow: 4, mx: 5, my: 5, p: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4} md={4}>
              <TextField label="Nombre del rol" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={2} md={2}>
              <Button
                sx={{ boxShadow: 4, color: "white", m: 1, p: 1, backgroundColor: "var(--color-primario)", "&:hover": { background: "var(--color-primario-claro)" } }}
                onClick={() => GuardarRol()}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : null}

      <Box sx={{ mt: 2 }}>
        <MaterialReactTable data={roles} columns={columns} />

        <Modals
          modalabrir={modalEditar}
          titulo="Editar Rol"
          contenido={
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={6}>
                <TextField label="Nombre del rol" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
              </Grid>
            </Grid>
          }
          botones={
            <>
              <Button onClick={() => abrirCerrarModalEditar()} sx={{ pt: 4 }}>Cancelar</Button>
              <Button color="error" onClick={() => EditarRol()} sx={{ pt: 4 }}>Guardar</Button>
            </>
          }
        />

        <Modals
          modalabrir={modalPantallas}
          titulo="Pantallas del rol"
          contenido={
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">App adm</Typography>
                {pantallasPorApp("adm").map((p) => (
                  <FormControlLabel
                    key={p.id}
                    sx={{ display: "block", textAlign: "left" }}
                    control={
                      <Checkbox
                        checked={pantallaIdsSeleccionadas.includes(p.id)}
                        onChange={() => toggleSeleccionPantalla(p.id)}
                      />
                    }
                    label={`${p.codigo} - ${p.nombre}`}
                  />
                ))}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">App mobile</Typography>
                {pantallasPorApp("mobile").map((p) => (
                  <FormControlLabel
                    key={p.id}
                    sx={{ display: "block", textAlign: "left" }}
                    control={
                      <Checkbox
                        checked={pantallaIdsSeleccionadas.includes(p.id)}
                        onChange={() => toggleSeleccionPantalla(p.id)}
                      />
                    }
                    label={`${p.codigo} - ${p.nombre}`}
                  />
                ))}
              </Grid>
            </Grid>
          }
          botones={
            <>
              <Button onClick={() => setModalPantallas(false)} sx={{ pt: 4 }}>Cancelar</Button>
              <Button color="error" onClick={() => GuardarPantallasRol()} sx={{ pt: 4 }}>Guardar</Button>
            </>
          }
        />
      </Box>
    </BoxGeneral>
  );
};

export default Roles;
