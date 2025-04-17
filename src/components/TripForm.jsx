import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc, setDoc, addDoc, collection, getDoc, serverTimestamp,
} from "firebase/firestore";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { format, addHours, isBefore, parseISO } from "date-fns";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import MapAutocomplete from "./MapAutocomplete";
import { MapsContext } from "../context/MapsProvider";

/* ---------- util ---------- */
const geocodeLatLng = (lat, lng) =>
  new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (r, s) =>
      s === "OK" && r[0] ? resolve(r[0].formatted_address) : reject());
  });

const mapStyle = { width: "100%", height: "340px" };

export default function TripForm() {
  /* ---------- state ---------- */
  const [origen,setOrigen]             = useState("");
  const [destino,setDestino]           = useState("");
  const [coordsO,setCoordsO]           = useState(null);
  const [coordsD,setCoordsD]           = useState(null);
  const [center,setCenter]             = useState({lat:14.6349,lng:-90.5069});

  const [now,setNow]                   = useState(true);
  const [fecha,setFecha]               = useState(format(new Date(),"yyyy-MM-dd"));
  const [hora,setHora]                 = useState(format(addHours(new Date(),1),"HH:mm"));
  const [tipoVehiculo,setTipo]         = useState("Sedán");
  const [nota,setNota]                 = useState("");

  const [loading,setLoading]           = useState(false);
  const [error,setError]               = useState("");

  const { id }                         = useParams();
  const editing                        = Boolean(id);
  const navigate                       = useNavigate();
  const { currentUser }                = useAuth();
  const isLoaded                       = useContext(MapsContext);

  /* ---------- geo locate ---------- */
  useEffect(()=>{ navigator.geolocation.getCurrentPosition(
    p=>setCenter({lat:p.coords.latitude,lng:p.coords.longitude}), ()=>{}
  );},[]);

  /* ---------- editar ---------- */
  useEffect(()=>{
    if(!editing||!isLoaded) return;
    (async()=>{
      setLoading(true);
      const s = await getDoc(doc(db,"viajes",id));
      if(!s.exists()){ setError("Viaje no encontrado"); setLoading(false); return;}
      const d = s.data();
      setOrigen(d.origen); setDestino(d.destino);
      setFecha(d.fecha);   setHora(d.hora);
      setTipo(d.tipoVehiculo); setNota(d.nota||"");
      setCoordsO(d.coordsOrigen); setCoordsD(d.coordsDestino);
      setNow(d.status!=="scheduled");          // scheduled = programado
      setLoading(false);
    })();
  },[editing,id,isLoaded]);

  /* ---------- mapa/auto‑complete ---------- */
  const onSelectO = (desc,lat,lng)=>{setOrigen(desc); setCoordsO({lat,lng}); setCenter({lat,lng});};
  const onSelectD = (desc,lat,lng)=>{setDestino(desc);setCoordsD({lat,lng});setCenter({lat,lng});};

  const handleMapClick = useCallback(async(e)=>{
    const lat=e.latLng.lat(), lng=e.latLng.lng();
    try{
      const addr = await geocodeLatLng(lat,lng);
      if(!coordsO){setCoordsO({lat,lng}); setOrigen(addr);}
      else if(!coordsD){setCoordsD({lat,lng}); setDestino(addr);}
    }catch{}
  },[coordsO,coordsD]);

  const dragEnd = async(t,e)=>{
    const lat=e.latLng.lat(),lng=e.latLng.lng();
    const addr = await geocodeLatLng(lat,lng);
    t==="O"? (setCoordsO({lat,lng}),setOrigen(addr))
           : (setCoordsD({lat,lng}),setDestino(addr));
  };

  /* ---------- submit ---------- */
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!currentUser) return;

    if(!now){         // validar que sea ≥ 1 hora en el futuro
      const fh = parseISO(`${fecha}T${hora}`);
      if(isBefore(fh, addHours(new Date(),1)))
        return setError("El viaje programado debe ser al menos 1 hora en el futuro.");
    }

    const data={
      uid           : currentUser.uid,
      origen,destino,
      fecha         : now?format(new Date(),"yyyy-MM-dd"):fecha,
      hora          : now?format(new Date(),"HH:mm")    :hora,
      tipoVehiculo, nota,
      coordsOrigen  : coordsO,
      coordsDestino : coordsD,
      status        : now?"pending_driver":"scheduled",
      creadoEn      : serverTimestamp(),
    };

    setLoading(true);
    try{
      if(editing){
        await setDoc(doc(db,"viajes",id),data,{merge:true});
        navigate("/my-trips");
      }else{
        const ref = await addDoc(collection(db,"viajes"),data);
        now
          ? navigate(`/drivers?tripId=${ref.id}&now=1`)
          : navigate(`/payment?tripId=${ref.id}`);
      }
    }catch(err){ setError(err.message);}
    finally{ setLoading(false);}
  };

  /* ---------- renders ---------- */
  if(!isLoaded) return <p className="m-4">Cargando Google Maps…</p>;
  if(loading)   return <p className="m-4">Cargando…</p>;
  if(error)     return <p className="text-danger m-4">{error}</p>;

  return(
    <div className="container my-4">
      <h2>{editing?"Editar Viaje":"Nuevo Viaje"}</h2>

      <GoogleMap
        mapContainerStyle={mapStyle} center={center} zoom={13}
        onClick={handleMapClick}>
        {coordsO&&<Marker position={coordsO} draggable onDragEnd={(e)=>dragEnd("O",e)} label="O"/>}
        {coordsD&&<Marker position={coordsD} draggable onDragEnd={(e)=>dragEnd("D",e)} label="D"/>}
      </GoogleMap>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3"><label>Origen</label>
          <MapAutocomplete value={origen} onSelect={onSelectO} placeholder="Ingresa origen"/></div>
        <div className="mb-3"><label>Destino</label>
          <MapAutocomplete value={destino} onSelect={onSelectD} placeholder="Ingresa destino"/></div>

        <div className="form-check form-switch mb-3">
          <input className="form-check-input" id="now" type="checkbox"
                 checked={now} onChange={()=>setNow(!now)}/>
          <label className="form-check-label" htmlFor="now">Viajar ahora</label>
        </div>

        {!now&&(
          <>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Fecha</label>
                <input type="date" className="form-control"
                       min={format(new Date(),"yyyy-MM-dd")}
                       value={fecha} onChange={e=>setFecha(e.target.value)} required/>
              </div>
              <div className="col-md-6 mb-3">
                <label>Hora</label>
                <input type="time" className="form-control"
                       value={hora} onChange={e=>setHora(e.target.value)} required/>
              </div>
            </div>

            <div className="mb-3"><label>Tipo de vehículo</label>
              <select className="form-select" value={tipoVehiculo}
                      onChange={e=>setTipo(e.target.value)}>
                <option>Sedán</option><option>SUV</option>
                <option>Pickup</option><option>Motocicleta</option>
              </select>
            </div>

            <div className="mb-3"><label>Nota (opcional)</label>
              <textarea className="form-control" rows={3}
                        value={nota} onChange={e=>setNota(e.target.value)}/></div>
          </>
        )}

        <button className="btn btn-primary" disabled={loading}>
          {editing?"Guardar cambios": now?"Buscar conductor":"Crear viaje"}
        </button>
      </form>
    </div>
  );
}


