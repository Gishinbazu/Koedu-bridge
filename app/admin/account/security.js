// app/admin/account/security.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316",
  cardBg: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.4)",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
};

export default function AdminSecurityScreen() {
  const router = useRouter();
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [requireTwoFactor, setRequireTwoFactor] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("koedu_user");
        if (!raw) {
          router.replace("/auth/login");
          return;
        }
        const u = JSON.parse(raw);
        if (!u || u.role !== "admin") {
          router.replace("/");
          return;
        }
      } catch (e) {
        console.log("Admin guard (security) error:", e.message);
        router.replace("/");
      } finally {
        setCheckingAdmin(false);
      }
    })();
  }, [router]);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    // Plug backend plus tard
    alert("Password change submitted (connect API later).");
  };

  if (checkingAdmin) {
    return (
      <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: COLORS.textMuted, marginTop: 8 }}>
            Checking admin access...
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons
                name="arrow-back-outline"
                size={18}
                color={COLORS.text}
              />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>

            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />
            <View>
              <Text style={styles.headerTitle}>Security & sign-in</Text>
              <Text style={styles.headerSubtitle}>
                Protect your KOEDU Bridge admin account
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Change password */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Change password</Text>

            <LabeledInput
              label="Current password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <LabeledInput
              label="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <LabeledInput
              label="Confirm new password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Pressable
              style={styles.saveButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.saveButtonText}>Update password</Text>
            </Pressable>
          </View>

          {/* Sign-in options */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sign-in options</Text>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Require 2-step verification</Text>
                <Text style={styles.switchSubtitle}>
                  Ask for a verification code when signing in on a new device.
                </Text>
              </View>
              <Switch
                value={requireTwoFactor}
                onValueChange={setRequireTwoFactor}
                thumbColor={requireTwoFactor ? COLORS.primary : "#e5e7eb"}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function LabeledInput({ label, ...props }) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="rgba(148,163,184,0.9)"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    marginRight: 8,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  inputBlock: {
    marginBottom: 14,
  },
  inputLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#020617",
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: COLORS.text,
    fontSize: 13,
  },
  saveButton: {
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#0b1120",
    fontSize: 13,
    fontWeight: "800",
  },
  switchRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  switchSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
