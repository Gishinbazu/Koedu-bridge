// app/student/applications/documents/[doc].js
import { Ionicons } from "@expo/vector-icons";
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
import {
    getStudentDocuments,
    updateStudentDocument,
} from "../../../../services/userApi";

const COLORS = {
  bg: "#050816",
  card: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.3)",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  primary: "#F97316",
};

const DOC_LABELS = {
  passport: "Passport",
  diploma: "High school diploma",
  bankStatement: "Bank statement",
  photo: "ID Photo",
};

export default function StudentDocumentDetailScreen() {
  const router = useRouter();
  const { doc } = useLocalSearchParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const label = DOC_LABELS[doc] || "Document";

  useEffect(() => {
    (async () => {
      try {
        const res = await getStudentDocuments();
        setInfo(res?.documents?.[doc] || {});
      } catch (e) {
        console.log("getStudentDocuments error:", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [doc]);

  const handleMarkUploaded = async () => {
    setSaving(true);
    try {
      const res = await updateStudentDocument(doc, { uploaded: true });
      setInfo(res?.document || { ...(info || {}), uploaded: true });
    } catch (e) {
      console.log("updateStudentDocument error:", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.muted, marginTop: 8 }}>
          Loading document...
        </Text>
      </View>
    );
  }

  const uploaded = !!info?.uploaded;
  const verified = !!info?.verified;
  const errorMessage = info?.errorMessage;

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
          <Text style={styles.title}>{label}</Text>
          <Text style={styles.subtitle}>
            Manage this document for your application
          </Text>
        </View>
      </View>

      {/* STATUS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <Badge
            text={uploaded ? "Uploaded" : "Missing"}
            color={uploaded ? "#4ade80" : "#f97373"}
            bg={uploaded ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.12)"}
          />
          {verified && (
            <Badge
              text="Verified"
              color="#60a5fa"
              bg="rgba(59,130,246,0.15)"
            />
          )}
          {errorMessage && (
            <Badge
              text="Needs re-upload"
              color="#fca5a5"
              bg="rgba(248,113,113,0.15)"
            />
          )}
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <Text style={styles.infoText}>
            If your admin requires a better quality or updated version of this
            document, you will see a message here.
          </Text>
        )}
      </View>

      {/* ACTIONS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Actions</Text>

        <Text style={styles.infoText}>
          In a future version, this screen will allow you to upload an image or
          PDF from your phone. For now, you can mark the document as uploaded
          when you have sent it to KOEDU Bridge.
        </Text>

        <Pressable
          onPress={handleMarkUploaded}
          disabled={saving}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name="cloud-upload-outline" size={18} color="#0f172a" />
          <Text style={styles.primaryBtnText}>
            {saving
              ? "Saving..."
              : uploaded
              ? "Mark as re-uploaded"
              : "Mark as uploaded"}
          </Text>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Badge({ text, color, bg }) {
  return (
    <Text
      style={{
        fontSize: 11,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: bg,
        color,
      }}
    >
      {text}
    </Text>
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
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 10,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 12,
    lineHeight: 18,
  },
  infoText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  primaryBtn: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
  },
  primaryBtnText: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "700",
  },
});
