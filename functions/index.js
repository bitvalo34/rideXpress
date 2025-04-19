/* eslint-env node */
// functions/index.js
const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const {Timestamp} = require("firebase-admin/firestore");

admin.initializeApp();
const db = admin.firestore();

exports.updateTripStatuses = onSchedule("*/1 * * * *", async () => {
  const now = new Date();
  const thirty = new Date(now.getTime() + 30 * 60 * 1_000);
  const col = db.collection("viajes");

  // 1. (‑30 min) – sólo log
  const nearSnap = await col
    .where("status", "==", "scheduled")
    .where("fechaHoraTS", "<=", Timestamp.fromDate(thirty))
    .get();
  nearSnap.forEach(d => console.log(`Próximos 30 min: ${d.id}`));

  // 2. YA pasados  →  completed
  const pastSnap = await col
    .where("status", "==", "scheduled")
    .where("fechaHoraTS", "<=", Timestamp.fromDate(now))
    .get();
    
  const batch = db.batch();
  pastSnap.forEach(s => batch.update(s.ref, {status: "completed"}));
  await batch.commit();

  console.log(`Actualizados ${pastSnap.size} viajes`);
});

