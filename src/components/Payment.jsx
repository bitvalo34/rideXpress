import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaCreditCard, FaMoneyBillAlt, FaPaypal, FaTag } from "react-icons/fa";
import "../styles/Payment.css";
import { MapsContext } from "../context/MapsProvider";

export default function Payment(){
  const { isLoaded }      = useContext(MapsContext);
  const [fare,setFare]    = useState(null);
  const [status,setStatus]= useState("scheduled");
  const { search }        = useLocation();
  const navigate          = useNavigate();
  const tripId            = new URLSearchParams(search).get("tripId");

  /* ---------- tarifa ---------- */
  useEffect(()=>{
    const calc = async()=>{
      if(!isLoaded||!tripId) return;
      const snap = await getDoc(doc(db,"viajes",tripId));
      if(!snap.exists()) return;
      const d = snap.data(); setStatus(d.status);
      if(d.fare){ setFare(d.fare); return; }

      const { coordsOrigen,coordsDestino } = d;
      if(!coordsOrigen||!coordsDestino) return;

      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        {origins:[coordsOrigen],destinations:[coordsDestino],travelMode:"DRIVING"},
        async(res,st)=>{
          if(st!=="OK") return;
          const meters = res.rows[0].elements[0].distance.value;
          const price  = ((meters/1000)*5).toFixed(2);
          setFare(price);
          await updateDoc(doc(db,"viajes",tripId),{ fare:price });
        });
    };
    calc();
  },[isLoaded,tripId]);

  /* ---------- método ---------- */
  const handle = async(m)=>{
    if(tripId){
      await updateDoc(doc(db,"viajes",tripId),{
        metodoPago:m,
        status: status==="pending_payment" ? "completed" : "scheduled",
      });
    }
    navigate(status==="pending_payment"?"/history":"/my-trips");
  };

  return(
    <div className="container my-4 payment-container">
      <div className="card p-4 shadow-sm payment-card">
        <h2 className="text-center text-secondary-blue mb-4">Método de pago</h2>

        {fare&&<p className="text-center fw-semibold">
          Tarifa estimada: <span className="text-primary">Q{fare}</span>
        </p>}

        <div className="payment-methods d-flex justify-content-around mb-4">
          <button className="btn btn-primary payment-btn" onClick={()=>handle("Tarjeta")}>
            <FaCreditCard className="me-2"/>Tarjeta
          </button>
          <button className="btn btn-primary payment-btn" onClick={()=>handle("Efectivo")}>
            <FaMoneyBillAlt className="me-2"/>Efectivo
          </button>
          <button className="btn btn-primary payment-btn" onClick={()=>handle("PayPal")}>
            <FaPaypal className="me-2"/>PayPal
          </button>
        </div>

        {/* opcional promo */}
        <div className="promo-section text-center">
          <h3 className="mb-3 text-secondary-blue">Código Promocional</h3>
          <div className="d-inline-flex">
            <input className="form-control promo-input me-2"
                   placeholder="Ingresa tu código" disabled/>
            <button className="btn btn-info promo-btn" disabled>
              <FaTag className="me-1"/>Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



