import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";

export default function RutaProtegida({ codigo, children }) {
  const { permisosCargados, tienePermisoPantalla } = useContext(UserContext);

  if (!permisosCargados) {
    return null;
  }

  if (!tienePermisoPantalla(codigo)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
