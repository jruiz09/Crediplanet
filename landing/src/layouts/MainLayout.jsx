import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import { LogOut } from "lucide-react";

export default function MainLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">CrediPlanet Mobile</h1>
        <button
          onClick={logout}
          className="hover:bg-blue-500 p-2 rounded-full transition"
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
