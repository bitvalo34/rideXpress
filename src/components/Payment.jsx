import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaCreditCard, FaMoneyBillAlt, FaPaypal, FaTag } from "react-icons/fa";
import "../styles/Payment.css";
import { MapsContext } from "../context/MapsProvider";
import { pushNotification }   from "../context/NotificationsContext"; 

export default function Payment() {
  const { isLoaded }           = useContext(MapsContext);
  const [fare, setFare]        = useState(null);
  const [tripStatus, setStat]  = useState(null);      // estado real 
  const navigate               = useNavigate();
  const tripId                 = new URLSearchParams(useLocation().search).get("tripId");

  /* ---------- leer viaje y (si hace falta) calcular tarifa ---------- */
  useEffect(() => {
    if (!tripId) return;
    (async () => {
      const snap = await getDoc(doc(db, "viajes", tripId));
      if (!snap.exists()) return;
      const d = snap.data();
      setStat(d.status);

      /* tarifa */
      if (d.fare) { setFare(d.fare); return; }
      if (!isLoaded) return;

      const { coordsOrigen, coordsDestino } = d;
      if (!coordsOrigen || !coordsDestino) return;

      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        {
          origins:      [coordsOrigen],
          destinations: [coordsDestino],
          travelMode:   "DRIVING",
        },
        async (res, status) => {
          if (status !== "OK") return;
          const km   = res.rows[0].elements[0].distance.value / 1000;
          const calc = (km * 5).toFixed(2);               // Q5 / km
          setFare(calc);
          await updateDoc(doc(db, "viajes", tripId), { fare: calc });
        }
      );
    })();
  }, [isLoaded, tripId]);

  /* ---------- confirmar método ---------- */
  const finishPayment = async (m) => {
    if (!tripId || !tripStatus) return;                 // evita clics tempranos

    const newStatus = tripStatus === "scheduled" ? "scheduled" : "completed";

    await updateDoc(doc(db, "viajes", tripId), {
      metodoPago: m,
      status: newStatus,
    });

    navigate(newStatus === "completed" ? "/history" : "/my-trips");

    pushNotification(
      snap.data().uid,
      `Pago confirmado con ${m} • viaje ${
      newStatus === "completed" ? "completado" : "programado"
      }`
    );
  };

  const disabled = !tripStatus;

  return (
    <div className="container my-4 payment-container">
      <div className="card p-4 shadow-sm payment-card">
        <h2 className="text-center text-secondary-blue mb-4">Método de pago</h2>

        {fare && (
          <p className="text-center fw-semibold">
            Tarifa estimada: <span className="text-primary">Q{fare}</span>
          </p>
        )}

        <div className="payment-methods d-flex justify-content-around mb-4">
          <button className="btn btn-primary payment-btn" disabled={disabled}
                  onClick={() => finishPayment("Tarjeta")}>
            <FaCreditCard className="me-2" /> Tarjeta
          </button>
          <button className="btn btn-primary payment-btn" disabled={disabled}
                  onClick={() => finishPayment("Efectivo")}>
            <FaMoneyBillAlt className="me-2" /> Efectivo
          </button>
          <button className="btn btn-primary payment-btn" disabled={disabled}
                  onClick={() => finishPayment("PayPal")}>
            <FaPaypal className="me-2" /> PayPal
          </button>
        </div>

        {/* opcional */}
        <div className="promo-section text-center">
          <h3 className="mb-3 text-secondary-blue">Código Promocional</h3>
          <div className="d-inline-flex">
            <input className="form-control promo-input me-2"
                   placeholder="Ingresa tu código" disabled />
            <button className="btn btn-info promo-btn" disabled>
              <FaTag className="me-1" /> Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





