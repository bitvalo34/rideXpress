import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { collection, query, where, orderBy,
         onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/TripHistory.css";

export default function TripHistory(){
  const { currentUser } = useAuth();
  const [trips,setTrips]=useState([]);

  useEffect(()=>{
    if(!currentUser) return;
    const q=query(
      collection(db,"viajes"),
      where("uid","==",currentUser.uid),
      where("status","==","completed"),
      orderBy("fecha","desc"), orderBy("hora","desc")
    );
    return onSnapshot(q,snap=>
      setTrips(snap.docs.map(d=>({id:d.id,...d.data()}))));
  },[currentUser]);

  const remove=async id=>{
    if(window.confirm("¿Eliminar este viaje del historial?"))
      await deleteDoc(doc(db,"viajes",id));
  };

  return(
    <div className="container my-4 trip-history-container">
      <h2 className="mb-4 trip-heading">Historial de Viajes</h2>

      {trips.length===0?<p>Aún no tienes viajes completados.</p>:
        <div className="row g-3">
          {trips.map(t=>(
            <div className="col-md-4" key={t.id}>
              <div className="card trip-card shadow-sm p-3">
                <Link to={`/ride/${t.id}`} className="text-dark text-decoration-none d-block">
                  <h5 className="fw-bold">{t.fecha} • {t.hora}</h5>
                  <p className="mb-1"><strong>Origen:</strong> {t.origen}</p>
                  <p className="mb-1"><strong>Destino:</strong> {t.destino}</p>
                  {t.fare&&<p className="mb-0"><strong>Tarifa:</strong> Q{t.fare}</p>}
                </Link>
                <button className="btn btn-sm btn-outline-danger mt-2" onClick={()=>remove(t.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}





