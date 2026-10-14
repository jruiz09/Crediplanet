import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import UpdateIcon from '@mui/icons-material/Update';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Modals from "../components/utils/Modal";
import { getUsuarios, postUsuario, putUsuario, setRolesUsuario } from "../services/Usuarios";
import { getRoles } from "../services/Roles";
import { getCobradoresPorEmpresa } from "../services/Cobradores";

const Usuarios = () => {
  const [token] = useState(localStorage.getItem("user-token"));
  const [modalEditar, setModalEditar] = useState(false);
  const [mostrarBox, setMostrarBox] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cobradoresDisponibles, setCobradoresDisponibles] = useState([]);

  const [idUsuario, setIdUsuario] = useState("");
  const [idCobrador, setIdCobrador] = useState("");
  const [rolIdsSeleccionados, setRolIdsSeleccionados] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idCobradorNuevo, setIdCobradorNuevo] = useState("");
  const [rolIdsNuevo, setRolIdsNuevo] = useState([]);

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

  const fetchCobradoresActivos = async (idempresa) => {
    if (!idempresa) {
      setCobradoresDisponibles([]);
      return;
    }
    const data = await getCobradoresPorEmpresa(idempresa, token);
    if (data.status === 200) {
      setCobradoresDisponibles((data.data || []).filter((c) => c.activo));
    } else {
      setCobradoresDisponibles([]);
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
        muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } },
        Cell: ({ cell }) => (
          <>
            <Tooltip arrow title="Editar cobrador y roles">
              <IconButton onClick={() => AccionEditar(cell)}>
                <UpdateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title={cell.row.original.activo ? "Desactivar usuario" : "Activar usuario"}>
              <IconButton onClick={() => ToggleActivo(cell)}>
                {cell.row.original.activo ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
              </IconButton>
            </Tooltip>
          </>
        ),
      },
      { accessorKey: "username", header: "Usuario", muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } } },
      { accessorKey: "email", header: "Email", muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } } },
      {
        accessorKey: "activo",
        header: "Estado",
        muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } },
        Cell: ({ cell }) => (cell.getValue() ? "Activo" : "Inactivo"),
      },
      {
        accessorKey: "idcobrador",
        header: "Cobrador vinculado",
        muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } },
        Cell: ({ cell }) => cell.getValue() || "Sin vincular",
      },
      {
        accessorKey: "roles",
        header: "Roles",
        muiTableHeadCellProps: { sx: { backgroundColor: "var(--color-primario)", color: "white" } },
        Cell: ({ cell }) => (cell.getValue() || []).map((r) => r.name).join(", "),
      },
    ],
    []
  );

  const ToggleActivo = async (fila) => {
    const usuario = fila.row.original;
    const nuevoEstado = !usuario.activo;

    const confirmacion = await Swal.fire({
      title: nuevoEstado ? "¿Activar usuario?" : "¿Desactivar usuario?",
      text: nuevoEstado
        ? "El usuario va a poder volver a iniciar sesión."
        : "El usuario no va a poder iniciar sesión hasta que lo reactives.",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;

    const resultado = await putUsuario({ activo: nuevoEstado }, usuario.id, token);
    if (resultado.status === 200) {
      Swal.fire(nuevoEstado ? "Usuario activado" : "Usuario desactivado", "", "success");
      fetchUsuarios();
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || "No se pudo actualizar el usuario"), "", "error");
    }
  };

  const AccionEditar = (fila) => {
    setIdUsuario(fila.row.original.id);
    setIdCobrador(fila.row.original.idcobrador || "");
    setRolIdsSeleccionados((fila.row.original.roles || []).map((r) => r.id));
    fetchCobradoresActivos(fila.row.original.idempresa);
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

  const resetCamposNuevo = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setIdCobradorNuevo("");
    setRolIdsNuevo([]);
  };

  const AddUsuario = () => {
    resetCamposNuevo();
    fetchCobradoresActivos(localStorage.getItem("empresa"));
    setMostrarBox(!mostrarBox);
  };

  const toggleSeleccionRolNuevo = (idRol) => {
    setRolIdsNuevo((prev) =>
      prev.includes(idRol) ? prev.filter((id) => id !== idRol) : [...prev, idRol]
    );
  };

  const GuardarNuevoUsuario = () => {
    if ([username, email, password].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Usuario, email y contraseña son obligatorios.",
      });
      return;
    }
    EjecutaPost();
  };

  const EjecutaPost = async () => {
    const Post = {
      username,
      email,
      password,
      idcobrador: idCobradorNuevo === "" ? null : idCobradorNuevo,
      rolIds: rolIdsNuevo,
    };
    const resultado = await postUsuario(Post, token);
    if (resultado.status === 200) {
      Swal.fire(resultado.data.message, "", "success");
      fetchUsuarios();
      resetCamposNuevo();
      setMostrarBox(false);
    } else {
      Swal.fire("Error: " + (resultado.response?.data?.message || resultado.message), "", "error");
    }
  };

  const SelectorCobrador = ({ value, onChange }) => (
    <Autocomplete
      options={cobradoresDisponibles}
      getOptionLabel={(c) => c.nombreyapellido || ""}
      isOptionEqualToValue={(option, val) => option.idcobrador === val.idcobrador}
      value={cobradoresDisponibles.find((c) => c.idcobrador === value) || null}
      onChange={(event, newValue) => onChange(newValue ? newValue.idcobrador : "")}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cobrador vinculado"
          helperText="Requerido para entrar a la app mobile. Solo se listan cobradores activos de la misma empresa. Opcional."
        />
      )}
    />
  );

  return (
    <BoxGeneral texto="Usuarios">
      <ButtonNuevo Texto="Nuevo" Funcion={AddUsuario} />
      {mostrarBox ? (
        <Box sx={{ boxShadow: 4, mx: 5, my: 5, p: 4 }}>
          <Grid container spacing={2} sx={{ mt: 1, mb: 2 }} justifyContent="center">
            <Grid item xs={12} sm={3}>
              <TextField label="Usuario" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Contraseña" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <SelectorCobrador value={idCobradorNuevo} onChange={setIdCobradorNuevo} />
            </Grid>
            <Grid item xs={12} sm={6}>
              {roles.map((r) => (
                <FormControlLabel
                  key={r.id}
                  sx={{ display: "block", textAlign: "left" }}
                  control={
                    <Checkbox
                      checked={rolIdsNuevo.includes(r.id)}
                      onChange={() => toggleSeleccionRolNuevo(r.id)}
                    />
                  }
                  label={r.name}
                />
              ))}
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Button
              sx={{ boxShadow: 4, color: "white", m: 1, p: 1, backgroundColor: "var(--color-primario)", "&:hover": { background: "var(--color-primario-claro)" } }}
              onClick={() => GuardarNuevoUsuario()}
            >
              Guardar
            </Button>
          </Grid>
        </Box>
      ) : null}

      <Box sx={{ mt: 2 }}>
        <MaterialReactTable data={usuarios} columns={columns} />

        <Modals
          modalabrir={modalEditar}
          titulo="Editar Usuario"
          contenido={
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <SelectorCobrador value={idCobrador} onChange={setIdCobrador} />
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
