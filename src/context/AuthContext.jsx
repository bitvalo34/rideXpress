// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { googleProvider } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUserDocumentIfNotExists = async (user) => {
    if (!user) return;
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { email, displayName, phoneNumber } = user;
      await setDoc(userRef, {
        nombre: displayName || "",
        correo: email || "",
        telefono: phoneNumber || "",
        creado: new Date().toISOString(),
      });
    }
  };

  /* ---------- Métodos ---------- */
  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocumentIfNotExists(result.user);
  };

  const login = (email, password) =>
      signInWithEmailAndPassword(auth, email, password)
        .then(() => window.location.replace("/home"));

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserDocumentIfNotExists(result.user);
    window.location.replace("/home"); 
  };

  const logout = () => signOut(auth);

  /* ---------- Listener ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) await createUserDocumentIfNotExists(user);
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
