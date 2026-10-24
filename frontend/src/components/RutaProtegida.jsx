import { Navigate } from "react-router-dom";
import { haySesion, obtenerUsuario } from "../utils/session";

// Protege una página: sin sesión envía a /login; con "roles" también
// exige que el rol del usuario esté permitido (si no, vuelve al inicio).
function RutaProtegida({ children, roles }) {
  if (!haySesion()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(obtenerUsuario().rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;
