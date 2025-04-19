import React, { useMemo, useState } from "react";
import { pushNotification }   from "../context/NotificationsContext";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Drivers.css";

/* ---------- “faker” rápido ---------- */
const nombres   = ["Ana", "Luis", "Carlos", "María", "Pedro", "Sofía"];
const vehiculos = ["Sedán", "SUV", "Hatchback", "Pickup", "Motocicleta"];

const randomDrivers = () =>
  Array.from({ length: Math.floor(Math.random() * 4) + 3 }, (_, i) => ({
    id: i + 1,
    name: `Conductor ${nombres[Math.floor(Math.random() * nombres.length)]}`,
    rating: Math.floor(Math.random() * 3) + 3,
    experience: Math.floor(Math.random() * 8) + 1,
    vehicle: vehiculos[Math.floor(Math.random() * vehiculos.length)],
  }));

export default function Drivers() {
  const drivers  = useMemo(randomDrivers, []);
  const navigate = useNavigate();
  const location = useLocation();
  const params   = new URLSearchParams(location.search);

  /* puede venir por query (?tripId=xxx) o por location.state */
  const tripId   = params.get("tripId") || location.state?.tripId || null;
  const [busy, setBusy] = useState(false);

  const renderStars = (r) =>
    Array.from({ length: 5 }, (_, i) =>
      i < r ? <FaStar key={i} className="star-icon filled" />
            : <FaRegStar key={i} className="star-icon empty" />
    );

  /* ---------- selección ---------- */
  const selectDriver = async (d) => {
    if (!tripId) {
      alert("No se encontró el identificador del viaje.");
      return;
    }

    setBusy(true);
    try {
      await updateDoc(doc(db, "viajes", tripId), {
        driver: d.name,
        vehicle: d.vehicle,
        status: "pending_payment",
        asignadoEn: serverTimestamp(),
      });
      pushNotification(
        location.state?.uid || null,
        `Conductor ${d.name} asignado — selecciona método de pago`
      );
    } catch (err) {
      // si falla la escritura seguimos a pago igualmente
      console.error("No se pudo actualizar el viaje:", err.message);
    } finally {
      navigate(`/payment?tripId=${tripId}`);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-secondary-blue">Conductores disponibles</h2>

      <div className="row g-3">
        {drivers.map((d) => (
          <div className="col-12 col-sm-6 col-md-4" key={d.id}>
            <div className="card driver-card text-center shadow-sm">
              <div className="card-header">
                <img
                  src="public/assets/driver-placeholder.png"
                  alt={d.name}
                  className="driver-img"
                />
                {d.rating === 5 && <span className="badge-top">Top</span>}
              </div>

              <div className="card-body">
                <h5 className="card-title">{d.name}</h5>
                <div className="rating mb-2">{renderStars(d.rating)}</div>
                <p className="mb-1">Experiencia: {d.experience} años</p>
                <p className="mb-3">Vehículo: {d.vehicle}</p>

                <button
                  className="btn btn-secondary btn-sm"
                  disabled={busy}
                  onClick={() => selectDriver(d)}
                >
                  {busy ? "Procesando…" : "Seleccionar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




