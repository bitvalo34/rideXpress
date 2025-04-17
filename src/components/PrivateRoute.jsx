import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Envuelve una ruta que solo debe ser visible para usuarios autenticados.
 * Si no hay sesión, redirige a /login.
 */
export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}
