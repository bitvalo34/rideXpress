import React, { useEffect, useState } from "react";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/RideDetails.css";

const API_URL = "http://localhost:4000";

function RideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      const snap = await getDoc(doc(db, "viajes", id));
      if (snap.exists()) setRide({ id, ...snap.data() });
    };
    fetchRide();
  }, [id]);

  if (!ride) return <p className="m-4">Cargando…</p>;

  return (
    <div className="container my-4 ride-details-container">
      <h2 className="mb-4 text-secondary-blue">Detalle del Viaje</h2>

      <div className="card shadow-sm p-3">
        <h5 className="fw-bold mb-3">
          <FaCar className="me-2" />
          {ride.vehicle || "Vehículo"}
        </h5>

        <p>
          <FaMapMarkerAlt className="me-2 text-primary" />
          <strong>Origen:</strong> {ride.origen}
        </p>
        <p>
          <FaMapMarkerAlt className="me-2 text-danger" />
          <strong>Destino:</strong> {ride.destino}
        </p>

        <p>
          <FaCalendarAlt className="me-2" />
          <strong>Fecha:</strong>{" "}
          {new Date(ride.date || ride.creadoEn?.seconds * 1000).toLocaleString()}
        </p>

        {ride.driver && (
          <p>
            <img
              src="/assets/driver-placeholder.png"
              alt="driver"
              className="me-2"
              style={{ width: 35, borderRadius: "50%" }}
            />
            <strong>Conductor:</strong> {ride.driver}
          </p>
        )}

        {ride.fare && (
          <p className="fs-5">
            <FaMoneyBillAlt className="me-2" />
            <strong>Tarifa:</strong> Q{ride.fare}
          </p>
        )}

        {ride.metodoPago && (
          <p>
            <strong>Método de pago:</strong> {ride.metodoPago}
          </p>
        )}

        {ride.nota && (
          <div className="alert alert-info mt-3">
            <strong>Nota:</strong> {ride.nota}
          </div>
        )}
        {/* ↓ Botón para descargar recibo PDF ↓ */}
        <div className="mt-4 text-center">
          <a
            href={`${API_URL}/trips/${ride.id}/receipt`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary"
          >
            Descargar recibo PDF
          </a>
        </div>
      </div>
    </div>
  );
}

export default RideDetails;

