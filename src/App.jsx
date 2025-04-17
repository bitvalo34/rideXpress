import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import TripForm from "./components/TripForm";
import Drivers from "./components/Drivers";
import Payment from "./components/Payment";
import TripList from "./components/TripList";
import TripHistory from "./components/TripHistory";
import RideDetails from "./components/RideDetails";
import Profile from "./components/Profile";
import Support from "./components/Support";

function App() {
  return (
    <>
      <Navbar />

      <div style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App protegida */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-trip"
            element={
              <PrivateRoute>
                <TripForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <PrivateRoute>
                <TripList />
              </PrivateRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <PrivateRoute>
                <Drivers />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <TripHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/ride/:id"
            element={
              <PrivateRoute>
                <RideDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;

