import React from "react";
import "../styles/Support.css";

function Support() {
  return (
    <div className="container my-4">
      <h2 className="mb-4 text-secondary-blue">Soporte</h2>
      <div className="row g-4">
        {/* FAQ Section */}
        <div className="col-12 col-md-6">
          <div className="card p-3 h-100 shadow-sm">
            <h3 className="text-secondary-blue mb-3">Preguntas Frecuentes</h3>
            <div className="faq-item mb-3">
              <strong>¿Cómo solicito un viaje?</strong>
              <p className="mb-0">
                Haz clic en "Realizar/Programar un viaje" y sigue las
                instrucciones.
              </p>
            </div>
            <div className="faq-item mb-3">
              <strong>¿Cómo pago?</strong>
              <p className="mb-0">
                Puedes elegir tu método de pago en la sección "Método de Pago".
              </p>
            </div>
          </div>
        </div>
        {/* Contact Form */}
        <div className="col-12 col-md-6">
          <div className="card p-3 h-100 shadow-sm">
            <h3 className="text-secondary-blue mb-3">Contáctanos</h3>
            <form>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  rows="4"
                  placeholder="Escribe tu pregunta o comentario"
                  disabled
                />
              </div>
              <button type="button" className="btn btn-primary" disabled>
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
