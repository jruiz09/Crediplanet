import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { FileDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../components/utils/api"
import * as XLSX from "xlsx-js-style";


export default function Cierre() {
  const [notificaciones, setNotificaciones] = useState([]);
  const { idcobrador, username } = useAuth();
  const UrlMobileNotify = api.urlAPI + "credito/mobilecierre/"+username;

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await axios.get(UrlMobileNotify);
        setNotificaciones(res.data);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, []);


  /*
const exportarExcel = () => {
  const data = notificaciones.map((n) => ({
    "Cliente" : n.cliente,
    "ID Crédito": n.idcredito,
    Estado: n.estado,
    Cuota: n.cuota,
    "Monto Total": n.monto,
    "Monto Pagado": n.montopago,
    "Tipo de Pago": n.tipotransaccion,
    Observaciones: n.observaciones,
    Cobrador: n.cobrador,
    Fecha: format(new Date(), "dd/MM/yyyy HH:mm"), // Podés reemplazar con fecha real si tenés una
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cierre del Día");
  XLSX.writeFile(workbook, `cierredeldia-${username}-${format(new Date(), "yyyyMMdd")}.xlsx`);
};

*/


  const exportarExcel = async () => {
    try {
      // --- Datos de cierre ---
      const data = notificaciones.map((n) => ({
        Cliente: n.cliente,
        "ID Crédito": n.idcredito,
        Estado: n.estado,
        Cuota: n.cuota,
        "Monto Total": n.monto,
        "Monto Pagado": n.montopago,
        "Tipo de Pago": n.tipotransaccion,
        Observaciones: n.observaciones,
        Cobrador: n.cobrador,
        Fecha: format(new Date(), "dd/MM/yyyy HH:mm"),
      }));

      const totalEfectivo = notificaciones
        .filter((n) => n.tipotransaccion?.toLowerCase() === "efectivo")
        .reduce((acc, n) => acc + (n.montopago || 0), 0);

      const totalTransferencia = notificaciones
        .filter((n) => n.tipotransaccion?.toLowerCase() === "transferencia")
        .reduce((acc, n) => acc + (n.montopago || 0), 0);

      // --- Cuotas pendientes ---
      const cuotasPendientesUrl =
        api.urlAPI + `credito/mobilecuotas/${idcobrador}`;
      const resCuotas = await axios.get(cuotasPendientesUrl);

      const dataCuotas = resCuotas.data.map((c) => ({
        Cliente: c.cliente,
        "ID Crédito": c.idcredito,
        Cuota: c.cuota,
        "Monto Total": c.monto,
        "Monto Pagado": c.montopago,
        Estado: c.estado,
      }));

      // --- Cuotas atrasadas ---
      const cuotasAtrasadasUrl =
        api.urlAPI + `credito/mobilecuotaspendientes/${idcobrador}`;
      const resAtrasadas = await axios.get(cuotasAtrasadasUrl);

      const dataAtrasadas = resAtrasadas.data
  .sort((a, b) => {
    // Las que no tienen fecha van al final
    if (!a.fechapago) return 1;
    if (!b.fechapago) return -1;
    return new Date(a.fechapago) - new Date(b.fechapago);
  })
  .map((c) => ({
    Cliente: c.cliente,
    "ID Crédito": c.idcredito,
    Cuota: c.cuota,
    "Monto Total": c.monto,
    "Monto Pagado": c.montopago,
    Estado: c.estado,
    "Fecha de Pago": c.fechapago
      ? format(parseISO(c.fechapago), "dd/MM/yyyy")
      : "Sin pago",
  }));

      // --- Construcción manual con estilos ---
      const rows = [];

      // Encabezado de pagos
      if (data.length > 0) {
        rows.push(
          Object.keys(data[0]).map((h) => ({
            v: h,
            s: {
              fill: { fgColor: { rgb: "1976D2" } },
              font: { bold: true, color: { rgb: "FFFFFF" } },
              alignment: { horizontal: "center" },
            },
          }))
        );

        data.forEach((row) => {
          rows.push(Object.values(row).map((val) => ({ v: val })));
        });

        rows.push([]);
      }

      // Totales
      rows.push([
        {
          v: "TOTAL EFECTIVO",
          s: {
            fill: { fgColor: { rgb: "4CAF50" } },
            font: { bold: true, color: { rgb: "FFFFFF" } },
          },
        },
        { v: totalEfectivo, s: { font: { bold: true } } },
      ]);

      rows.push([
        {
          v: "TOTAL TRANSFERENCIA",
          s: {
            fill: { fgColor: { rgb: "4CAF50" } },
            font: { bold: true, color: { rgb: "FFFFFF" } },
          },
        },
        { v: totalTransferencia, s: { font: { bold: true } } },
      ]);

      rows.push([]);

      // --- Cuotas pendientes ---
      if (dataCuotas.length > 0) {
        rows.push([
          {
            v: "CUOTAS PENDIENTES",
            s: {
              fill: { fgColor: { rgb: "FFC107" } },
              font: { bold: true },
            },
          },
        ]);

        rows.push(
          Object.keys(dataCuotas[0]).map((h) => ({
            v: h,
            s: {
              fill: { fgColor: { rgb: "FFE082" } },
              font: { bold: true },
            },
          }))
        );

        dataCuotas.forEach((row) => {
          rows.push(
            Object.values(row).map((val) => ({
              v: val,
              s: { fill: { fgColor: { rgb: "FFF9C4" } } },
            }))
          );
        });
      }

      rows.push([]);

      // --- CUOTAS ATRASADAS (ROJIZO) ---
      if (dataAtrasadas.length > 0) {
        rows.push([
          {
            v: "CUOTAS ATRASADAS",
            s: {
              fill: { fgColor: { rgb: "B71C1C" } },
              font: { bold: true, color: { rgb: "FFFFFF" } },
            },
          },
        ]);

        rows.push(
          Object.keys(dataAtrasadas[0]).map((h) => ({
            v: h,
            s: {
              fill: { fgColor: { rgb: "EF5350" } },
              font: { bold: true, color: { rgb: "FFFFFF" } },
            },
          }))
        );

        dataAtrasadas.forEach((row) => {
          rows.push(
            Object.values(row).map((val) => ({
              v: val,
              s: { fill: { fgColor: { rgb: "FFEBEE" } } },
            }))
          );
        });
      }

      const sheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, "Cierre del Día");

      XLSX.writeFile(
        workbook,
        `cierredeldia-${username}-${format(new Date(), "yyyyMMdd")}.xlsx`
      );
    } catch (error) {
      console.error("Error exportando Excel:", error);
    }
  };



  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cierre</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={exportarExcel}
          className="flex items-center gap-2 bg-marca-600 text-white px-4 py-2 rounded shadow hover:bg-marca-700"
        >
          <FileDown size={18} />
          Exportar Excel
        </button>
      </div>

      {notificaciones.length === 0 ? (
  <p className="text-gray-500 text-sm">No hay pagos registrados hoy.</p>
) : (
  <ul className="space-y-2">
    {notificaciones.map((n, index) => (
  <li
    key={index}
    className="bg-white shadow rounded p-3 text-sm text-gray-700"
  >
    <div className="flex justify-between">
      <span className="font-medium">Crédito #{n.idcredito}</span>
      <span className="text-xs text-gray-500">{n.estado}</span>
    </div>
    
    {/* Cliente destacado */}
    <div className="text-xs font-semibold text-marca-600">
      Cliente: {n.cliente}
    </div>

    <div className="text-xs text-gray-600">
      Cuota {n.cuota} - Pagado ${n.montopago} - {n.tipotransaccion}
    </div>

    {n.observaciones && (
      <div className="text-xs text-gray-500 italic">
        {n.observaciones}
      </div>
    )}
    
    <div className="text-xs text-gray-400">Cobrador: {n.cobrador}</div>
  </li>
))}

  </ul>
)}

    </div>
  );
}
