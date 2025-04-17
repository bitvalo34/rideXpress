import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMaps } from "../context/MapsProvider";

const containerStyle = { width: "100%", height: "100%" };

function MapView() {
  const { isLoaded } = useMaps();           // usamos el loader global

  if (!isLoaded) return <p>Cargando mapa…</p>;

  const center = { lat: 14.6349, lng: -90.5069 };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      <Marker position={center} />
    </GoogleMap>
  );
}

export default MapView;

