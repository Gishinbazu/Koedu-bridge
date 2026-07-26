// app/student/profile.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../../services/userApi"; // 👈 adapte le chemin si besoin

const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  card: "rgba(15,23,42,0.96)",
  border: "rgba(148,163,184,0.4)",
  text: "#f9fafb",
  muted: "#9ca3af",
  primary: "#f97316",
};

export default function StudentProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // 🔹 Chargement depuis /api/student/profile (via userApi)
  useEffect(() => {
    (async () => {
      try {
        const res = await getStudentProfile();
        const p = res?.profile || res || {};

        setFullName(p.fullName || p.name || "");
        setUsername(p.username || "");
        setEmail(p.email || "");
        setPhone(p.phone || "");
        setCountry(p.country || "");
        setNationality(p.nationality || "");
        setDateOfBirth(p.dateOfBirth || "");
      } catch (e) {
        console.log("getStudentProfile error:", e.message);
        Alert.alert("Error", e.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateStudentProfile({
        fullName,
        username,
        email,
        phone,
        country,
        nationality,
        dateOfBirth,
      });
      Alert.alert("Saved", "Your information has been updated.");
    } catch (e) {
      console.log("updateStudentProfile error:", e.message);
      Alert.alert("Error", e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Écran de chargement
  if (loading) {
    return (
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.muted, marginTop: 8 }}>
          Loading profile...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header avec retour */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Ionicons name="arrow-back-outline" size={18} color={COLORS.text} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View>
            <Text style={styles.title}>My Information</Text>
            <Text style={styles.subtitle}>
              Update your personal details used for KOEDU applications.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Field
            label="Full name (as in passport)"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
          />
          <Field
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Your username"
          />
          <Field
            label="Email"
            value={email}
            editable={false}
            placeholder="Email"
          />
          <Field
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+82..."
            keyboardType="phone-pad"
          />
          <Field
            label="Country / Location"
            value={country}
            onChangeText={setCountry}
            placeholder="Ex: Korea, DR Congo..."
          />
          <Field
            label="Nationality"
            value={nationality}
            onChangeText={setNationality}
            placeholder="Ex: DR Congo, Nigeria..."
          />
          <Field
            label="Date of birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
          />

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.9 },
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.primaryText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...inputProps}
        style={styles.fieldInput}
        placeholderTextColor="rgba(148,163,184,0.8)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: 80,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
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
    marginTop: 4,
  },
  backText: {
    color: COLORS.text,
    fontSize: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 4,
    marginBottom: 4,
    fontSize: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: "#e5e7eb",
    marginBottom: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  fieldInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(55,65,81,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.text,
    backgroundColor: "rgba(15,23,42,0.9)",
    fontSize: 13,
  },
  primaryBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  primaryText: {
    color: "#111827",
    fontWeight: "800",
  },
});
