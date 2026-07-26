// app/student/applications/index.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { fetchMyApplications } from "../../../services/applicationsApi";

const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#f97316",
  cardBg: "rgba(15,23,42,0.96)",
  border: "rgba(148,163,184,0.4)",
  text: "#f9fafb",
  muted: "#9ca3af",
};

const STATUS_LABELS = {
  pending: "Pending",
  submitted: "Submitted",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function StudentApplicationsListScreen() {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    // simple guard: si pas de user en local, redirection login
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("koedu_user");
        if (!raw) {
          router.replace("/auth/login");
          return;
        }
      } catch (e) {
        console.log("StudentApplicationsListScreen user error:", e.message);
      } finally {
        setCheckingUser(false);
      }
    })();
  }, [router]);

  useEffect(() => {
    if (checkingUser) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetchMyApplications();
        const list = res?.applications || res || [];
        setApps(Array.isArray(list) ? list : []);
      } catch (e) {
        console.log("fetchMyApplications error:", e.message);
        setApps([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [checkingUser]);

  const handleOpen = (item) => {
    const id = item._id || item.id;
    if (!id) return;
    router.push(`/student/applications/${id}`);
  };

  const renderItem = ({ item }) => {
    const statusLabel =
      item.status ? STATUS_LABELS[item.status] || item.status : "—";

    return (
      <Pressable
        onPress={() => handleOpen(item)}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>
            {item.programName || "Program application"}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>
          {item.university || item.universityName || "Korean university"}
        </Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta}>
            Intake: {item.intake || "—"}
          </Text>
          <Text style={styles.cardMeta}>
            Submitted: {formatDate(item.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.text} />
          <Text style={styles.backButtonText}>Home</Text>
        </Pressable>
        <Text style={styles.headerTitle}>My applications</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.muted}>Loading your applications...</Text>
        </View>
      ) : apps.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>
            You have no applications yet. Start your first application!
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push("/apply")}
          >
            <Text style={styles.primaryBtnText}>Apply now</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={apps}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  backButtonText: { color: COLORS.text, fontSize: 13, fontWeight: "600" },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  muted: { color: COLORS.muted, marginTop: 10, textAlign: "center" },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  cardSubtitle: { color: COLORS.muted, marginTop: 4 },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardMeta: { color: COLORS.muted, fontSize: 12 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.16)",
  },
  statusText: { color: "#fb923c", fontSize: 11, fontWeight: "700" },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  primaryBtnText: {
    color: "#111827",
    fontWeight: "700",
  },
});
