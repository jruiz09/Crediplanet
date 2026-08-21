import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Tooltip } from "@mui/material";
import React, { useMemo, useState, useEffect } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MaterialReactTable } from "material-react-table";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { formatearNumero } from "../components/utils/FormatearNumero";
import { formatearFecha } from "../components/utils/FormatearFecha";
import { getRendicionPorCorador } from "../services/Rendicion";
import { getCobradores } from "../services/Cobradores";
import Modals from "../components/utils/Modal";
import { postPagoCobradores } from "../services/PagoCobradores";

const PagoCobradores = () => {
  
    const [token, setToken] = useState(localStorage.getItem("user-token"));
    const [user, setUser] = useState(localStorage.getItem("usuario"))
  
      
  const [idCobrador, setIdCobrador] = useState("");
  const [cobrador, setCobrador] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [productividad, setProductividad] = useState([]);
  const [modalPago, setModalPago] = useState(false)
  const [estimado, setEstimado] = useState("")
  const [real, setReal] = useState("")
  const [tipoTransaccion, setTipoTransaccion] = useState("");
  const transacciones = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
  ];

  const [cobradores, setCobradores] = useState([]);
    const OnchangePickedDesde = (newValue) => {
        const NuevaFecha = dayjs(newValue).format("YYYY-MM-DD");
        setFechaDesde(NuevaFecha);
      };
      const OnchangePickedHasta = (newValue) => {
        const NuevaFecha = dayjs(newValue).format("YYYY-MM-DD");
        setFechaHasta(NuevaFecha);
      };

      const fetchrRendicionxCobrador = async (post, tokens) => {
        
        const productividadData = await getRendicionPorCorador( post, tokens);
        if (productividadData.status === 200) {
            setProductividad(productividadData.data);
   
        } else {
          console.log("Error: ", productividadData.response.data.message);
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

      const abrirCerrarModalPago = (datos) => {
        setModalPago(!modalPago);
        setReal(datos.row.original.real);
        
        
      };
   


      const columns = useMemo(
        () => [
   
          {
            accessorKey: "estimado",
            header: "Pagar",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "#922b3e", color: "white" },
            },
            Cell: ({ cell }) => (<>
  {cell.row.original.estimado > 0 ? (<>
                <Box sx={{ display: "flex", gap: "1rem" }}>
              
              <Tooltip arrow placement="left" title="Pagar">
                <Button 
                onClick={() => abrirCerrarModalPago(cell)}>
                  Pagar
                </Button>
              </Tooltip>
            </Box>
            </>)
        : (<></>)  
        }
             
              </>
            )
          },
          {
            accessorKey: "estimado", //normal accessorKey
            header: "Estimado",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "#922b3e", color: "white" },
              
            },
            Cell: ({ row }) => <div>{formatearNumero(row.original.estimado)}</div>,
          },
          {
            accessorKey: "real",
            header: "Real",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "#922b3e", color: "white" },
            },
            Cell: ({ row }) => <div>{formatearNumero(row.original.real)}</div>,
          },
          {
            accessorKey: "Productividad",
            header: "Productividad",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "#922b3e", color: "white" },
            },
           /* Cell: ({ cell }) => (
              
                <Box
                  component="span"
                  sx={(theme) => ({
                    backgroundColor:
                      cell.getValue() < 80
                        ? theme.palette.error.dark
                        : theme.palette.success.dark,
                    borderRadius: "0.25rem",
                    color: "#fff",
                    maxWidth: "9ch",
                    p: "0.25rem",
                  })}
                >
                {cell.getValue()}%
                </Box>
              ),*/
              Cell: ({ cell }) => (<>
                {cell.row.original.estimado > 0 ? (<>
                  <Box
                  component="span"
                  sx={(theme) => ({
                    backgroundColor:
                      cell.getValue() < 80
                        ? theme.palette.error.dark
                        : theme.palette.success.dark,
                    borderRadius: "0.25rem",
                    color: "#fff",
                    maxWidth: "9ch",
                    p: "0.25rem",
                  })}
                >
                {cell.getValue()}%
                </Box>
                          </>)
                      : (<></>)  
                      }
                           
                            </>
                          )
                        },
        
  
        ],
        []
      );


      const Buscar = async () => {
        const Post = {
          fechadesde: fechaDesde, 
          fechahasta: fechaHasta,
          idcobrador: idCobrador
        }
        console.log("Post", Post)
          if ([idCobrador, fechaDesde, fechaHasta].includes(""))
          {
              Swal.fire({
                  icon: "error",
                  title: "Todos los campos son obligatorios",
                });
          }
        
          else
          {
              await fetchrRendicionxCobrador( Post, token)
          }
      }

      useEffect(() => {
        fetchCobradores();
      }, []);
    

      const RegistrarPago = async () => {
        setModalPago(false)
        let pago = (real * porcentaje) / 100
        if ([porcentaje, tipoTransaccion].includes(""))
        {
          Swal.fire({
            icon: "error",
            title: "El porcentaje es obligatorio",
          });
        }
        else
        {
          Swal.fire({
            title: "Deseas realizar el pago por un total de $"+pago+" ?",
            showDenyButton: true,
            confirmButtonText: "Si, guardar",
            denyButtonText: `No, cancelar`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {          
              ejecutarPostPagoCobradores()
              
            } else if (result.isDenied) {
              Swal.fire("La operación fue cancelada", "", "info");
            }
          });
          
        }
      }

      const ejecutarPostPagoCobradores = async () => {
        const post =  {
          idcobrador: idCobrador,
      cobrador: cobrador,
      fechadesde : fechaDesde,
      fechahasta: fechaHasta,
      montorecaudado: real,
      porcentajepago: porcentaje,
      tipotransaccion: tipoTransaccion,
      usuarioalta: user
        }

        const pagoPost =  await postPagoCobradores(post, token);
        if (pagoPost.status === 200) {
          console.log("Request:", post)
          console.log("Respuesta:", pagoPost)
          Swal.fire(pagoPost.data.message, "", "success");
        } else {
          console.log("Error NO VA: ", pagoPost);
          Swal.fire("Error : " + pagoPost.response.data.message, "", "error");
        }

      }
  return (
    <>
    <BoxGeneral texto="Pago cobradores">
        <Grid
              container
              spacing={2}
              sx={{ mt: 2, mb: 3 }}
              justifyContent="center"
            
        >
 <Grid item xs={12} sm= {6} md= {3}>
                 <Autocomplete

                 sx= {{mt: 1}}
                
                id="Cobradores"
                options={cobradores}
                
                value= {cobrador}
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
             <Grid  item xs={12}
          sm={6}
          md={3}>
          <FormControl fullWidth>
                <LocalizationProvider  dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Fecha Desde"
                      onChange={(newValue) => OnchangePickedDesde(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
          </Grid>
          <Grid  item xs={12}
          sm={6}
          md={3}>
          <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Fecha Hasta"
                      onChange={(newValue) => OnchangePickedHasta(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
          </Grid>
          <Grid  item xs={12}
          sm={6}
          md={3}>
          <Button sx={{ mt: 2 }} onClick={() => Buscar()}>
          <SearchIcon />
        </Button>
          </Grid> 
        </Grid>

        <MaterialReactTable data={productividad} columns={columns} />
        <Modals
            modalabrir={modalPago}
            titulo={
              "Registrar pago"}
            contenido={<>
           
         <TextField
                label="Porcentaje"
                variant="outlined"
                fullWidth
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
              />
                            <Autocomplete
              sx={{mt: 2}}
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
        
            </>}
            botones={
              <>
                <Button
                  onClick={() => abrirCerrarModalPago()}
                  sx={{ pt: 4 }}
                >
                  Cancelar
                </Button>
                <Button
                  color="error"
                  onClick={() => RegistrarPago()}
                  sx={{ pt: 4 }}
                >
                  Registrar
                </Button>
              </>
            }
          />
    </BoxGeneral>
    </>
  )
}

export default PagoCobradores