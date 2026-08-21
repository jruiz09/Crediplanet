import { Autocomplete, Box, Button, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import ButtonNuevo from "../components/utils/ButtonNuevo";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Modals from "../components/utils/Modal";
import { deletePlanes, getPlanes, postPlanes, putPlanes } from "../services/Planes";


const Planes = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [modalEditar, setModalEditar] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [mostrarBox, setMostrarBox] = useState(false)

  const [descripcion, setDescripcion] = useState("");
  const [dias, setDias] = useState("");
  const [idPlan, setIdPlan] = useState("");


  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    resetCampos();
  };

  const resetCampos = () => {
    setDescripcion("")
    setDias("")
    setIdPlan("")
  }

  const fetchPlanes = async () => {
    const planesData = await getPlanes(token);
    if (planesData.status === 200) {
      setPlanes(planesData.data);
      console.log("clientes = ", clientes);
    } else {
      console.log("Error: ", planesData.response.data.message);
    }
  };

  
  const columns = useMemo(
    () => [
      {
        accessorKey: "idplan",
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
        accessorKey: "descripcion",
        header: "Descripcion",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
      {
        accessorKey: "dias", //normal accessorKey
        header: "Dias",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "#922b3e", color: "white" },
        },
      },
    ],
    []
  );
  useEffect(() => {
    fetchPlanes();
  }, []);

  
  const AccionEditar =  (fila) =>  
  {
    console.log("fila ", fila.row.original)

      setDescripcion (fila.row.original.descripcion)
      setDias (fila.row.original.dias)   
      setIdPlan(fila.row.original.idplan)
    setModalEditar(!modalEditar)
  }

  const AddPlan = () => {
    console.log("add")
    setMostrarBox(!mostrarBox)
  }

  
  const GuardarPlan =  () => {


    if ([descripcion, dias].includes(""))
    {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
        footer: '<a>Revisar campos descripcion y dias</a>'
      });
    }
    else
    {
      Swal.fire({
        title: "Deseas guardar el Plan?",
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
      descripcion : descripcion,
      dias : dias,
    }

    const planPost =  await postPlanes(Post, token);
    if (planPost.status === 200) {
      console.log("Request:", Post)
      console.log("Respuesta:", planPost)
      Swal.fire(planPost.data.message, "", "success");
      fetchPlanes()
      resetCampos()
      
      setMostrarBox(false)
    } else {
      console.log("Error NO VA: ", planPost);
      Swal.fire("Error : " + planPost.response.data.message, "", "error");
    }
  }
   
const EditarPlan = () => {
  setModalEditar(false)
  console.log("Editar")
  if ([descripcion, dias].includes(""))
  {
    Swal.fire({
      icon: "error",
      title: "Faltan campos obligatorios",
      text: "Por favor validar y volver a guardar.",
      footer: '<a>Revisar campos descripción y días</a>'
    });
  }
  else
  {
    Swal.fire({
      title: "Deseas actualizar el plan?",
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
    descripcion : descripcion,
    dias : dias
  }

  const planPost =  await putPlanes(Post, idPlan, token);
  if (planPost.status === 200) {
    console.log("Request:", Post)
    console.log("Respuesta:", planPost)
    Swal.fire(planPost.data.message, "", "success");
    fetchPlanes()
    resetCampos()
    setMostrarBox(false)
  } else {
    console.log("Error NO VA: ", planPost);
    Swal.fire("Error : " + planPost.response.data.message, "", "error");
  }
}


const AccionEliminar = (fila) => {
  console.log("fila ", fila.row.original)

  setIdPlan(fila.row.original.idplan)

  Swal.fire({
    title: "Deseas eliminar el plan?",
    showDenyButton: true,
    confirmButtonText: "Si, Eliminar",
    denyButtonText: `No, cancelar`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {          
      EjecutarDelete(fila.row.original.idplan)
      
    } else if (result.isDenied) {
      Swal.fire("La operación fue cancelada", "", "info");
    }
  });
}



const EjecutarDelete = async (idPlan) => {


  const planPost =  await deletePlanes(idPlan, token);
  if (planPost.status === 200) {
    console.log("Respuesta:", planPost)
    Swal.fire(planPost.data.message, "", "success");
    fetchPlanes()
    resetCampos()
  } else {
    console.log("Error NO VA: ", planPost);
    Swal.fire("Error : " + planPost.response.data.message, "", "error");
  }
}


  return (
    <>
     <BoxGeneral texto="Planes">
        <ButtonNuevo Texto="Nuevo" Funcion={AddPlan} />
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
                label="Descripción"
                variant="outlined"
                fullWidth
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm= {2} md= {2}>
              {" "}
              <TextField
                label="Cantidad días"
                variant="outlined"
                fullWidth
                value={dias}
                onChange={(e) => setDias(e.target.value)}
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
                onClick = {() => GuardarPlan()}
              >
                {" "}
                Guardar{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
        ) : (<></>)}
        
        <Box sx={{ mt: 2 }}>
          <MaterialReactTable data={planes} columns={columns} 
 
     
  
          />
           <Modals
            modalabrir={modalEditar}
            titulo={
              "Editar Plan"            }
            contenido={<>
             <Grid
            container
            spacing={2}
            sx={{ mt: 2, mb: 3 }}
            justifyContent="center"
          >
            

            <Grid item xs={12} sm= {2} md= {2}>
              <TextField
                label="Descripción"
                variant="outlined"
                fullWidth
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm= {2} md= {2}>
              {" "}
              <TextField
                label="Cantidad días"
                variant="outlined"
                fullWidth
                value={dias}
                onChange={(e) => setDias(e.target.value)}
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
                  onClick={() => EditarPlan()}
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

export default Planes