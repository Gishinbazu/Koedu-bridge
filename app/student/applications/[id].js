// app/student/applications/[id].js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchApplicationById } from "../../../services/applicationsApi";

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

export default function ApplicationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetchApplicationById(id);
        const application = res?.application || res;
        setApp(application || null);
      } catch (e) {
        console.log("fetchApplicationById error", e.message);
        setApp(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const statusLabel =
    app?.status ? STATUS_LABELS[app.status] || app.status : "—";

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back */}
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
          <Text style={styles.backText}>Back to applications</Text>
        </Pressable>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : !app ? (
          <Text style={styles.empty}>Application not found.</Text>
        ) : (
          <>
            {/* Header */}
            <Text style={styles.title}>
              {app.programName || "Program application"}
            </Text>
            <Text style={styles.subtitle}>
              {app.university || app.universityName || "Korean university"}
            </Text>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {app.intake || "Intake not specified"}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{statusLabel}</Text>
              </View>
            </View>

            {/* Dates */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Timeline</Text>
              <Text style={styles.line}>
                Submitted: {formatDate(app.createdAt)}
              </Text>
              {app.updatedAt && (
                <Text style={styles.line}>
                  Last update: {formatDate(app.updatedAt)}
                </Text>
              )}
            </View>

            {/* Applicant */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Applicant</Text>
              <Text style={styles.line}>
                Name: {app.fullName || app.applicantName || "—"}
              </Text>
              <Text style={styles.line}>
                Email: {app.email || app.applicantEmail || "—"}
              </Text>
              <Text style={styles.line}>
                Nationality: {app.nationality || app.applicantCountry || "—"}
              </Text>
              {app.phone && (
                <Text style={styles.line}>Phone: {app.phone}</Text>
              )}
            </View>

            {/* Program */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Program details</Text>
              <Text style={styles.line}>
                Program: {app.programName || "—"}
              </Text>
              <Text style={styles.line}>
                Type: {app.programType || "—"}
              </Text>
              {app.campus && (
                <Text style={styles.line}>Campus: {app.campus}</Text>
              )}
            </View>

            {/* Motivation / notes */}
            {(app.motivation || app.notes || app.comments) && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Additional notes</Text>
                {app.motivation && (
                  <Text style={styles.longText}>{app.motivation}</Text>
                )}
                {app.notes && (
                  <Text style={styles.longText}>{app.notes}</Text>
                )}
                {app.comments && (
                  <Text style={styles.longText}>{app.comments}</Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 80 },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  backText: { color: COLORS.primary, fontWeight: "700" },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
  subtitle: { color: COLORS.muted, marginTop: 4, marginBottom: 8 },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.16)",
  },
  badgeText: { color: "#fb923c", fontSize: 12, fontWeight: "700" },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginTop: 10,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontWeight: "800",
    marginBottom: 8,
  },
  line: { color: "#e5e7eb", marginBottom: 4, fontSize: 13 },
  longText: {
    color: "#e5e7eb",
    fontSize: 13,
    lineHeight: 19,
  },
  empty: { color: COLORS.muted, marginTop: 20 },
});
