// src/components/Support.jsx
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { pushNotification } from "../context/NotificationsContext";
import "../styles/Support.css";

export default function Support() {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      await addDoc(collection(db, "soporte"), {
        uid: currentUser ? currentUser.uid : null,
        message: msg.trim(),
        createdAt: serverTimestamp(),
      });
      /* notificación interna para el usuario */
      if (currentUser)
        await pushNotification(
          currentUser.uid,
          "¡Gracias! Tu mensaje de soporte fue recibido."
        );
      setSent(true);
      setMsg("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-secondary-blue">Soporte</h2>

      <div className="row g-4">
        {/* FAQ – igual que antes */}
        <div className="col-md-6">
          <div className="card p-3 h-100 shadow-sm">
            <h3 className="text-secondary-blue mb-3">Preguntas Frecuentes</h3>
            <div className="faq-item mb-3">
              <strong>¿Cómo solicito un viaje?</strong>
              <p className="mb-0">
                Presiona “Realizar / Programar un viaje” y completa el formulario.
              </p>
            </div>
            <div className="faq-item mb-3">
              <strong>¿Cómo pago?</strong>
              <p className="mb-0">
                Selecciona la forma de pago en la pantalla “Método de pago”.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="col-md-6">
          <div className="card p-3 h-100 shadow-sm">
            <h3 className="text-secondary-blue mb-3">Contáctanos</h3>
            {sent && (
              <div className="alert alert-success" role="alert">
                Mensaje enviado. ¡Nos pondremos en contacto pronto!
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  rows="4"
                  placeholder="Escribe tu pregunta o comentario"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

