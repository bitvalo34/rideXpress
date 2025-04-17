import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaSms,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";
import { generateRecaptcha, signInWithPhone } from "../firebase";

function Login() {
  /* ---------- estado ---------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  const { login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  /* ---------- redirect si ya hay sesión ---------- */
  useEffect(() => {
    if (currentUser) navigate("/home");
  }, [currentUser, navigate]);

  /* ---------- email/contraseña ---------- */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------- google ---------- */
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(); // AuthContext hace replace("/home")
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------- teléfono paso‑1 ---------- */
  const sendSms = async () => {
    if (!phone) return;
    try {
      generateRecaptcha();
      const conf = await signInWithPhone(phone);
      setConfirmation(conf);
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------- teléfono paso‑2 ---------- */
  const verifySms = async () => {
    if (!confirmation || !smsCode) return;
    try {
      await confirmation.confirm(smsCode);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center">
      <div className="card login-card shadow">
        <div className="card-body">
          <div className="text-center mb-4">
            <img
              src="public/assets/logo.png"
              alt="RideXpress Logo"
              className="logo-img"
            />
          </div>

          {/* ---------- email ---------- */}
          <form onSubmit={handleEmailLogin}>
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary w-100 mb-3">Iniciar Sesión</button>
          </form>

          {/* ---------- google ---------- */}
          <button
            className="btn btn-info w-100 mb-3 d-flex align-items-center justify-content-center"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="me-2" /> Iniciar con Google
          </button>

          {/* ---------- teléfono ---------- */}
          {!confirmation ? (
            <>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <FaSms />
                </span>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="(+502) 1234‑5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                className="btn btn-info w-100 d-flex align-items-center justify-content-center"
                onClick={sendSms}
              >
                <FaSms className="me-2" /> Enviar SMS
              </button>
            </>
          ) : (
            <>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <FaCheckCircle />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Código de 6 dígitos"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                />
              </div>
              <button
                className="btn btn-info w-100 d-flex align-items-center justify-content-center"
                onClick={verifySms}
              >
                Verificar Código
              </button>
            </>
          )}

          {error && <p className="text-danger mt-3">{error}</p>}

          <p className="text-center mt-3">
            ¿Aún no tienes cuenta?{" "}
            <a href="/register" className="link-primary">
              Regístrate
            </a>
          </p>
        </div>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Login;

