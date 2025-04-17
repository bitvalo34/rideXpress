// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config desde variables de entorno
const firebaseConfig = {
  apiKey: "AIzaSyDwWtI0jAuGkMd2lWKgOnyJ3vaWMLWOXso",
  authDomain: "ridexpress-a2c29.firebaseapp.com",
  projectId: "ridexpress-a2c29",
  storageBucket: "ridexpress-a2c29.firebasestorage.app",
  messagingSenderId: "22594899158",
  appId: "1:22594899158:web:9b6245c020a74dea368d77",
};

// Inicializar
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

/* ---------- Phone Auth helper ---------- */
export const generateRecaptcha = (elementId = "recaptcha-container") => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => console.log("reCAPTCHA resuelto"),
      "expired-callback": () => console.log("reCAPTCHA expirado"),
    });
  }
  return window.recaptchaVerifier;
};

export const signInWithPhone = async (phoneNumber) => {
  const appVerifier = window.recaptchaVerifier;
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
