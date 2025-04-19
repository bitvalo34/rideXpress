import React, { useEffect, useState, useRef } from "react";
import { pushNotification }   from "../context/NotificationsContext";
import { FaCamera, FaSave, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import "../styles/Profile.css";

function Profile() {
  const { currentUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    avatarUrl: "",  
    coverUrl : "", 
  });

  const [avatarFile, setAvatarFile] = useState(null);   // 🆕 temp files
  const [coverFile , setCoverFile ] = useState(null);
  
  const avatarInput = useRef(null);   // 🆕 hidden file inputs
  const coverInput  = useRef(null);

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
          avatarUrl: d.avatarUrl || "public/assets/driver-placeholder.png",
          coverUrl : d.coverUrl  || "public/assets/cover-placeholder.png",
        });
      }
    });
  }, [currentUser]);

  const uploadImage = async (file, path) => {
    const storage   = getStorage();
    const fileRef   = ref(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const save = async () => {
    const updates = { ...form };              

    if (avatarFile) {
     updates.avatarUrl = await uploadImage(
      avatarFile,
      `avatars/${currentUser.uid}`
    );
  }
    if (coverFile) {
     updates.coverUrl = await uploadImage(
      coverFile,
      `covers/${currentUser.uid}`
    );
  }
    await updateDoc(doc(db, "usuarios", currentUser.uid), updates);
    pushNotification(currentUser.uid, "Perfil actualizado");
    setEdit(false);
  };

  return (
    <div className="container my-4 profile-container">
      <div className="card profile-card shadow-sm">
        {/* Cover */}
        <div className="profile-cover position-relative">
          <img
            src={coverFile ? URL.createObjectURL(coverFile) : form.coverUrl}
            alt="cover"
            className="cover-img"
            onClick={() => edit && coverInput.current.click()}
            style={{ cursor: edit ? "pointer" : "default" }}
          />
          {/* Botón cámara sobre la portada */}
          {edit && (
            <button
              type="button"
              className="btn-edit-photo cover-btn"
              onClick={() => coverInput.current.click()}
            >
              <FaCamera />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={coverInput}
            onChange={(e) => setCoverFile(e.target.files[0])}
          />
        </div>
        {/* Core */}
        <div className="profile-content">
          <div className="avatar-container position-relative">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : form.avatarUrl}
              alt="avatar"
              className="profile-avatar"
              onClick={() => edit && avatarInput.current.click()}
              style={{ cursor: edit ? "pointer" : "default" }}
            />
            {edit && (
              <button
                type="button"
                className="btn-edit-photo"
                onClick={() => avatarInput.current.click()}
              >
                <FaCamera />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={avatarInput}
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
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

