// components/FirestoreProbe.js
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { app, db } from "../services/firebase";

export default function FirestoreProbe() {
  useEffect(() => {
    (async () => {
      try {
        console.log("[probe] projectId =", app.options.projectId);
        const snap = await getDocs(collection(db, "stats"));
        console.log("[probe] stats:", snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("[probe] error:", e.code, e.message);
      }
    })();
  }, []);
  return null;
}
