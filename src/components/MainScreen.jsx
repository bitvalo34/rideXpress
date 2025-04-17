import React from "react";
import MapView from "./MapView";
import "../styles/MainScreen.css";

function MainScreen({ children }) {
  return (
    <div className="main-screen-wrapper">
      <div className="map-bg">
        <MapView />
      </div>
      {children}
    </div>
  );
}

export default MainScreen;
