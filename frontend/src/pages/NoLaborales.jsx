import { Box, Button, FormControl, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from 'react'
import BoxGeneral from '../components/utils/BoxGeneral'
import ButtonNuevo from '../components/utils/ButtonNuevo'
import Modals from '../components/utils/Modal';
import { deletenolaborales, getNolaborales, postNolaborales, putNolaborales } from '../services/NoLaborales';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import { MaterialReactTable } from 'material-react-table';
import { formatearFecha } from '../components/utils/FormatearFecha';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

const NoLaborales = () => {

    const [token, setToken] = useState(localStorage.getItem("user-token"));
    const [modalNuevo, setModalNuevo] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [motivo, setMotivo] = useState ("");
    const [fecha, setFecha] = useState("");
    const [dias, setDias] = useState([]);
    const [id, setId] = useState("");

    const OnchangePickedDesde = (newValue) => {
        const NuevaFecha = dayjs(newValue).format("YYYY-MM-DD");
        setFecha(NuevaFecha);
      };

    const abrirCerrarModalNuevo = () => {
        setModalNuevo(!modalNuevo);
      };
      const abrirCerrarModalEditar = () => {
        setModalEditar(!modalEditar);
      };

      const resetCampos = () => {
        setMotivo("");
        setFecha("");
      }
      const GuardarFecha = () => {
        
        abrirCerrarModalNuevo()
        if ([fecha, motivo].includes(""))
    {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
      });
    }
    else
    {
      Swal.fire({
        title: "Deseas guardar la fecha?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {          
          EjecutaPost();
          resetCampos()
          
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
      
    }

      }
      const EditarFecha = () => {
        
        abrirCerrarModalEditar()
        if ([fecha, motivo].includes(""))
    {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor validar y volver a guardar.",
      });
    }
    else
    {
      Swal.fire({
        title: "Deseas guardar la fecha?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {          
          EjecutarPut();
          resetCampos()
          
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
      
    }

      }

      
      const EjecutarPut = async () => {

        const Post = {
          fecha : fecha,
          motivo: motivo
        }
    
        const nolaboralesPost =  await putNolaborales(Post, id,  token);
        if (nolaboralesPost.status === 200) {
          console.log("Request:", Post)
          console.log("Respuesta:", nolaboralesPost)
          Swal.fire(nolaboralesPost.data.message, "", "success");
          fetchDias()
          resetCampos()
        } else {
          console.log("Error NO VA: ", nolaboralesPost);
          Swal.fire("Error : " + nolaboralesPost.response.data.message, "", "error");
        }
      }

      const EjecutaPost = async () => {

        const Post = {
          fecha : fecha,
          motivo: motivo
        }
    
        const nolaboralesPost =  await postNolaborales(Post, token);
        if (nolaboralesPost.status === 200) {
          console.log("Request:", Post)
          console.log("Respuesta:", nolaboralesPost)
          Swal.fire(nolaboralesPost.data.message, "", "success");
          fetchDias()
          resetCampos()
        } else {
          console.log("Error NO VA: ", nolaboralesPost);
          Swal.fire("Error : " + nolaboralesPost.response.data.message, "", "error");
        }
      }

      const fetchDias = async () => {
        const nolaboralesData = await getNolaborales(token);
        if (nolaboralesData.status === 200) {
          setDias(nolaboralesData.data);
          console.log("dias = ", dias);
        } else {
          console.log("Error: ", nolaboralesData.response.data.message);
          if(nolaboralesData.response.data.message === "Unauthorized!")
          {
            localStorage.clear();
            navigate('/auth/login');
          }
        }
      };

      
const AccionEliminar = (fila) => {
    console.log("fila ", fila.row.original)
  
    setId(fila.row.original.idnolaborales)
  
    Swal.fire({
      title: "Deseas eliminar el día?",
      showDenyButton: true,
      confirmButtonText: "Si, Eliminar",
      denyButtonText: `No, cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {          
        EjecutarDelete(fila.row.original.idnolaborales)
        
      } else if (result.isDenied) {
        Swal.fire("La operación fue cancelada", "", "info");
      }
    });
  }

  
const EjecutarDelete = async (IDDIA) => {


    const nolaboralesPost =  await deletenolaborales(IDDIA, token);
    if (nolaboralesPost.status === 200) {
      console.log("Respuesta:", nolaboralesPost)
      Swal.fire(nolaboralesPost.data.message, "", "success");
      fetchDias()
      resetCampos()
    } else {
      console.log("Error NO VA: ", nolaboralesPost);
      Swal.fire("Error : " + nolaboralesPost.response.data.message, "", "error");
    }
  }
  

      const columns = useMemo(
        () => [
            {
                accessorKey: "idnolaborales",
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
            accessorKey: "fecha",
            header: "Fecha",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "#922b3e", color: "white" },
            },
            Cell: ({ row }) => <div>{formatearFecha(row.original.fecha)}</div>,
          },
          {
            accessorKey: "motivo", //normal accessorKey
            header: "Motivo",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "#922b3e", color: "white" },
            },
          },
        ],
        []
      );

      const AccionEditar = (fila) =>{
        setMotivo(fila.row.original.motivo);
        setFecha(fila.row.original.fecha);
        setId(fila.row.original.idnolaborales);
        setModalEditar(!modalEditar)
      } 
      useEffect(() => {
        fetchDias();
        }, []);
  return (
    <>
    <BoxGeneral texto="Días no laborales">
    <ButtonNuevo Texto="Nuevo día" Funcion= {abrirCerrarModalNuevo}></ButtonNuevo>
    <Box sx={{ mt: 2 }}>
    <MaterialReactTable data={dias} columns={columns} />
    </Box>
    
    <Modals
            modalabrir={modalNuevo}
            titulo={
              "Nuevo día no laboral"}
            contenido={<>
    
            <FormControl fullWidth>
                <LocalizationProvider  dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Fecha"
                      onChange={(newValue) => OnchangePickedDesde(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
        
              {" "}
              <TextField
              sx={{mt:2}}
                label="Motivo"
                variant="outlined"
                fullWidth
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />

            </>}
            botones={
              <>
                <Button
                  onClick={() => abrirCerrarModalNuevo()}
                  sx={{ pt: 4 }}
                >
                  Cancelar
                </Button>
                <Button
                  color="error"
                  onClick={() => GuardarFecha()}
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
              "Editar día no laboral"}
            contenido={<>
    
            <FormControl fullWidth>
                <LocalizationProvider  dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Fecha"
                      onChange={(newValue) => OnchangePickedDesde(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
        
              {" "}
              <TextField
              sx={{mt:2}}
                label="Motivo"
                variant="outlined"
                fullWidth
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
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
                  onClick={() => EditarFecha()}
                  sx={{ pt: 4 }}
                >
                  Guardar
                </Button>
              </>
            }
          />
    </BoxGeneral>
    </>
  )
}

export default NoLaborales