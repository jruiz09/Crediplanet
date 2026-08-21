import { NavLink } from "react-router-dom";
import { Home,  CreditCard, Search, ClipboardPen } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow border-t flex justify-around py-3 z-50">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
      >
        <Home size={20} />
        Inicio
      </NavLink>
         <NavLink
        to="/pendientes"
        end
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
      >
        <ClipboardPen size={20} />
        Atrasadas
      </NavLink>

      <NavLink
        to="/cuotas"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
      >
        <CreditCard size={20} />
        Cierre
      </NavLink>

      <NavLink
        to="/buscar"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
      >
        <Search size={20} />
        Busq. Crédito
      </NavLink>
    </nav>
  );
}
