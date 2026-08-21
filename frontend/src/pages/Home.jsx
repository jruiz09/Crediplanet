import { Box, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Deposits from "../components/utils/Deposits";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import PaidIcon from "@mui/icons-material/Paid";
import CalculateIcon from "@mui/icons-material/Calculate";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useNavigate } from "react-router-dom";
import Titles from "../components/utils/Title";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DashboardIcon from '@mui/icons-material/Dashboard';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { MaterialReactTable } from "material-react-table";
import { formatearNumero } from "../components/utils/FormatearNumero";
import { getClientesMorosos } from "../services/Clientes";
import { getCajaResumen } from "../services/Caja";
import AddchartIcon from '@mui/icons-material/Addchart';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const data_inicio_donut = {
  type: "pie",
  labels: ["Sin resultados"],
  datasets: [
    {
      data: [0],
      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ],
};

const Home = () => {
  const [usuario, setUsuario] = useState(localStorage.getItem("usuario"));
  const [rol, setRol] = useState(localStorage.getItem("rol"));
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [morosos, setMorosos] = useState([]);
  const navigate = useNavigate();

  const [dataDonut, setDataDonut] = useState(data_inicio_donut);

  const [montoEfectivo, setMontoEfectivo] = useState("");
  const [montoTransferencia, setMontoTransferencia] = useState("");
  const [tipoEfectivo, setTipoEfectivo] = useState("");
  const [tipoTransferencia, setTipoTransferencia] = useState("");

  const fetchClientes = async () => {
    const clientesData = await getClientesMorosos(token);
    if (clientesData.status === 200) {
      setMorosos(clientesData.data);
      console.log("clientes = ", clientesData.data);
      let modeloDonut = {
        type: "outlabeledPie",
        labels: clientesData.data.map((rec) => rec.cliente),
        datasets: [
          {
            data: clientesData.data.map((rec) => rec.cantcuotas),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      setDataDonut(modeloDonut);
    } else {
      console.log("Error: ", clientesData.response.data.message);
    }
  };

  const fetchCajaEfv = async () => {
    const cajaData = await getCajaResumen(token);
    if (cajaData.status === 200) {
      let cajaEfectivo = cajaData.data.filter(
        (dato) => dato.tipo === "Efectivo"
      );
      let cajaTransferencia = cajaData.data.filter(
        (dato) => dato.tipo === "Transferencia"
      );
      console.log("Efectvio = ", cajaEfectivo);
      console.log("Transfer = ", cajaTransferencia);
      setMontoEfectivo(cajaEfectivo.map((data) => data.monto));
      setTipoEfectivo(cajaEfectivo.map((data) => data.tipo));
      setMontoTransferencia(cajaTransferencia.map((data) => data.monto));
      setTipoTransferencia(cajaTransferencia.map((data) => data.tipo));
    } else {
      console.log("Error: ", cajaData.response.data.message);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchCajaEfv();
  }, []);

  const optionsBar = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "cliente",
        header: "Cliente",
        size: 150,
      },
      {
        accessorKey: "credito",
        header: "N° Crédito",
        size: 150,
      },
      {
        accessorKey: "cantcuotas",
        header: "Cuotas",
        size: 10,
      },
      {
        accessorKey: "monto",
        header: "Deuda",
        size: 10,
        Cell: ({ row }) => <div>${formatearNumero(row.original.monto)}</div>,
      },
    ],
    []
  );

  return (
    <div>
      <Container fixed maxWidth="sx" sx={{ boxShadow: 3, pb: 2, pt: 2, mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <PermIdentityIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Clientes"
              tooltip="Clientes"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <TransferWithinAStationIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Cobradores"
              tooltip="Cobradores"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <AttachMoneyIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Creditos"
              tooltip="Créditos"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <PaidIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Rendicion"
              tooltip="Rendicion"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <AccountBalanceIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Caja"
              tooltip="Caja"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <CalculateIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Productividad"
              tooltip="Productividad"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <ConfirmationNumberIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Vale"
              tooltip="Vale"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <RequestQuoteIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="PagoCobradores"
              tooltip="Pago Cobradores"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <MoneyOffIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="ClientesMorosos"
              tooltip="Clientes Morosos"
            />
          </Grid>
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            sm={1}
            xs={12}
          >
            <Deposits
              imagen={
                <AddchartIcon
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                />
              }
              color="#922b3e"
              path="Gastos"
              tooltip="Gastos"
            />
          </Grid>
       
        </Grid>
      </Container>
      <Container
        fixed
        maxWidth="sx"
        alignItems="center"
        sx={{ boxShadow: 3, pb: 2, pt: 2 }}
      >
        <Grid container justifyContent="center">
          <Grid
            sx={{ p: 2, align: "center", justifyContent: "center" }}
            item
            xs={12}
            sm={6}
            md={6}
          >
            <Box
              sx={{
                boxShadow: 2,
                p: 2,
                align: "center",
                justifyContent: "center",
              }}
            >
              <Titles sx={{ align: "center", justifyContent: "center" }}>
                {tipoEfectivo}
              </Titles>
              <Typography
                sx={{
                  align: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  color: "black",
                }}
                component="p"
                variant="h4"
              >
                {formatearNumero(montoEfectivo)}
              </Typography>
            </Box>
            <Box
              sx={{
                boxShadow: 2,
                mt: 3,
                p: 2,
                align: "center",
                justifyContent: "center",
                
              }}
            >
              <Titles sx={{ align: "center", justifyContent: "center" }}>
                {tipoTransferencia}
              </Titles>
              <Typography
                sx={{
                  align: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "black",
                }}
                component="p"
                variant="h4"
              >
                {formatearNumero(montoTransferencia)}
              </Typography>
            </Box>
          </Grid>
          <Grid
            sx={{
              p: 2,
              align: "center",
              justifyContent: "center",
              maxHeight: "50%",
              maxWidht: "50%",
            }}
            item
            xs={12}
            sm={6}
            md={6}
          >
            <Box>
              {" "}
              <Typography variant="h6" align="center" pb={1}>
                Detalle Clientes Morosos
              </Typography>
              <MaterialReactTable data={morosos} columns={columns} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
