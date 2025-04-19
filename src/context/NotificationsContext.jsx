import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,          
  deleteDoc,        
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext();

/* helper reutilizable ---------------------------------------------------- */
export const pushNotification = async (uid, message) => {
  if (!uid) return;
  const colRef = collection(db, "notificaciones");
  /* ── Mantener máximo 10 ── */
  const q   = query(colRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  if (snap.size >= 10) {
    // eliminamos el documento más antiguo (último en el query)
    const oldest = snap.docs[snap.docs.length - 1];
    await deleteDoc(oldest.ref);
  }
  await addDoc(colRef, {
    uid,
    message,
    read      : false,
    createdAt : Date.now(),
    });
};

export const useNotifications = () => useContext(NotificationsContext);

export default function NotificationsProvider({ children }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  /* realtime listener de notificaciones del usuario */
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "notificaciones"),
      where("uid", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [currentUser]);

  /* marcar todas como leídas */
  const markAllRead = async () => {
    const unread = items.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) => updateDoc(doc(db, "notificaciones", n.id), { read: true }))
    );
  };

  const value = { items, markAllRead };
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
