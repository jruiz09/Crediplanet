import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import { LogOut } from "lucide-react";
import { marca } from "../config/marca";

export default function MainLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <header className="bg-marca-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">{marca.nombre}</h1>
        <button
          onClick={logout}
          className="hover:bg-marca-500 p-2 rounded-full transition"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </header>

      <main className="p-4">{children}</main>

      <BottomNav />
    </div>
  );
}
