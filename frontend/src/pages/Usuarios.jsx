import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import UpdateIcon from '@mui/icons-material/Update';
import Modals from "../components/utils/Modal";
import { getUsuarios, putUsuario, setRolesUsuario } from "../services/Usuarios";
import { getRoles } from "../services/Roles";

const Usuarios = () => {
  const [token] = useState(localStorage.getItem("user-token"));
  const [modalEditar, setModalEditar] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);

  const [idUsuario, setIdUsuario] = useState("");
  const [idCobrador, setIdCobrador] = useState("");
  const [rolIdsSeleccionados, setRolIdsSeleccionados] = useState([]);

  const fetchUsuarios = async () => {
    const data = await getUsuarios(token);
    if (data.status === 200) {
      setUsuarios(data.data);
    } else {
      console.log("Error: ", data.response?.data?.message);
    }
  };

  const fetchRoles = async () => {
    const data = await getRoles(token);
    if (data.status === 200) {
      setRoles(data.data);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Acciones",
        muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } },
        Cell: ({ cell }) => (
          <Tooltip arrow title="Editar cobrador y roles">
            <IconButton onClick={() => AccionEditar(cell)}>
              <UpdateIcon />
            </IconButton>
          </Tooltip>
        ),
      },
      { accessorKey: "username", header: "Usuario", muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
      { accessorKey: "email", header: "Email", muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } } },
      {
        accessorKey: "idcobrador",
        header: "Cobrador vinculado",
        muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } },
        Cell: ({ cell }) => cell.getValue() || "Sin vincular",
      },
      {
        accessorKey: "roles",
        header: "Roles",
        muiTableHeadCellProps: { sx: { backgroundColor: "#922b3e", color: "white" } },
        Cell: ({ cell }) => (cell.getValue() || []).map((r) => r.name).join(", "),
      },
    ],
    []
  );

  const AccionEditar = (fila) => {
    setIdUsuario(fila.row.original.id);
    setIdCobrador(fila.row.original.idcobrador || "");
    setRolIdsSeleccionados((fila.row.original.roles || []).map((r) => r.id));
    setModalEditar(true);
  };

  const toggleSeleccionRol = (idRol) => {
    setRolIdsSeleccionados((prev) =>
      prev.includes(idRol) ? prev.filter((id) => id !== idRol) : [...prev, idRol]
    );
  };

  const GuardarUsuario = async () => {
    setModalEditar(false);

    const resultadoCobrador = await putUsuario(
      { idcobrador: idCobrador === "" ? null : idCobrador },
      idUsuario,
      token
    );
    const resultadoRoles = await setRolesUsuario(idUsuario, rolIdsSeleccionados, token);

    if (resultadoCobrador.status === 200 && resultadoRoles.status === 200) {
      Swal.fire("Usuario actualizado correctamente", "", "success");
      fetchUsuarios();
    } else {
      Swal.fire(
        "Error: " +
          (resultadoCobrador.response?.data?.message ||
            resultadoRoles.response?.data?.message ||
            "No se pudo actualizar el usuario"),
        "",
        "error"
      );
    }
  };

  return (
    <BoxGeneral texto="Usuarios">
      <Box sx={{ mt: 2 }}>
        <MaterialReactTable data={usuarios} columns={columns} />

        <Modals
          modalabrir={modalEditar}
          titulo="Editar Usuario"
          contenido={
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ID Cobrador vinculado"
                  helperText="Requerido para que el usuario pueda entrar a la app mobile. Dejar vacio para desvincular."
                  variant="outlined"
                  fullWidth
                  value={idCobrador}
                  onChange={(e) => setIdCobrador(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {roles.map((r) => (
                  <FormControlLabel
                    key={r.id}
                    sx={{ display: "block", textAlign: "left" }}
                    control={
                      <Checkbox
                        checked={rolIdsSeleccionados.includes(r.id)}
                        onChange={() => toggleSeleccionRol(r.id)}
                      />
                    }
                    label={r.name}
                  />
                ))}
              </Grid>
            </Grid>
          }
          botones={
            <>
              <Button onClick={() => setModalEditar(false)} sx={{ pt: 4 }}>Cancelar</Button>
              <Button color="error" onClick={() => GuardarUsuario()} sx={{ pt: 4 }}>Guardar</Button>
            </>
          }
        />
      </Box>
    </BoxGeneral>
  );
};

export default Usuarios;
