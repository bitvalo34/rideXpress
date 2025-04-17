import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();                       // para ocultar links

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /** está en auth pages si la ruta empieza por /login o /register */
  const inAuthPage = /^\/(login|register)/.test(pathname);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-blue shadow">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center"
          to={currentUser ? "/home" : "/login"}
        >
          <img src="public/assets/logochico.png" className="navbar-logo" />
          <span className="ms-2 fw-semibold">RideXpress</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* ---------- Links (ocultos en login / register) ---------- */}
        {currentUser && !inAuthPage && (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/my-trips">
                  Mis Viajes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">
                  Historial
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Perfil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/support">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* ---------- Sesión ---------- */}
        {currentUser ? (
          <button
            className="btn btn-light d-flex align-items-center fw-semibold"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            {currentUser.displayName || currentUser.email.split("@")[0]}
          </button>
        ) : (
          <Link
            to="/login"
            className="btn btn-outline-light d-flex align-items-center fw-semibold"
          >
            <FaSignInAlt className="me-2" />
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

