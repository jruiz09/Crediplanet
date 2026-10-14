import { Alert, Autocomplete, Box, Button, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import { formatearNumero } from "../components/utils/FormatearNumero";
import { getRendicion, getRendido } from "../services/Creditos";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Modals from "../components/utils/Modal";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { getDetallexCredito, putPagoCuota } from "../services/CreditoDetalles";
import { getCobradores } from "../services/Cobradores";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptIcon from '@mui/icons-material/Receipt';
import { formatearFecha } from "../components/utils/FormatearFecha";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Rendicion = () => {
      const [token, setToken] = useState(localStorage.getItem("user-token"));
    const [user, setUser] = useState(localStorage.getItem("usuario"))
  const [rendiciones, setRendiciones] = useState([]);
  const [modalPago, setModalPago] = useState(false)
  const [modalDetalle, setModalDetalle] = useState(false)
  const [idCreditoDetalle, setIdCreditoDetalle] = useState("")
  const [montoPago, setMontoPago] = useState ("")
  const [monto, setMonto] = useState ("")
  const [observaciones , setObservaciones] = useState("");
  const [total, setTotal] = useState("")
  const [totalRendido, setTotalRendido] = useState("")
  const [idCredito, setIdCredito] = useState("")
  const [noContabiliza, setNoContabiliza] = useState(false)
  
  const [idCobrador, setIdCobrador] = useState(null);
  const [cobrador, setCobrador] = useState(null);
  const [tipoTransaccion, setTipoTransaccion] = useState(null);
  const transacciones = [
    { label: "Efectivo", value: 1 },
    { label: "Transferencia", value: 2 },
  ];

  
  const [cobradores, setCobradores] = useState([]);

  const fetchRendicion = async () => {
    const rendicionData = await getRendicion(cobrador.value, token);
    if (rendicionData.status === 200) {
        setRendiciones(rendicionData.data);
        const TOTAL = rendicionData.data.reduce(
          (acc, row) => acc + parseFloat(row.monto, 0),
          0
        );
        setTotal(TOTAL)
      console.log("Rendiciones = ", rendiciones);
    } else {
      console.log("Error: ", rendicionData.response.data.message);
    }
  };

  const fetchRendido = async () => {
    const rendicionData = await getRendido(cobrador.value, token);
    if (rendicionData.status === 200) {
        const TOTAL = rendicionData.data.reduce(
          (acc, row) => acc + parseFloat(row.monto, 0),
          0
        );
        setTotalRendido(TOTAL)
      console.log("Rendiciones = ", rendiciones);
    } else {
      console.log("Error: ", rendicionData.response.data.message);
    }
  };

  const resetCampos = () => {
    setIdCreditoDetalle("");
    setMonto("");
    setMontoPago("");
    setTipoTransaccion("");
  setObservaciones("");
  setNoContabiliza(false)
  }


  const abrirCerrarModalPago = (datos) => {
    resetCampos();
    setModalPago(!modalPago);
    setModalDetalle(false);
    setMonto(datos.row.original.monto);
    setIdCreditoDetalle(datos.row.original.idcreditodetalle)
    
    
  };


  const abrirCerrarModalDetalle = () => {
    setModalDetalle(!modalDetalle);
    
  };




  const EjecutarPagoCuota = async () => {

    const Post = {
      montopago : parseInt(montoPago),
      tipotransaccion: tipoTransaccion,
      usuario : user,
      observaciones: observaciones,
      nocontabiliza: noContabiliza
    }

    const PagoCuota = await putPagoCuota(Post, idCreditoDetalle, token);
    if (PagoCuota.status === 200) {
      console.log("Request:", Post)
      console.log("Respuesta:", PagoCuota)
      Swal.fire(PagoCuota.data.message, "", "success");
      fetchRendicion(cobrador.value)
      fetchRendido(cobrador.value)
      resetCampos()
      abrirCerrarModalPago()
    } else {
      console.log("Error NO VA: ", PagoCuota);
      Swal.fire(" " + PagoCuota.response.data.message, "", "error");
    }
    
  }

  
  const RegistrarPago = async () => {
    console.log("idcreditodetalle ==>", idCreditoDetalle)
    if ([montoPago, idCreditoDetalle].includes(""))
    {
        Swal.fire({
            icon: "error",
            title: "Faltan campos obligatorios",
            text: "Por favor validar y volver a guardar.",
            footer: '<a>TODOS LOS CAMPOS SON OBLIGATORIOS</a>'
          });
          
    abrirCerrarModalPago()
    }
    else
{
  Swal.fire({
    title: "Deseas registrar el pago de la cuota por un monto de "+formatearNumero(parseInt(montoPago)) + "?",
    showDenyButton: true,
    confirmButtonText: "Si, guardar",
    denyButtonText: `No, cancelar`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {          
        EjecutarPagoCuota()
        resetCampos()
    } else if (result.isDenied) {
      Swal.fire("La operación fue cancelada", "", "info");
    }
  });
  abrirCerrarModalPago()
  }
}


    
  const columns = useMemo(
    () => [
        {
            accessorKey: "idcreditodetalle",
            header: "Pagar",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "var(--color-primario)", color: "white" },
            },
            Cell: ({ cell }) => (<>
              
                <Box sx={{ display: "flex", gap: "1rem" }}>
              
              <Tooltip arrow placement="left" title="Pago Cuota">
                <IconButton 
                onClick={() => abrirCerrarModalPago(cell)}>
                  <AttachMoneyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="left" title="Detalle crédito">
            <IconButton onClick={() => AbrirDetalle(cell.row.original)}>
              <ReceiptIcon />
            </IconButton>
          </Tooltip>
            </Box>
              
              </>
            )
          },
      {
        accessorKey: "idcredito",
        header: "Credito",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
      
      {
        accessorKey: "cuota", //normal accessorKey
        header: "Cuota",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
      {
        accessorKey: "estado",
        header: "Estado Cuota",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
      {
        accessorKey: "cliente",
        header: "Cliente",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
      {
        accessorKey: "monto",
        header: "Monto",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.monto)}</div>,
      },
      {
        accessorKey: "montopago",
        header: "Monto Pago",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.montopago)}</div>,
      },
      
    ],
    []
  );

  const columnsD = useMemo(
    () => [
      {
        accessorKey: "idcreditodetalle",
        header: "Pagar",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ cell }) => (
          <>
            {cell.row.original.estado === "Pago Registrado" ? (
              <>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Tooltip arrow placement="left" title="Detalle crédito">
                    <Button
                      disabled={true}
                      onClick={ () => abrirCerrarModalPago(cell)}
                    >
                      <AttachMoneyIcon />
                    </Button>
                  </Tooltip>
                  
          
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Tooltip arrow placement="left" title="Detalle crédito">
                    <Button onClick={() => abrirCerrarModalPago(cell)}>
                      <AttachMoneyIcon />
                    </Button>
                  </Tooltip>
                  
        
                </Box>
              </>
            )}
          </>
        ),
      },
      {
        accessorKey: "cuota",
        header: "Cuota",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
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
                cell.getValue() === "Pendiente"
                  ? theme.palette.primary.dark
                  : cell.getValue() === "Pago Parcial"
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
        accessorKey: "fechapago", //normal accessorKey
        header: "Fecha de pago",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearFecha(row.original.fechapago)}</div>,
      },
      {
        accessorKey: "monto",
        header: "Monto Cuota",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.monto)}</div>,
      },
      {
        accessorKey: "montopago",
        header: "Monto Pago",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
        Cell: ({ row }) => <div>{formatearNumero(row.original.montopago)}</div>,
      },
      
      {
        accessorKey: "observaciones",
        header: "Observaciones",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },

      {
        accessorKey: "tipotransaccion",
        header: "Tipo Transac.",
        muiTableHeadCellProps: {
          sx: { backgroundColor: "var(--color-primario)", color: "white" },
        },
      },
    ],
    []
  );

  const [detalle, setDetalle] = useState([]);
  
  const fetchCredito = async (IDCREDITO) => {
    const creditosData = await getDetallexCredito(IDCREDITO, token);
    if (creditosData.status === 200) {
      setDetalle(creditosData.data);
      console.log("creditos = ", creditosData.data);
    } else {
      console.log("Error: ", creditosData.response.data.message);
    }
  };
  const AbrirDetalle = async (Datos) => {
    console.log("Detalle", Datos);
    setIdCredito(Datos.idcredito)
    console.log("IDCREDITO, ", Datos.idcredito)
    await fetchCredito(Datos.idcredito);
    abrirCerrarModalDetalle();
   
  }

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

    
  useEffect(() => {
    fetchCobradores();
  }, []);

  const ListarCuotas = () => {
    fetchRendicion(cobrador.value, token);
    fetchRendido(cobrador.value, token);
    console.log("ID", cobrador.value)
    console.log("Nombre", cobrador.label)
  }


 const PruebaAutocomplete = (valor) => {
  
  setTipoTransaccion(valor.label);
 }
  return <>
      <BoxGeneral texto="Rendición por Cobrador">
      <Box sx={{ mt: 2 }}>
      <Grid
            container
            spacing={2}
            sx={{ mt: 2, mb: 3 }}
            justifyContent="center"
          >
             <Grid item xs={12} sm= {8} md= {8}>
                 <Autocomplete
                 value={cobrador}
                 onChange={(event, newValue) => {
                   setCobrador(newValue);
                 }}
                 id="Cobradores"
                 options={cobradores}
                 sx={{ mt: 2 }}
                 renderInput={(params) => <TextField {...params} label="Cobradores" />}
           
              /*  id="Cobradores"
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
                )}*/
              />
             </Grid>
             <Grid item xs={12} sm= {4} md= {4}>
             <Tooltip arrow placement="left" title="Buscar">
             <Button sx={{ m: 1 }} onClick={() => ListarCuotas()}>
          <SearchIcon />
        </Button>
        </Tooltip>
                </Grid>
        </Grid>
     
        </Box>
    <Box sx={{ mt: 2 }}>
      
    <Alert sx={{ m: 2 }} severity="info">Total rendición = ${formatearNumero(total)} </Alert>
    <Alert sx={{ m: 2 }} severity="success">Total rendido = ${formatearNumero(totalRendido)} </Alert>
          <MaterialReactTable data={rendiciones} columns={columns} />
          <Modals
            modalabrir={modalPago}
            titulo={
              "Registrar pago"}
            contenido={<>
           
         <TextField
                label="Monto a pagar"
                variant="outlined"
                fullWidth
                value={montoPago}
                onChange={(e) => setMontoPago(e.target.value)}
              />
                <Autocomplete
                 value={tipoTransaccion}
                 onChange={(event, newValue) => {
                  PruebaAutocomplete (newValue);
                 }}
                 id="transacciones"
                 options={transacciones}
                 sx={{ mt: 2 }}
                 renderInput={(params) => <TextField {...params} label="Tipo de Transacción" />}
           
              /*  id="Cobradores"
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
                )}*/
              />
               

              
              <TextField 
              sx={{mt: 2}}
                  label="Observaciones"
                  variant="outlined"
                  fullWidth
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
                <FormControlLabel control={<Checkbox
                value= {noContabiliza}
                onChange={(e) => setNoContabiliza(e.target.checked)}
                />} label="No Contabiliza" />
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
             <Modals
            modalabrir={modalDetalle}
            titulo={
              "Detalle Credito "+idCredito+""}
            contenido={<>
           
           <MaterialReactTable data={detalle} columns={columnsD} pageCount="25" />
            </>}
            botones={
              <>
                <Button
                  onClick={() => abrirCerrarModalDetalle()}
                  sx={{ pt: 4 }}
                >
                  Cerrar
                </Button>
                
              </>
            }
          />
        </Box>
    </BoxGeneral>
  </>;
};

export default Rendicion;
