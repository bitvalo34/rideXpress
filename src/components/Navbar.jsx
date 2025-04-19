// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import "../styles/Navbar.css";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { items, markAllRead }  = useNotifications();        // 🔔
  const unread = items.filter((n) => !n.read).length;

  const navigate      = useNavigate();
  const { pathname }  = useLocation();
  const [open, setOpen] = useState(false);

  const inAuthPage = /^\/(login|register)/.test(pathname);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* ---------- Render ---------- */
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-blue shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center"
              to={currentUser ? "/home" : "/login"}>
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

        {/* ---------- links ---------- */}
        {currentUser && !inAuthPage && (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {[
                ["Inicio", "/home"],
                ["Mis Viajes", "/my-trips"],
                ["Historial", "/history"],
                ["Perfil", "/profile"],
                ["Soporte", "/support"],
              ].map(([txt, url]) => (
                <li key={url} className="nav-item">
                  <Link className="nav-link" to={url}>
                    {txt}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------- Icono notificaciones / sesión ---------- */}
        <div className="d-flex align-items-center gap-3">
          {currentUser && !inAuthPage && (
            <div className="dropdown">
              <button
                className="btn btn-light position-relative"
                onClick={() => {
                  setOpen(!open);
                  if (unread) markAllRead();
                }}
              >
                <FaBell />
                {unread > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unread}
                  </span>
                )}
              </button>

              {/* menú dropdown */}
              {open && (
                <div
                  className="dropdown-menu dropdown-menu-end show p-2"
                  style={{ minWidth: 250, maxHeight: 300, overflowY: "auto" }}
                >
                  {items.length === 0 ? (
                    <span className="dropdown-item-text">Sin notificaciones</span>
                  ) : (
                    items.map((n) => (
                      <li key={n.id} className="dropdown-item small">
                        {n.message}
                        <br />
                        <small className="text-muted">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </li>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {currentUser ? (
            <button className="btn btn-light d-flex align-items-center fw-semibold"
                    onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              {currentUser.displayName || currentUser.email.split("@")[0]}
            </button>
          ) : (
            <Link to="/login"
                  className="btn btn-outline-light d-flex align-items-center fw-semibold">
              <FaSignInAlt className="me-2" />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


