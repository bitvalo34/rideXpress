import React,{useEffect,useState} from "react";
import { isToday, isTomorrow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { collection, query, where, orderBy,
         onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { pushNotification }   from "../context/NotificationsContext";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/TripHistory.css";

export default function TripHistory(){
  const { currentUser } = useAuth();
  const [trips,setTrips]=useState([]);
  const [search, setSearch] = useState("");    
  const [filter, setFilter] = useState("all");

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

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar este viaje del historial?")) return;
    await deleteDoc(doc(db, "viajes", id));
    pushNotification(currentUser.uid, "Viaje del historial eliminado");
  };

  const filteredTrips = trips
  .filter((t) => {
    if (filter === "all") return true;
    const f = parseISO(`${t.fecha}T00:00`);
    return filter === "today" ? isToday(f) : isTomorrow(f);
  })
  .filter(
    (t) =>
      t.origen.toLowerCase().includes(search) ||
      t.destino.toLowerCase().includes(search)
  );

  return(
    <div className="container my-4 trip-history-container">
      <h2 className="mb-4 trip-heading">Historial de Viajes</h2>
      {/* --- barra de búsqueda --- */}
      <input
        className="form-control mb-3"
        placeholder="Buscar por origen o destino..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      {/* --- filtros de fecha --- */}
      <div className="btn-group mb-3">
        {["all", "today", "tomorrow"].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${
              filter === f ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Todos" : f === "today" ? "Hoy" : "Mañana"}
          </button>
        ))}
      </div>

      {filteredTrips.length===0?<p>Aún no tienes viajes completados.</p>:
        <div className="row g-3">
          {filteredTrips.map(t=>(
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





