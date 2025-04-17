// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import PrivateRoute from "./components/PrivateRoute";

import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";

import Login        from "./components/Login";
import Register     from "./components/Register";
import Home         from "./components/Home";
import TripForm     from "./components/TripForm";
import Drivers      from "./components/Drivers";
import Payment      from "./components/Payment";
import TripList     from "./components/TripList";
import TripHistory  from "./components/TripHistory";
import RideDetails  from "./components/RideDetails";
import Profile      from "./components/Profile";
import Support      from "./components/Support";

function App() {
  return (
    <>
      <Navbar />

      {/* cuerpo principal */}
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          {/* ---------- rutas públicas ---------- */}
          <Route path="/"         element={<Navigate to="/login" replace />} />
          <Route path="/login"    element={<Login    />} />
          <Route path="/register" element={<Register />} />

          {/* ---------- app protegida ---------- */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Crear nuevo viaje — se aceptan dos URLs para compatibilidad */}
          <Route
            path="/new-trip"
            element={
              <PrivateRoute>
                <TripForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-trips/new"
            element={
              <PrivateRoute>
                <TripForm />
              </PrivateRoute>
            }
          />

          {/* Editar viaje programado */}
          <Route
            path="/my-trips/edit/:id"
            element={
              <PrivateRoute>
                <TripForm />
              </PrivateRoute>
            }
          />

          {/* Listados */}
          <Route
            path="/my-trips"
            element={
              <PrivateRoute>
                <TripList />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <TripHistory />
              </PrivateRoute>
            }
          />

          {/* Flujo “viajar ahora” */}
          <Route
            path="/drivers"
            element={
              <PrivateRoute>
                <Drivers />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />

          {/* Detalle de cualquier viaje */}
          <Route
            path="/ride/:id"
            element={
              <PrivateRoute>
                <RideDetails />
              </PrivateRoute>
            }
          />

          {/* Perfil y soporte */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
            }
          />

          {/* ---------- 404 fallback ---------- */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;

