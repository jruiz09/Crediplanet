import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../components/utils/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

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


export default function Chart() {
  const userToken = localStorage.getItem("user-token");
  const UrlVehiculos = api.urlAPI + "vehiculo";

  const optionsBar = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  const [dataBar, setDataBar] = useState(data_inicio_bar)
  const [vehiculos, setVehiculos] = useState([]);

  const ListarVehiculos = async () => {
    const headers = { "m3-token": userToken };
    console.log(headers);
    let res = await fetch(UrlVehiculos, { headers });
    let data = await res.json();
    setVehiculos(data);
    console.log(data);
  };

 
  const fetchDataBarra = async() => {
    
    const headers = { "m3-token": userToken };
    let resp = await fetch(UrlVehiculos, { headers })
    let dataBarra = await resp.json()

  let modeloBar = {
    labels: dataBarra.map((data) => data.Estado),
    datasets: [
      {
        label: 'Ganancia Neta por mes',
        data: dataBarra.map((data) => data.id),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ]
  };
  setDataBar(modeloBar)

  }


  useEffect(() => {
    ListarVehiculos()
    fetchDataBarra()
  }, [])

  return (
    <>

    </>
  );
}
