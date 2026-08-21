import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
  getResumenCreditos,
  getResumenCreditosDetalles,
  getResumenCreditosMensual,
} from "../services/Creditos";
import Deposit from "../components/utils/Dashboard/Deposit";
import CajasInforme from "../components/utils/CajasInforme";
import { formatearNumero } from "../components/utils/FormatearNumero";
import BoxGeneral from "../components/utils/BoxGeneral";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  Filler,
  LineElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import Modals from '../components/utils/Modal';
import { MaterialReactTable } from "material-react-table";

const data_inicio_bar = {
  labels: ["Sin resultados"],
  datasets: [
    {
      label: "Ganancia Neta",
      data: [0],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const InformeCreditos = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [creditos, setCreditos] = useState([]);
  const [creditosDetalles, setCreditosDetalles] = useState([]);
  const [creditosMes, setCreditosMes] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [cuotas, setCuotas] = useState("");
  const [importeCredito, setImporteCredito] = useState("");
  const [importeTotal, setImporteTotal] = useState("");

  const [dataBar, setDataBar] = useState(data_inicio_bar);
  const [dataBar2, setDataBar2] = useState(data_inicio_bar);
  const [modalDetalle, setModalDetalle] = useState(false)

  const abrirCerrarModalDetalle = () => {
    setModalDetalle(!modalDetalle);
    
  };

  
  const  verDetalle = async () => {
   
        abrirCerrarModalDetalle();
 
  }


  const fetchCreditos = async () => {
    const creditosData = await getResumenCreditos(token);
    if (creditosData.status === 200) {
      setCreditos(creditosData.data);
      setCantidad(creditosData.data.map((data) => data.cantidad));
      setCuotas(creditosData.data.map((data) => data.cantidadcuotas));
      setImporteCredito(creditosData.data.map((data) => data.importecredito));
      setImporteTotal(creditosData.data.map((data) => data.importetotal));
      console.log("creditos = ", creditosData.data);
    } else {
      console.log("Error: ", creditosData.response.data.message);
    }
  };

  const fetchCreditosResumenDetalles = async () => {
    const creditosData = await getResumenCreditosDetalles(token);
    
    if (creditosData.status === 200) {
      console.log("creditos = ", creditosData.data);
      setCreditosDetalles(creditosData.data);
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
        accessorKey: "cantidadcuotas",
        header: "Cant. Cuotas",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
      },
      {
        accessorKey: "importecredito",
        header: "Inversión",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.monto)}</div>,
      },
      {
        accessorKey: "importetotal",
        header: "Ganancia Bruta",
        size: 10,
        muiTableHeadCellProps: {
            sx: { backgroundColor: "#922b3e", color: "white" },
          },
        Cell: ({ row }) => <div>${formatearNumero(row.original.montototal)}</div>,
      }
    ],
    []
  );
  const optionsBar = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const fetchCreditosxMes = async () => {
    const creditosData = await getResumenCreditosMensual(token);
    if (creditosData.status === 200) {
      setCreditosMes(creditosData.data);
      let creditoscerrados = creditosData.data.filter(
        (dato) => dato.estado === "Finalizado"
      );

      let modeloBar = {
        labels: creditoscerrados.map((data) => data.anomes),
        datasets: [
          {
            label: "Inversión",
            data: creditoscerrados.map((data) => data.importecredito),
            backgroundColor: "#a11c55",
            borderColor: "#fafbfd",
          },
          {
            label: "Ganancia Neta",
            data: creditoscerrados.map((data) => data.ganancia),
            backgroundColor: "#c5899a",
            borderColor: "#fafbfd",
          },
        ],
      };
      setDataBar(modeloBar);

      let modeloBar2 = {
        labels: creditoscerrados.map((data) => data.anomes),
        datasets: [
          {
            label: "Cantidad créditos finalizados por mes",
            data: creditoscerrados.map((data) => data.cantidad),
            backgroundColor: "#922b3e",
            borderColor: "#922b3e",
          },
        ],
      };
      setDataBar2(modeloBar2);
      console.log("creditos MES = ", creditosData.data);
    } else {
      console.log("Error: ", creditosData.response.data.message);
    }
  };

  useEffect(() => {
    fetchCreditos();
    fetchCreditosxMes();
    fetchCreditosResumenDetalles();
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
          Créditos en proceso
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
              <Deposit
                texto="Q créditos en curso"
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
              <Deposit texto="Q cuotas" cantidad={cuotas} color={"#9e9e9e"} />
            </Grid>
            <Grid
              sx={{ p: 2, align: "center", justifyContent: "center" }}
              item
              sm={3}
              xs={12}
            >
              <Deposit
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
              <Deposit
                texto="Ganancia Bruta"
                cantidad={`$ ${formatearNumero(importeTotal)}`}
                color={"#9e9e9e"}
              />
            </Grid>
          </Grid>

          {/* Aquí puedes añadir más componentes o funcionalidad según sea necesario */}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined"  onClick={() => verDetalle()}>Detalle</Button>
        </Box>
        <Modals
            modalabrir={modalDetalle}
            titulo={
              "Detalle Creditos en proceso"}
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
          Créditos finalizados
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            mb: 4,
          }}
        >
          <Bar options={optionsBar} data={dataBar} />
        </Box>
      </Box>

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
          Q Créditos finalizados por mes
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            mb: 4,
          }}
        >
          <Bar options={optionsBar} data={dataBar2} />
        </Box>
      </Box>
    </>
  );
};

export default InformeCreditos;
