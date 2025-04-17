import React, { useEffect, useState } from "react";
import { FaCamera, FaSave, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Profile.css";

function Profile() {
  const { currentUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });

  useEffect(() => {
    if (!currentUser) return;
    const ref = doc(db, "usuarios", currentUser.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          nombre: d.nombre,
          telefono: d.telefono,
          correo: d.correo,
        });
      }
    });
  }, [currentUser]);

  const save = async () => {
    await updateDoc(doc(db, "usuarios", currentUser.uid), form);
    setEdit(false);
  };

  return (
    <div className="container my-4 profile-container">
      <div className="card profile-card shadow-sm">
        {/* Cover */}
        <div className="profile-cover">
          <img
            src="public/assets/cover-placeholder.jpg"
            alt="cover"
            className="cover-img"
          />
        </div>

        {/* Core */}
        <div className="profile-content">
          <div className="avatar-container">
            <img
              src="public/assets/driver-placeholder.png"
              className="profile-avatar"
            />
            <button className="btn-edit-photo" disabled>
              <FaCamera />
            </button>
          </div>

          {/* data */}
          <div className="profile-info">
            {edit ? (
              <>
                <input
                  className="form-control mb-2"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                />
                <input
                  className="form-control mb-2"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, telefono: e.target.value }))
                  }
                />
                <input
                  className="form-control mb-2"
                  value={form.correo}
                  disabled
                />
              </>
            ) : (
              <>
                <h2 className="profile-name">{form.nombre}</h2>
                <p>
                  <strong>Correo:</strong> {form.correo}
                </p>
                <p>
                  <strong>Teléfono:</strong> {form.telefono || "—"}
                </p>
              </>
            )}

            <button
              className="btn btn-info btn-edit-info"
              onClick={edit ? save : () => setEdit(true)}
            >
              {edit ? (
                <>
                  <FaSave className="me-1" /> Guardar
                </>
              ) : (
                <>
                  <FaEdit className="me-1" /> Editar Información
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

