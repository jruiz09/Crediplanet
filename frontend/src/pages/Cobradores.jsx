import { Autocomplete, Box, Button, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import { deleteCobradores, getCobradores, postCobradores, putCobradores } from "../services/Cobradores";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Modals from "../components/utils/Modal";
const Cobradores = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
    const [modalEditar, setModalEditar] = useState(false);
    const [cobradores, setCobradores] = useState([]);
    const [mostrarBox, setMostrarBox] = useState(false)

    const [nombre, setNombre] = useState("");
    const [dni, setDni] = useState("");
    const [celular, setCelular] = useState("");
    const [idCobrador, setIdCobrador] = useState("");

    
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    resetCampos();
  };

  const resetCampos = () => {
    setNombre("")
    setDni("")
    setCelular("")
    setIdCobrador("")
  }

  const fetchCobradores = async () => {
    const cobradoresData = await getCobradores(token);
    if (cobradoresData.status === 200) {
      setCobradores(cobradoresData.data);
      console.log("clientes = ", cobradores);
    } else {
      console.log("Error: ", cobradoresData.response.data.message);
    }
  };

  
  const columns = useMemo(
    () => [
      {
        accessorKey: "idcobrador",
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
        header: "Cobrador",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "dni", //normal accessorKey
        header: "DNI",
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
    ],
    []
  );
  useEffect(() => {
    fetchCobradores();
  }, []);


  
  const AccionEditar =  (fila) =>  
  {
    console.log("fila ", fila.row.original)

      setNombre (fila.row.original.nombreyapellido)
      setDni (fila.row.original.dni)   
      setCelular (fila.row.original.celular)
      setIdCobrador(fila.row.original.idcobrador)
    setModalEditar(!modalEditar)
  }

  const AddCobrador = () => {
    console.log("add")
    setMostrarBox(!mostrarBox)
  }

  
  const GuardarCobrador =  () => {


    if ([nombre, dni].includes(""))
    {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: '<a>Revisar campos Nombre, y DNI</a>'
      });
    }
    else
    {
      Swal.fire({
        title: "Deseas guardar el Cobrador?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {          
          EjecutaPost()
          
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
      
    }
  };

  const EjecutaPost = async () => {

    const Post = {
      nombreyapellido : nombre,
      dni : dni,
      celular : celular,
      idempresa: 1
    }

    const cobradorPost =  await postCobradores(Post, token);
    if (cobradorPost.status === 200) {
      console.log("Request:", Post)
      console.log("Respuesta:", cobradorPost)
      Swal.fire(cobradorPost.data.message, "", "success");
      fetchCobradores()
      resetCampos()
      
      setMostrarBox(false)
    } else {
      console.log("Error NO VA: ", cobradorPost);
      Swal.fire("Error : " + cobradorPost.response.data.message, "", "error");
    }
  }
   
const EditarCobrador = () => {
  setModalEditar(false)
  console.log("Editar")
  if ([nombre, dni].includes(""))
  {
    Swal.fire({
      icon: "error",
      title: "Faltan campos obligatorios",
      text: "Por favor validar y volver a guardar.",
      footer: '<a>Revisar campos Nombre y DNI</a>'
    });
  }
  else
  {
    Swal.fire({
      title: "Deseas actualizar el cobrador?",
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
    nombreyapellido : nombre,
    dni : dni,
    celular : celular,
    idempresa: 1
  }

  const cobradorPost =  await putCobradores(Post, idCobrador, token);
  if (cobradorPost.status === 200) {
    console.log("Request:", Post)
    console.log("Respuesta:", cobradorPost)
    Swal.fire(cobradorPost.data.message, "", "success");
    fetchCobradores()
    resetCampos(
    setMostrarBox(false)
    )
  } else {
    console.log("Error NO VA: ", cobradorPost);
    Swal.fire("Error : " + cobradorPost.response.data.message, "", "error");
  }
}


const AccionEliminar = (fila) => {
  console.log("fila ", fila.row.original)

  setIdCobrador(fila.row.original.idcobrador)

  Swal.fire({
    title: "Deseas eliminar el cliente?",
    showDenyButton: true,
    confirmButtonText: "Si, Eliminar",
    denyButtonText: `No, cancelar`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {          
      EjecutarDelete(fila.row.original.idcobrador)
      
    } else if (result.isDenied) {
      Swal.fire("La operación fue cancelada", "", "info");
    }
  });
}



const EjecutarDelete = async (idCobrador) => {


  const cobradorPost =  await deleteCobradores(idCobrador, token);
  if (cobradorPost.status === 200) {
    console.log("Respuesta:", cobradorPost)
    Swal.fire(cobradorPost.data.message, "", "success");
    fetchCobradores()
    resetCampos()
  } else {
    console.log("Error NO VA: ", cobradorPost);
    Swal.fire("Error : " + cobradorPost.response.data.message, "", "error");
  }
}



  return (
    <>
      <BoxGeneral texto="Cobradores">
        <ButtonNuevo Texto="Nuevo" Funcion={AddCobrador} />
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


            <Grid item xs={12} sm= {2} md= {2}>
              <TextField
                label="Nombre y Apellido"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm= {2} md= {2}>
              {" "}
              <TextField
                label="DNI"
                variant="outlined"
                fullWidth
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm= {2} md= {2}>
              {" "}
              <TextField
                label="Celular"
                variant="outlined"
                fullWidth
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm= {2} md= {2}>
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
                onClick = {() => GuardarCobrador()}
              >
                {" "}
                Guardar{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
        ) : (<></>)}
        
        <Box sx={{ mt: 2 }}>
          <MaterialReactTable data={cobradores} columns={columns} 
 
     
  
          />
           <Modals
            modalabrir={modalEditar}
            titulo={
              "Editar Cobrador"            }
            contenido={<>
             <Grid
            container
            spacing={2}
            sx={{ mt: 2, mb: 3 }}
            justifyContent="center"
          >
            

            <Grid item xs={12} sm= {2} md= {2}>
              <TextField
                label="Nombre y Apellido"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm= {2} md= {2}>
              {" "}
              <TextField
                label="DNI"
                variant="outlined"
                fullWidth
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm= {2} md= {2}>
              {" "}
              <TextField
                label="Celular"
                variant="outlined"
                fullWidth
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />
            </Grid>
            </Grid>
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
                  onClick={() => EditarCobrador()}
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
  )
}

export default Cobradores