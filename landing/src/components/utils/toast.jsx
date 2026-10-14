// src/components/Toast.jsx
import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const base =
    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1 px-4 py-2 rounded-xl shadow-lg text-white z-[9999] flex items-center gap-2 text-sm animate-fade-in";

  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-marca-500",
    warning: "bg-yellow-500 text-black",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  return (
    <div className={`${base} ${styles[type]}`}>
      {icons[type]} <span>{message}</span>
    </div>
  );
}