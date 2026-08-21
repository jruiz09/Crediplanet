import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
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
import { getGastosResumen } from "../services/Gastos";

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

const InformeGastos = () => {
    const [token, setToken] = useState(localStorage.getItem("user-token"));
    const [gastos, setGastos] = useState([]);
    const [importeTotal, setImporteTotal] = useState("");
    const [dataBar, setDataBar] = useState(data_inicio_bar);

    const optionsBar = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      };

    const fetchGastosxMes = async () => {
        const gastosData = await getGastosResumen(token);
        if (gastosData.status === 200) {
          setGastos(gastosData.data);
 
    
          let modeloBar = {
            labels: gastosData.data.map((data) => data.anomes),
            datasets: [
              {
                label: "Total Gastos",
                data: gastosData.data.map((data) => data.importe),
                backgroundColor: "#a11c55",
                borderColor: "#fafbfd",
              }
            ],
          };
          setDataBar(modeloBar);
          
          const total = gastosData.data.reduce((acc, row) => acc + row.importe, 0);
          setImporteTotal(total)
          console.log("Gastos MES = ", gastosData.data);
        } else {
          console.log("Error: ", gastosData.response.data.message);
        }

      };
      useEffect(() => {
        fetchGastosxMes();
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
         Gastos por mes
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            mb: 4,
          }}
        >

         
         <Bar options={optionsBar} data={dataBar} />
            
        </Box>
      </Box>
    </>
  )
}

export default InformeGastos