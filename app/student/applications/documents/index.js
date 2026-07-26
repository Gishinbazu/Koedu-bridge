// app/student/applications/documents/index.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getStudentDocuments } from "../../../../services/userApi";

const COLORS = {
  bg: "#050816",
  card: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.3)",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  primary: "#F97316",
};

export default function StudentDocumentsScreen() {
  const router = useRouter();
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getStudentDocuments();
        setDocs(res?.documents || {});
      } catch (e) {
        console.log("getStudentDocuments error:", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const DOC_DEFS = [
    { key: "passport", label: "Passport" },
    { key: "diploma", label: "High school diploma" },
    { key: "bankStatement", label: "Bank statement" },
    { key: "photo", label: "ID Photo" },
  ];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.muted, marginTop: 8 }}>
          Loading documents...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="arrow-back-outline" size={18} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View>
          <Text style={styles.title}>My documents</Text>
          <Text style={styles.subtitle}>
            Upload or update the files required for your application
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        {DOC_DEFS.map((doc) => {
          const info = docs?.[doc.key];
          const uploaded = !!info?.uploaded;
          const verified = !!info?.verified;
          const errorMessage = info?.errorMessage;

          return (
            <Pressable
              key={doc.key}
              onPress={() =>
                router.push(`/student/applications/documents/${doc.key}`)
              }
              style={({ pressed }) => [
                styles.docRow,
                pressed && { opacity: 0.8 },
              ]}
            >
              <View>
                <Text style={styles.docLabel}>{doc.label}</Text>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                  <Text
                    style={[
                      styles.badge,
                      {
                        backgroundColor: uploaded
                          ? "rgba(74,222,128,0.15)"
                          : "rgba(248,113,113,0.12)",
                        color: uploaded ? "#4ade80" : "#f97373",
                      },
                    ]}
                  >
                    {uploaded ? "Uploaded" : "Missing"}
                  </Text>
                  {verified && (
                    <Text
                      style={[
                        styles.badge,
                        {
                          backgroundColor: "rgba(59,130,246,0.15)",
                          color: "#60a5fa",
                        },
                      ]}
                    >
                      Verified
                    </Text>
                  )}
                  {errorMessage && (
                    <Text
                      style={[
                        styles.badge,
                        {
                          backgroundColor: "rgba(248,113,113,0.15)",
                          color: "#fca5a5",
                        },
                      ]}
                    >
                      Needs re-upload
                    </Text>
                  )}
                </View>
                {errorMessage && (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                )}
              </View>

              <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    paddingTop: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: { color: COLORS.text, fontSize: 12 },
  title: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  subtitle: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  docRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(31,41,55,0.9)",
  },
  docLabel: { color: COLORS.text, fontSize: 14, fontWeight: "600" },
  badge: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  errorText: {
    marginTop: 4,
    color: "#fca5a5",
    fontSize: 11,
  },
});
