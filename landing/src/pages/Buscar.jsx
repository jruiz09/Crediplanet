import { useState, useEffect } from "react";
import axios from "axios";
import Toast from "../components/utils/toast";
import api from "../components/utils/api";
import { useAuth } from "../context/AuthContext";

export default function Buscar() {
  const [idCredito, setIdCredito] = useState("");
  const [dataCredito, setDataCredito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const { username } = useAuth();
  const { idcobrador } = useAuth();

  const apiMobile = api.urlAPI + "credito/mobile/";

  const [modalAbierto, setModalAbierto] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [tipoPago, setTipoPago] = useState("efectivo");
  const [observaciones, setObservaciones] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const mostrarToast = (message, type = "info") => {
    setToast({ visible: true, message, type });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude);
        setLongitud(position.coords.longitude);
      },
      (error) => {
        console.error("No se pudo obtener la ubicación:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const buscarCredito = async () => {
    if (!idCredito) return;
    setCargando(true);
    try {
      const res = await axios.get(`${apiMobile}${idCredito}/${idcobrador}`);
      if (res.data.length > 0) {
        setDataCredito(res.data[0]);
      } else {
        setDataCredito(null);
      }
    } catch (error) {
      console.error("Error al buscar crédito:", error);
      setDataCredito(null);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-4">
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}

      <h1 className="text-xl font-bold mb-4 text-center">Buscar Crédito</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Ingresá ID de Crédito"
          className="flex-1 p-2 border rounded"
          value={idCredito}
          onChange={(e) => setIdCredito(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
          onClick={buscarCredito}
        >
          Buscar
        </button>
      </div>

      {cargando && <p className="text-center text-gray-500">Buscando...</p>}

      {dataCredito && (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-md p-4 shadow-inner mb-6">
            <div className="text-xs text-blue-800 uppercase font-bold tracking-wide mb-1">
              Resumen del Crédito
            </div>
            <div className="text-sm text-gray-800">
              <div className="mb-1">
                <span className="font-semibold">Cliente:</span>{" "}
                {dataCredito.cliente}
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Crédito #{dataCredito.idcredito}</span>
                <span
                  className={`font-semibold ${
                    dataCredito.estado === "Pago Registrado"
                      ? "text-green-600"
                      : dataCredito.estado === "Pago Parcial"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {dataCredito.estado}
                </span>
              </div>
              <div className="text-sm mt-2 space-y-1">
                <div>
                  Monto Total:{" "}
                  <span className="font-medium">
                    ${dataCredito.montototal?.toLocaleString()}
                  </span>
                </div>
                <div>
                  Pagado:{" "}
                  <span className="font-medium">
                    ${dataCredito.monto?.toLocaleString()}
                  </span>
                </div>
                <div>
                  Restante:{" "}
                  <span className="font-bold text-blue-700">
                    $
                    {(
                      dataCredito.montototal - dataCredito.monto
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {dataCredito.creditosdetalles
              .filter((cuota) => cuota.estado !== "Pago Registrado")
              .map((cuota, index) => {
                const restante = cuota.monto - (cuota.montopago || 0);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
                  >
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Cuota #{cuota.cuota}</span>
                      <span
                        className={`font-medium ${
                          cuota.estado === "Pago Registrado"
                            ? "text-green-600"
                            : cuota.estado === "Pago Parcial"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {cuota.estado}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      <span className="block text-gray-500">
                        Fecha de pago:{" "}
                        {cuota.fechapago
                          ? new Date(
                              new Date(cuota.fechapago).getTime() +
                                3 * 60 * 60 * 1000
                            ).toLocaleDateString("es-AR")
                          : "Sin registrar"}
                      </span>
                      <span className="block">
                        Monto Total: ${cuota.monto.toLocaleString()}
                      </span>
                      <span className="block">
                        Pagado: ${cuota.montopago?.toLocaleString() || 0}
                      </span>
                      <span className="block font-bold text-blue-700">
                        Restante: ${restante.toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-full transition"
                      onClick={() => {
                        setCuotaSeleccionada(cuota);
                        setModalAbierto(true);
                      }}
                    >
                      💳 Pagar
                    </button>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {dataCredito === null && !cargando && (
        <p className="text-center text-red-500 mt-4">
          No se encontró el crédito
        </p>
      )}

      {modalAbierto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
          onClick={() => setModalAbierto(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Registrar Pago
            </h2>
            <p className="text-sm mb-1 text-gray-700">
              Cliente: <strong>{cuotaSeleccionada?.cliente}</strong>
            </p>
            <p className="text-sm mb-3 text-gray-500">
              Cuota #{cuotaSeleccionada?.cuota}
            </p>
            <input
              type="number"
              placeholder="Monto pagado"
              className="w-full border px-4 py-2 rounded mb-3 text-sm"
              value={montoPago}
              onChange={(e) => {
                const value = e.target.value;
                // Solo aceptar números enteros positivos (sin puntos ni comas)
                if (/^\d*$/.test(value)) {
                  setMontoPago(value);
                }
              }}
            />
            {/* Tipo de pago (antes era select) */}
<div className="flex gap-3 mb-3">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="tipoPago"
      value="efectivo"
      checked={tipoPago === "efectivo"}
      onChange={(e) => setTipoPago(e.target.value)}
      className="hidden"
    />
    <span
      className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition ${
        tipoPago === "efectivo" ? "bg-blue-600 border-blue-600" : "border-gray-400"
      }`}
    >
      {tipoPago === "efectivo" && (
        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
      )}
    </span>
    <span className="text-sm text-gray-700">Efectivo</span>
  </label>

  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="tipoPago"
      value="transferencia"
      checked={tipoPago === "transferencia"}
      onChange={(e) => setTipoPago(e.target.value)}
      className="hidden"
    />
    <span
      className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition ${
        tipoPago === "transferencia"
          ? "bg-green-600 border-green-600"
          : "border-gray-400"
      }`}
    >
      {tipoPago === "transferencia" && (
        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
      )}
    </span>
    <span className="text-sm text-gray-700">Transferencia</span>
  </label>
</div>

            <textarea
              placeholder="Observaciones"
              className="w-full border px-4 py-2 rounded mb-4 text-sm"
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => {
                  setModalAbierto(false);
                  setMontoPago("");
                  setTipoPago("efectivo");
                  setObservaciones("");
                }}
                className="w-1/2 mr-2 bg-gray-300 text-gray-800 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!montoPago || !tipoPago) {
                    mostrarToast(
                      "Por favor, completá el monto y el tipo de pago.",
                      "error"
                    );
                    return;
                  }

                  setIsSubmitting(true);

                  try {
                    const res = await fetch(
                      api.urlAPI +
                        "creditodetalle/pagocuotamobile/" +
                        cuotaSeleccionada.idcreditodetalle,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          montopago: parseFloat(montoPago),
                          tipotransaccion: tipoPago,
                          observaciones: observaciones.trim(),
                          usuario: username,
                          latitud,
                          longitud,
                        }),
                      }
                    );

                    const resultado = await res.json();

                    if (resultado.message === "Cuota paga") {
                      mostrarToast(
                        "✅ Pago registrado correctamente.",
                        "success"
                      );
                    } else if (
                      resultado.message === "Cuota paga de forma parcial"
                    ) {
                      mostrarToast(
                        "🟡 Pago parcial registrado correctamente.",
                        "success"
                      );
                    } else {
                      mostrarToast("❌ " + resultado.message, "error");
                    }

                    if (
                      resultado.message === "Cuota paga" ||
                      resultado.message === "Cuota paga de forma parcial"
                    ) {
                      setModalAbierto(false);
                      setMontoPago("");
                      setTipoPago("efectivo");
                      setObservaciones("");

                      await buscarCredito();
                      
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    mostrarToast(
                      "❌ Ocurrió un error al registrar el pago.",
                      "error"
                    );
                    setModalAbierto(false);
                    setMontoPago("");
                    setTipoPago("efectivo");
                    setObservaciones("");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className={`w-1/2 flex justify-center items-center gap-2 text-white py-2 rounded transition duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isSubmitting ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
