import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Deposits from "../components/utils/Dashboard/Deposit";
import { getCreditosSemanales, getCreditosSemanalesDetalles } from "../services/Creditos";
import { formatearNumero } from "../components/utils/FormatearNumero";
import Modals from '../components/utils/Modal';
import { MaterialReactTable } from "material-react-table";

const InformeCreditosSemanal = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [creditos, setCreditos] = useState([]);
  const [creditosDetalles, setCreditosDetalles] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [ganancia, setGanancia] = useState("");
  const [importeCredito, setImporteCredito] = useState("");
  const [importeTotal, setImporteTotal] = useState("");
  const [modalDetalle, setModalDetalle] = useState(false)

  const abrirCerrarModalDetalle = () => {
    setModalDetalle(!modalDetalle);
    
  };

  
  const  verDetalle = async () => {
   
        abrirCerrarModalDetalle();
 
  }

  const fetchCreditos = async () => {
    const creditosData = await getCreditosSemanales(token);
    if (creditosData.status === 200) {
      setCreditos(creditosData.data);
      setCantidad(creditosData.data.map((data) => data.cantidad));
      setImporteCredito(creditosData.data.map((data) => data.importecredito));
      setImporteTotal(creditosData.data.map((data) => data.importetotal));
      setGanancia(creditosData.data.map((data) => data.ganancias));
      console.log("creditos = ", creditosData.data);
    } else {
      console.log("Error: ", creditosData.response.data.message);
    }
  };

  const fetchCreditosDetalles = async () => {
    const creditosData = await getCreditosSemanalesDetalles(token);
    if (creditosData.status === 200) {
      setCreditosDetalles(creditosData.data);
      console.log("creditos detalles = ", creditosData.data);
    } else {
      console.log("Error: ", creditosData.response.data.message);
    }
  };

  const columnsDetalle = useMemo(
    () => [
      {
        accessorKey: "idcredito",
        header: "Credito",
        size: 150,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "dias",
        header: "Cant Cuotas",
        size: 150,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
   
      {
        accessorKey: "cliente",
        header: "Cliente",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "cobrador",
        header: "Cobrador",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "interes",
        header: "Interes",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>{row.original.interes}%</div>,
      },
      {
        accessorKey: "monto",
        header: "Inversión",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.monto)}</div>,
      },
      {
        accessorKey: "montototal",
        header: "Ganancia Bruta",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.montototal)}</div>,
      },
      {
        accessorKey: "ganancia",
        header: "Ganancia Neta",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.ganancia)}</div>,
      },
    ],
    []
  );


  useEffect(() => {
    fetchCreditos();
    fetchCreditosDetalles();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 4,
          mt: 1,
        }}
      >
        <Typography
          variant="h5"
          color="#922b3e"
          fon
          pb={1}
          mb={2}
          style={{
            color: "#922b3e",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          {" "}
          Créditos de esta semana
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            mb: 4,
          }}
        >
          <Grid container justifyContent="center">
            <Grid
              sx={{ p: 2, align: "center", justifyContent: "center" }}
              item
              sm={3}
              xs={12}
            >
              <Deposits
                texto="Q créditos"
                cantidad={cantidad}
                color={"#9e9e9e"}
              />
            </Grid>

            <Grid
              sx={{ p: 2, align: "center", justifyContent: "center" }}
              item
              sm={3}
              xs={12}
            >
              <Deposits
                texto="Inversión"
                cantidad={`$ ${formatearNumero(importeCredito)}`}
                color={"#9e9e9e"}
              />
            </Grid>
            <Grid
              sx={{ p: 2, align: "center", justifyContent: "center" }}
              item
              sm={3}
              xs={12}
            >
              <Deposits
                texto="Ganancia Bruta"
                cantidad={`$ ${formatearNumero(importeTotal)}`}
                color={"#9e9e9e"}
              />
            </Grid>
            <Grid
              sx={{ p: 2, align: "center", justifyContent: "center" }}
              item
              sm={3}
              xs={12}
            >
              <Deposits
                texto="Ganancia Neta"
                cantidad={`$ ${formatearNumero(ganancia)}`}
                color={"#9e9e9e"}
              />
            </Grid>
          </Grid>

          {/* Aquí puedes añadir más componentes o funcionalidad según sea necesario */}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={() => verDetalle()}>Detalle</Button>
        </Box>
        <Modals
            modalabrir={modalDetalle}
            titulo={
              "Detalle Creditos de esta semana"}
            contenido={<>
          <MaterialReactTable data={creditosDetalles} columns={columnsDetalle} />
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
    </>
  );
};

export default InformeCreditosSemanal;
