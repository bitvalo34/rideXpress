import React from "react";
import {
  FaMapMarkedAlt,
  FaSearchLocation,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MainScreen from "./MainScreen";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <MainScreen>
      <div className="home-tab shadow-lg">
        {/* botón: crear / programar un viaje */}
        <button
          className="btn btn-info w-100 mb-2 d-flex align-items-center justify-content-center"
          onClick={() => navigate("/new-trip")}      // ruta al formulario
        >
          <FaMapMarkedAlt className="me-2" />
          Realizar / Programar un viaje
        </button>

        {/* botón: lista de viajes existentes */}
        <button
          className="btn btn-info w-100 d-flex align-items-center justify-content-center"
          onClick={() => navigate("/my-trips")}
        >
          <FaSearchLocation className="me-2" />
          Ver mis viajes
        </button>
      </div>
    </MainScreen>
  );
}

export default Home;

