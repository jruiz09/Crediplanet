import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import { getCobradores } from "../services/Cobradores";
import { getVales, postVales, putVales } from "../services/Vale";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  
  TextField,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { MaterialReactTable } from "material-react-table";
import { formatearNumero } from "../components/utils/FormatearNumero";
import Modals from "../components/utils/Modal";

const Vale = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [modalEditar, setModalEditar] = useState(false);
  const [vales, setVales] = useState([]);
  const [cobradores, setCobradores] = useState([]);
  const [mostrarBox, setMostrarBox] = useState(false);
  const [idCobrador, setIdCobrador] = useState("");
  const [cobrador, setCobrador] = useState("");
  const [ingreso, setIngreso] = useState("");
  const [egreso, setEgreso] = useState("");
  const [idVale, setIdVale] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [user, setUser] = useState(localStorage.getItem("usuario"))

  const resetCampos = () => {
    setEgreso("");
    setCobrador("");
    setIdCobrador("");
    setIngreso("");
    setObservaciones("");
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    resetCampos();
  };

  const AddVale = () => {
    resetCampos();
    setMostrarBox(!mostrarBox);
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

  const fetchVales = async () => {
    const valeData = await getVales(token);
    if (valeData.status === 200) {
      setVales(valeData.data);
    } else {
      console.log("Error: ", valeData.response.data.message);
      if (valeData.response.data.message === "Unauthorized!") {
        localStorage.clear();
        navigate("/auth/login");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "idvale",
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
          </Box>
        ),
      },
      {
        accessorKey: "cobrador",
        header: "Cobrador",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
      {
        accessorKey: "egreso", //normal accessorKey
        header: "Egreso",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ row }) => <div>${formatearNumero(row.original.egreso)}</div>,
      },
      {
        accessorKey: "ingreso",
        header: "ingreso",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ row }) => <div>${formatearNumero(row.original.ingreso)}</div>,
      },
      {
        accessorKey: "estado",
        header: "Estado",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() === "Iniciado"
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
        ),
      },
      {
        accessorKey: "observaciones",
        header: "Observaciones",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
    ],
    []
  );

  const GuardarVale = () => {
    if ([egreso, idCobrador].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Todos los campos son obligatorios",
        text: "Por favor validar y volver a guardar.",
      });
    } else {
      Swal.fire({
        title: "Deseas guardar el vale por " + formatearNumero(egreso) + "?",
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

  const EjecutaPost = async () => {
    const Post = {
      egreso: egreso,
      estado: "Iniciado",
      idcobrador: idCobrador,
      cobrador: cobrador,
      usuarioalta: user,
    };

    const valePost = await postVales(Post, token);
    if (valePost.status === 200) {
      console.log("Request:", Post);
      console.log("Respuesta:", valePost);
      Swal.fire(valePost.data.message, "", "success");
      fetchVales();
      resetCampos();
      setMostrarBox(false);
    } else {
      console.log("Error NO VA: ", valePost);
      Swal.fire("Error : " + valePost.response.data.message, "", "error");
    }
  };

  useEffect(() => {
    fetchVales();
    fetchCobradores();
  }, []);

  const AccionEditar = (fila) => {
    console.log("fila ", fila.row.original);
    setIdVale(fila.row.original.idvale);
    setEgreso(fila.row.original.egreso);
    setModalEditar(!modalEditar);
  };


  const EditarVale = () => {
    setModalEditar(false)
    console.log("Editar")
    if ([ingreso, observaciones].includes(""))
    {
      resetCampos()
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: '<a>Todos los campos son obligatorios</a>'
      });
    }
    else if (ingreso > egreso)
    {
      resetCampos()
      Swal.fire({
        icon: "error",
        title: "El monto de ingreso no debe ser mayor al de egreso",
        text: "Por favor validar y volver a guardar.",
      });
    }
    else
    {
      Swal.fire({
        title: "Deseas cerrar el vale con un ingreso de "+formatearNumero(ingreso)+"?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {          
          EjecutarPut()
          
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
      
    }
  }

  

const EjecutarPut = async () => {

  const Post = {
    ingreso : ingreso,
    observaciones : observaciones,
    estado: "Cerrado",
    usuarioedicion: user,
  }

  const valePut =  await putVales(Post, idVale, token);
  if (valePut.status === 200) {
    console.log("Request:", Post)
    console.log("Respuesta:", valePut)
    Swal.fire(valePut.data.message, "", "success");
    fetchVales()
    resetCampos()
  } else {
    console.log("Error NO VA: ", valePut);
    Swal.fire("Error : " + valePut.response.data.message, "", "error");
  }
}


  return (
    <>
      <BoxGeneral texto="Vales">
        <ButtonNuevo Texto="Nuevo" Funcion={AddVale} />
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
              <Grid item xs={12} sm={4} md={4}>
                {" "}
                <Autocomplete
                  id="Cobradores"
                  options={cobradores}
                  inputValue={cobrador}
                  onChange={(event, newValue) => {
                    setIdCobrador(newValue.value);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setCobrador(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cobrador" />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  label="Egreso"
                  variant="outlined"
                  fullWidth
                  value={egreso}
                  onChange={(e) => setEgreso(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                {" "}
                <Button
                  sx={{
                    boxShadow: 4,
                    color: "white",
                    m: 1,
                    p: 1,
                    backgroundColor: "var(--color-primario)",
                    "&:hover": {
                      background: "var(--color-primario-claro)",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => GuardarVale()}
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
        <Box sx={{ mt: 2 }}>
          <MaterialReactTable data={vales} columns={columns} />
          <Modals
            modalabrir={modalEditar}
            titulo={"Cierre Vale"}
            contenido={
              <>
                <Grid
                  container
                  spacing={2}
                  sx={{ mt: 2, mb: 3 }}
                  justifyContent="center"
                >
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Ingreso"
                      variant="outlined"
                      fullWidth
                      value={ingreso}
                      onChange={(e) => setIngreso(e.target.value)}
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
                  onClick={() => EditarVale()}
                  sx={{ pt: 4 }}
                >
                  Cerrar Vale
                </Button>
              </>
            }
          />
        </Box>
      </BoxGeneral>
    </>
  );
};

export default Vale;
