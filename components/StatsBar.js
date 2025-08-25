// components/StatsBar.js
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { db } from "../services/firebase";
// (optionnel) si tu as exporté ensureSignedIn() dans services/firebase.js
// import { ensureSignedIn } from "../services/firebase";

const FIELDS = [
  { key: "students",     label: "Students" },
  { key: "universities", label: "Universities" },
  { key: "programs",     label: "Programs" },
];

export default function StatsBar() {
  const [stats, setStats]   = useState({});
  const [loading, setLoad]  = useState(true);
  const [err, setErr]       = useState(null);

  // Animated.Value par champ
  const animated = useRef(
    FIELDS.reduce((acc, f) => ((acc[f.key] = new Animated.Value(0)), acc), {})
  ).current;

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        // Si tu utilises l’anonyme, décommente :
        // await ensureSignedIn();

        unsub = onSnapshot(
          collection(db, "stats"),
          (snap) => {
            const totals = Object.fromEntries(FIELDS.map(f => [f.key, 0]));
            snap.forEach(doc => {
              const data = doc.data() || {};
              FIELDS.forEach(({ key }) => {
                const n = Number(data[key]);
                if (!Number.isNaN(n)) totals[key] += n;
              });
            });
            setStats(totals);
            setLoad(false);
            setErr(null);

            // anime chaque compteur
            FIELDS.forEach(({ key }) => {
              Animated.timing(animated[key], {
                toValue: totals[key] ?? 0,
                duration: 650,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
              }).start();
            });
          },
          (e) => {
            setErr(e.message || "Error loading stats");
            setLoad(false);
          }
        );
      } catch (e) {
        setErr(e.message || "Error loading stats");
        setLoad(false);
      }
    })();
    return () => unsub();
  }, []);

  const items = useMemo(
    () => FIELDS.map(({ key, label }) => ({ key, label, value: stats[key] ?? 0 })),
    [stats]
  );

  if (loading) {
    return (
      <View style={[styles.container]}>
        <Text style={{ color: "#bbb" }}>Loading stats…</Text>
      </View>
    );
  }
  if (err) {
    return (
      <View style={[styles.container, styles.errorBox]}>
        <Text style={styles.errorText}>Failed to load stats</Text>
        <Text style={styles.errorSub}>{String(err)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map(({ key, label }) => (
        <View key={key} style={styles.card}>
          <AnimatedNumber value={animated[key]} style={styles.value} />
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

function AnimatedNumber({ value, style }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const id = value.addListener(({ value: v }) => {
      setDisplay(new Intl.NumberFormat().format(Math.round(v)));
    });
    return () => value.removeListener(id);
  }, [value]);
  return <Text style={style}>{display}</Text>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#111318",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  value: { fontSize: 26, fontWeight: "800", color: "white", marginBottom: 4 },
  label: { fontSize: 13, color: "#c9c9c9" },
  errorBox: { backgroundColor: "#2a1111", borderRadius: 12, padding: 12 },
  errorText: { color: "#ffb3b3", fontWeight: "700" },
  errorSub: { color: "#ffb3b3", opacity: 0.9, marginTop: 4, fontSize: 12 },
});
