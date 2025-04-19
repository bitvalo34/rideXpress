import React,{useEffect,useState} from "react";
import { collection, query, where, orderBy,
         onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { pushNotification }   from "../context/NotificationsContext";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Link,useNavigate } from "react-router-dom";
import { isToday,isTomorrow,parseISO } from "date-fns";
import "../styles/TripList.css";

export default function TripList(){
  const [trips,setTrips]   = useState([]);
  const [filter,setFilter] = useState("all");
  const [search,setSearch] = useState("");
  const { currentUser }    = useAuth();
  const navigate           = useNavigate();

  useEffect(()=>{
    if(!currentUser) return;
    const q=query(
      collection(db,"viajes"),
      where("uid","==",currentUser.uid),
      where("status","==","scheduled"),
      orderBy("fecha"), orderBy("hora")
    );
    return onSnapshot(q,snap=>
      setTrips(snap.docs.map(d=>({id:d.id,...d.data()}))));
  },[currentUser]);

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar este viaje?")) return;
    await deleteDoc(doc(db, "viajes", id));
    pushNotification(currentUser.uid, "Viaje programado eliminado");
  };

  const filt=trips
    .filter(t=>{
      if(filter==="all") return true;
      const f=parseISO(`${t.fecha}T00:00`);
      return filter==="today"?isToday(f):isTomorrow(f);
    })
    .filter(t=>t.origen.toLowerCase().includes(search)||
               t.destino.toLowerCase().includes(search));

  return(
    <div className="container my-4 triplist-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="trip-heading">Mis Viajes Programados</h2>
        <Link to="/new-trip" className="btn btn-primary">Agendar nuevo</Link>
      </div>

      <input className="form-control mb-3" placeholder="Buscar…"
             value={search} onChange={e=>setSearch(e.target.value.toLowerCase())}/>

      <div className="btn-group mb-3">
        {["all","today","tomorrow"].map(f=>(
          <button key={f}
                  className={`btn btn-sm ${filter===f?"btn-primary":"btn-outline-primary"}`}
                  onClick={()=>setFilter(f)}>
            {f==="all"?"Todos":f==="today"?"Hoy":"Mañana"}
          </button>
        ))}
      </div>

      {filt.length===0?<p>No se encontraron viajes.</p>:
        <div className="row g-3">
          {filt.map(t=>(
            <div className="col-md-4" key={t.id}>
              <div className="card trip-card shadow-sm p-3">
                <Link to={`/ride/${t.id}`} className="text-dark text-decoration-none">
                  <h5 className="fw-bold">{t.fecha} • {t.hora}</h5>
                  <p className="mb-1"><strong>Origen:</strong> {t.origen}</p>
                  <p className="mb-1"><strong>Destino:</strong> {t.destino}</p>
                </Link>
                <div className="d-flex justify-content-between mt-2">
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(t.id)}>Eliminar</button>
                  <button className="btn btn-sm btn-outline-primary" onClick={()=>navigate(`/my-trips/edit/${t.id}`)}>Editar</button>
                </div>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}



