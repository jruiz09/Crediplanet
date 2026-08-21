import React, { useEffect, useMemo, useState } from 'react'
import BoxGeneral from '../components/utils/BoxGeneral'
import { useNavigate } from "react-router-dom";
import { getClientesMorosos } from '../services/Clientes';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { MaterialReactTable } from "material-react-table";
import { formatearNumero } from '../components/utils/FormatearNumero';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { getResumen } from '../services/Creditos';
import Modals from '../components/utils/Modal';
import { postCuota } from '../services/CreditoDetalles';
import Swal from "sweetalert2/dist/sweetalert2.js";


const ClientesMorosos = () => {
    
  const [modalDetalle, setModalDetalle] = useState(false)
    const [token, setToken] = useState(localStorage.getItem("user-token"));
    const [user, setUser] = useState(localStorage.getItem("usuario"))
    const [morosos, setMorosos] = useState([]);
    const navigate = useNavigate();
    const [idCredito, setIdCredito] = useState("");
    const [clientes, setClientes] = useState([])
    const abrirCerrarModalDetalle = () => {
        setModalDetalle(!modalDetalle);
        
      };
    

    const fetchClientes = async () => {
        const clientesData = await getClientesMorosos(token);
        if (clientesData.status === 200) {
            
          setMorosos(clientesData.data.sort((a, b) => (a.cantcuotas < b.cantcuotas) ? 1 : -1));
          console.log("clientes = ", clientesData.data);
      
        } else {
          console.log("Error: ", clientesData.response.data.message);
        }
      };

      
  useEffect(() => {
    fetchClientes();
  }, []);

  const  generarCuota = (cell) => {
    console.log(cell)

    let idcredito = cell.row.original.credito

  
  
    Swal.fire({
      title: "Deseas adicionar una cuota al credito "+idcredito+"?",
      showDenyButton: true,
      confirmButtonText: "Si, generar nueva cuota",
      denyButtonText: `No, cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {          
        nuevaCuota(idcredito)
        
      } else if (result.isDenied) {
        Swal.fire("La operación fue cancelada", "", "info");
      }
    })
    

  }

  const nuevaCuota = async (IDCREDITO) => {

    const post = {
      idcredito : IDCREDITO,
      usuarioalta: user
    }

    const cuotaPost =  await postCuota(post, token);
    console.log("cuotaPost, ", cuotaPost)
    if (cuotaPost.status === 200) {
      Swal.fire(cuotaPost.data.message, "", "success");
      await fetchClientes()
    } else {
      Swal.fire("Error : " + cuotaPost.response.data.message, "", "error");
    }
  }
  

  const  visualizarCredito = async (cell) => {
   
    let idcredito = cell.row.original.credito
    setIdCredito(idcredito)

    const resumenData = await getResumen(idcredito, token)
    if (resumenData.status === 200) {
    
        setClientes(resumenData.data)
        console.log("clientes = ", resumenData.data);
        abrirCerrarModalDetalle();
      } else {
        console.log("Error: ", resumenData.response.data.message);
      }
  }

  const columnsResumen = useMemo(
    () => [
        
      {
        accessorKey: "cuotas",
        header: "Cant Cuotas",
        size: 150,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "cuotaspagas",
        header: "Pagas",
        size: 150,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "cuotaspendientes",
        header: "Pendientes",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "cuotasextras",
        header: "Cuotas Extra",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "monto",
        header: "Monto Total",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.monto)}</div>,
      },
      {
        accessorKey: "montopago",
        header: "Parcial Pago",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.montopago)}</div>,
      },
    ],
    []
  );
  const columns = useMemo(
    () => [
        {
            accessorKey: "credito",
            header: "Acciones",
            size: 150,
            muiTableHeadCellProps: {
                sx: { backgroundColor: "#922b3e", color: "white" },
              },
              Cell: ({ cell }) => (
              
                    <>
                      <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Tooltip arrow placement="left" title="Generar cuota extra">
                          <IconButton
                            onClick={() => generarCuota(cell)}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                        
                <Tooltip arrow placement="right" title="Ver Crédito">
                  <IconButton onClick={() => visualizarCredito(cell)}>
                    <WysiwygIcon />
                  </IconButton>
                </Tooltip>
                      </Box>
                 
              </>
              )
          },
      {
        accessorKey: "cliente",
        header: "Cliente",
        size: 150,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "credito",
        header: "N° Crédito",
        size: 150,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "cantcuotas",
        header: "Cuotas",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      
      {
        accessorKey: "monto",
        header: "Deuda",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.monto)}</div>,
      },
    ],
    []
  );
  return (

    <>
    <BoxGeneral texto="Clientes Morosos">
    <Box>
           
              <MaterialReactTable data={morosos} columns={columns} />
              <Modals
            modalabrir={modalDetalle}
            titulo={
              "Resumen Credito "+idCredito+""}
            contenido={<>
          <MaterialReactTable data={clientes} columns={columnsResumen} />
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
      
    </>
  )
}

export default ClientesMorosos
