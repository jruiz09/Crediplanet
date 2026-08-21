import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import {
  deleteClientes,
  getClientes,
  postClientes,
  putClientes,
} from "../services/Clientes";
import { getCobradores } from "../services/Cobradores";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import Modals from "../components/utils/Modal";
import { useNavigate } from "react-router-dom";

import PhotoCamera from "@mui/icons-material/PhotoCamera";

const Clientes = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const navigate = useNavigate();
  const [modalEditar, setModalEditar] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [cobradores, setCobradores] = useState([]);
  const [mostrarBox, setMostrarBox] = useState(false);

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [celular, setCelular] = useState("");
  const [idCobrador, setIdCobrador] = useState("");
  const [cobrador, setCobrador] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [file1, setFile] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(event.target.files[0]);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    resetCampos();
  };

  const resetCampos = () => {
    setNombre("");
    setDireccion("");
    setCelular("");
    setIdCobrador("");
    setCobrador("");
    setIdCliente("");
    setFile("");
    setImageUrl("");
  };

  const fetchClientes = async () => {
    const clientesData = await getClientes(token);
    if (clientesData.status === 200) {
      setClientes(clientesData.data);
      console.log("clientes = ", clientes);
    } else {
      console.log("Error: ", clientesData.response.data.message);
      if (clientesData.response.data.message === "Unauthorized!") {
        localStorage.clear();
        navigate("/auth/login");
      }
    }
  };

  const fetchCobradores = async () => {
    const arr = [];
    const CobradoresData = await getCobradores(token);
    if (CobradoresData.status === 200) {
      let result = CobradoresData.data;
      result.map((cobrador) => {
        return arr.push({
          value: cobrador.idcobrador,
          label: cobrador.nombreyapellido,
        });
      });
      console.log("Cobradores = ", arr);
      setCobradores(arr);
    } else {
      console.log("Error: ", CobradoresData.response.data.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "idcliente",
        header: "Acciones",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
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
        accessorKey: "nombreyapellido",
        header: "Cliente",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "direccion", //normal accessorKey
        header: "Dirección",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "celular",
        header: "Celular",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "nombrecobrador",
        header: "Cobrador Asignado",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "foto",
        header: "Foto",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
        Cell: ({ row }) => {
          const filename = row.original.foto;
          const imageUrl = filename
            ? `https://app.cplanet.com.ar/api/uploads/${filename}`
            : null;

          return imageUrl ? (
            <Tooltip
              title={
                <img
                  src={imageUrl}
                  alt="foto ampliada"
                  style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              }
              placement="right"
              arrow
            >
              <img
                src={imageUrl}
                alt="foto cliente"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          ) : (
            <span>Sin foto</span>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    fetchClientes();
    fetchCobradores();
  }, []);

  const AccionEditar = (fila) => {
    console.log("fila ", fila.row.original);

    setNombre(fila.row.original.nombreyapellido);
    setDireccion(fila.row.original.direccion);
    setCelular(fila.row.original.celular);
    setIdCobrador(fila.row.original.idcobrador);
    setCobrador(fila.row.original.nombrecobrador);
    setIdCliente(fila.row.original.idcliente);

    setModalEditar(!modalEditar);
  };

  const AddCliente = () => {
    console.log("add");
    setMostrarBox(!mostrarBox);
  };

  const GuardarCliente = () => {
    if ([nombre, direccion, idCobrador].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: "<a>Revisar campos Nombre, dirección y Cobrador</a>",
      });
      return;
    }
// 🧠 Normaliza texto: minúsculas, sin tildes, ni caracteres raros
const normalizar = (texto) =>
  texto
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/[^\w\s]/g, "") // elimina signos de puntuación
    .replace(/\s+/g, " ") // quita espacios dobles
    .trim();

// 🔍 Tokeniza la dirección separando palabras y números
const tokenizar = (texto) => {
  const clean = normalizar(texto);
  const palabras = clean.match(/[a-zA-Záéíóúñ]+/g) || [];
  const numeros = clean.match(/\d+/g) || [];
  return { palabras, numeros };
};

const dirNueva = tokenizar(direccion);

// ✅ Detecta coincidencias que compartan al menos una palabra y un número
const coincidencias = clientes.filter((c) => {
  const dirExistente = tokenizar(c.direccion);
  if (!dirExistente || (!dirExistente.palabras.length && !dirExistente.numeros.length)) return false;

  // Coincidencia por palabra
  const palabraCoincide = dirNueva.palabras.some((p) =>
    dirExistente.palabras.includes(p)
  );

  // Coincidencia por número
  const numeroCoincide = dirNueva.numeros.some((n) =>
    dirExistente.numeros.includes(n)
  );

  // Solo si hay coincidencia de palabra Y número
  return palabraCoincide && numeroCoincide;
});

    if (coincidencias.length > 0) {
      // Construir tabla HTML
      const tablaHTML = `
      <div style="max-height:300px; overflow-y:auto;">
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr style="background-color:#922b3e; color:white; text-align:left;">
              <th style="padding:6px;">Cliente</th>
              <th style="padding:6px;">Dirección</th>
              <th style="padding:6px;">Celular</th>
              <th style="padding:6px;">Cobrador</th>
            </tr>
          </thead>
          <tbody>
            ${coincidencias
              .map(
                (c) => `
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:6px;">${c.nombreyapellido}</td>
                <td style="padding:6px;">${c.direccion}</td>
                <td style="padding:6px;">${c.celular || "-"}</td>
                <td style="padding:6px;">${c.nombrecobrador || "-"}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

      Swal.fire({
        title: "⚠️ Dirección duplicada detectada",
        html: `
        <p style="font-size:1rem; margin-top:10px;">
          Se encontraron <b>${coincidencias.length}</b> clientes con la misma dirección:
        </p>
        ${tablaHTML}
        <p style="margin-top:15px;">
          ¿Deseas continuar de todas formas?
        </p>
      `,
        icon: "warning",
        iconColor: "#d32f2f",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        allowOutsideClick: false,
        background: "#fff9f9",
        color: "#333",
        confirmButtonColor: "#FFFFFF",
        cancelButtonColor: "#FFFFFF",
        width: "600px",
        customClass: {
          popup: "animate__animated animate__headShake animate__faster",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          confirmarGuardarCliente();
        } else {
          Swal.fire("Operación cancelada", "", "info");
        }
      });
    } else {
      confirmarGuardarCliente();
    }
  };

  // 🔁 Confirmación normal si no hay duplicado o el usuario decide continuar
  const confirmarGuardarCliente = () => {
    Swal.fire({
      title: "¿Deseas guardar el cliente?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Sí, guardar",
      denyButtonText: `No, cancelar`,
      confirmButtonColor: "#FFFFFF",
      denyButtonColor: "#FFFFFF",
      background: "#ffffff",
    }).then((result) => {
      if (result.isConfirmed) {
        EjecutaPost();
      } else if (result.isDenied) {
        Swal.fire("La operación fue cancelada", "", "info");
      }
    });
  };

  const EjecutaPost = async () => {
    const formData = new FormData();
    formData.append("nombreyapellido", nombre);
    formData.append("direccion", direccion);
    formData.append("celular", celular);
    formData.append("idcobrador", idCobrador);
    formData.append("nombrecobrador", cobrador);
    if (file1) formData.append("foto", file1);
    console.log("append ", formData.append);

    const clientePost = await postClientes(formData, token);

    console.log("respuesta ", clientePost.status);
    if (clientePost.status == 200) {
      console.log("Respuesta:", clientePost);
      Swal.fire(clientePost.data.message, "", "success");
      fetchClientes();
      resetCampos(setMostrarBox(false));
    } else {
      console.log("Error NO VA: ", clientePost);
      Swal.fire("Error : " + clientePost.response.data.message, "", "error");
    }
  };

  const EditarProducto = () => {
    setModalEditar(false);
    console.log("Editar");
    if ([nombre, direccion, idCobrador].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: "<a>Revisar campos Nombre, direccion y Cobrador</a>",
      });
    } else {
      Swal.fire({
        title: "Deseas actualizar el cliente?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          EjecutarPut();
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
    }
  };

  const EjecutarPut = async () => {
    const formData1 = new FormData();
    formData1.append("nombreyapellido", nombre);
    formData1.append("direccion", direccion);
    formData1.append("celular", celular);
    formData1.append("idcobrador", idCobrador);
    formData1.append("nombrecobrador", cobrador);
    if (file1) formData1.append("foto", file1);

    const clientePost = await putClientes(formData1, idCliente, token);
    if (clientePost.status === 200) {
      Swal.fire(clientePost.data.message, "", "success");
      fetchClientes();
      resetCampos();
      setMostrarBox(false);
    } else {
      Swal.fire("Error : " + clientePost.response.data.message, "", "error");
    }
  };

  const AccionEliminar = (fila) => {
    console.log("fila ", fila.row.original);

    setIdCliente(fila.row.original.idcliente);

    Swal.fire({
      title: "Deseas eliminar el cliente?",
      showDenyButton: true,
      confirmButtonText: "Si, Eliminar",
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        EjecutarDelete(fila.row.original.idcliente);
      } else if (result.isDenied) {
        Swal.fire("La operación fue cancelada", "", "info");
      }
    });
  };

  const EjecutarDelete = async (IDCLIENTE) => {
    const clientePost = await deleteClientes(IDCLIENTE, token);
    if (clientePost.status === 200) {
      console.log("Respuesta:", clientePost);
      Swal.fire(clientePost.data.message, "", "success");
      fetchClientes();
      resetCampos();
    } else {
      console.log("Error NO VA: ", clientePost);
      Swal.fire("Error : " + clientePost.response.data.message, "", "error");
    }
  };

  return (
    <>
      <BoxGeneral texto="Clientes">
        <ButtonNuevo Texto="Nuevo" Funcion={AddCliente} />
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
              alignItems="center"
            >
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  id="Cobradores"
                  options={cobradores}
                  inputValue={cobrador}
                  onChange={(event, newValue) => {
                    setIdCobrador(newValue?.value || "");
                  }}
                  onInputChange={(event, newInputValue) => {
                    setCobrador(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cobrador" fullWidth />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Nombre y Apellido"
                  variant="outlined"
                  fullWidth
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Dirección"
                  variant="outlined"
                  fullWidth
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Celular"
                  variant="outlined"
                  fullWidth
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <label htmlFor="upload-image">
                    <Button
                      sx={{ color: "#9e9e9e", borderColor: "#9e9e9e" }}
                      variant="outlined"
                      component="span"
                    >
                      <PhotoCamera />
                    </Button>
                    <input
                      id="upload-image"
                      hidden
                      accept="image/*"
                      type="file"
                      name="Image"
                      onChange={(event) => handleFileUpload(event)}
                    />
                  </label>

                  {imageUrl && (
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt="Preview"
                        height="75"
                        style={{ display: "block" }}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Button
                  sx={{
                    boxShadow: 4,
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    backgroundColor: "#922b3e",
                    "&:hover": {
                      background: "#d87d8e",
                      cursor: "pointer",
                    },
                  }}
                  onClick={GuardarCliente}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <></>
        )}

        <Box sx={{ mt: 2 }}>
          <MaterialReactTable data={clientes} columns={columns} />
          <Modals
            modalabrir={modalEditar}
            titulo={"Editar Cliente"}
            contenido={
              <>
                <Grid
                  container
                  spacing={2}
                  sx={{ mt: 2, mb: 3 }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                      id="Cobradores"
                      options={cobradores}
                      value={cobrador}
                      inputValue={cobrador}
                      onChange={(event, newValue) => {
                        setIdCobrador(newValue?.value || "");
                      }}
                      onInputChange={(event, newInputValue) => {
                        setCobrador(newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Cobrador" fullWidth />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Nombre y Apellido"
                      variant="outlined"
                      fullWidth
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Dirección"
                      variant="outlined"
                      fullWidth
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Celular"
                      variant="outlined"
                      fullWidth
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <label htmlFor="upload-image">
                        <Button
                          sx={{ color: "#9e9e9e", borderColor: "#9e9e9e" }}
                          variant="outlined"
                          component="span"
                        >
                          <PhotoCamera />
                        </Button>
                        <input
                          id="upload-image"
                          hidden
                          accept="image/*"
                          type="file"
                          name="Image"
                          onChange={(event) => handleFileUpload(event)}
                        />
                      </label>

                      {imageUrl && (
                        <Box
                          sx={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt="Preview"
                            height="75"
                            style={{ display: "block" }}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </>
            }
            botones={
              <>
                <Button onClick={() => abrirCerrarModalEditar()} sx={{ pt: 4 }}>
                  Cancelar
                </Button>
                <Button
                  color="error"
                  onClick={() => EditarProducto()}
                  sx={{ pt: 4 }}
                >
                  Guardar
                </Button>
              </>
            }
          />
        </Box>
      </BoxGeneral>
    </>
  );
};

export default Clientes;
