import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import api from "../components/utils/api";
import Toast from "../components/utils/toast";

export default function Dashboard() {
  const { username } = useAuth();
  const { idcobrador } = useAuth();
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [tipoPago, setTipoPago] = useState("efectivo");
  const [observaciones, setObservaciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiLogin = api.urlAPI + "credito/mobilecuotas/" + idcobrador;

  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const res = await fetch(apiLogin);
        const data = await res.json();
        setCuotas(data);
        console.log("cuotas", data);
      } catch (err) {
        console.error("Error al cargar cuotas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCuotas();
  }, []);

  const totalCuotas = cuotas.length;

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const mostrarToast = (message, type = "info") => {
    setToast({ visible: true, message, type });
  };

  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
      <h1 className="text-xl font-bold text-gray-800 mb-3">Resumen del Día</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow p-4 mb-5 text-center">
            <h2 className="text-md font-semibold text-gray-700">
              Cuotas a cobrar hoy
            </h2>
            <p className="text-3xl font-bold text-blue-600">{totalCuotas}</p>
          </div>
          <input
            type="text"
            placeholder="🔍 Buscar cliente..."
            className="w-full p-2 mb-4 border border-gray-300 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value.toLowerCase())}
          />

          <div className="space-y-3">
            {cuotas
              .filter(
                (cuota) =>
                  cuota.cliente.toLowerCase().includes(busqueda) ||
                  cuota.idcredito.toString().includes(busqueda)
              )
              .map((cuota, index) => {
                const montoRestante = cuota.monto - cuota.montopago;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
                  >
                    <div className="text-xs text-gray-500">Cliente:</div>
                    <div className="text-sm font-semibold text-gray-800 capitalize">
                      {cuota.cliente}
                    </div>

                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Crédito #{cuota.idcredito}</span>
                      <span>Cuota {cuota.cuota}</span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Estado:</span>
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
                      <span className="block">
                        Monto Total: ${cuota.monto.toLocaleString()}
                      </span>
                      <span className="block">
                        Pagado: ${cuota.montopago.toLocaleString()}
                      </span>
                      <span className="block font-bold text-blue-700">
                        Restante: ${montoRestante.toLocaleString()}
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

      {modalAbierto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
          onClick={() => setModalAbierto(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl transform transition-all duration-200 scale-100"
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
                    tipoPago === "efectivo"
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-400"
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

                      const refreshed = await fetch(apiLogin);
                      const data = await refreshed.json();
                      setCuotas(data);
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
