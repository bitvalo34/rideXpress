import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import MapsProvider from "./context/MapsProvider";
import NotificationsProvider from "./context/NotificationsContext";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Import your global CSS
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <MapsProvider>
      <AuthProvider>
        <NotificationsProvider>
        <App />
        </NotificationsProvider>
      </AuthProvider>
    </MapsProvider>
  </BrowserRouter>
);
