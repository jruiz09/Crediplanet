import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { navegationLinks } from "../../App";
import Bienvenida from "../../pages/Bienvenida";

export default function InicioRedirect() {
  const { permisosCargados, tienePermisoPantalla } = useContext(UserContext);

  if (!permisosCargados) {
    return null;
  }

  const primerLinkPermitido = navegationLinks.find(
    (link) => link.codigo && tienePermisoPantalla(link.codigo)
  );

  if (primerLinkPermitido) {
    return <Navigate to={primerLinkPermitido.path} replace />;
  }

  return <Bienvenida />;
}
