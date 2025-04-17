import React, { createContext, useContext, useMemo } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { LIBRARIES } from "../googleMapsConfig";

const MAPS_ID = "ridexpress-google-maps";        // id único para el script

export const MapsContext = createContext({
  isLoaded: false,
  google: null,
});

export const useMaps = () => useContext(MapsContext);

function MapsProvider({ children }) {
  const { isLoaded } = useJsApiLoader({
    id: MAPS_ID,
    googleMapsApiKey: "AIzaSyAigOyidCJi8jt_R7FWnp1ZfEAcdL6cg44",
    libraries: LIBRARIES,
  });

  const value = useMemo(
    () => ({ isLoaded, google: window.google }),
    [isLoaded]
  );

  return (
    <MapsContext.Provider value={value}>{children}</MapsContext.Provider>
  );
}

export default MapsProvider;

