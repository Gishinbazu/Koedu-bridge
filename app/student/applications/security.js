// app/settings/security.js
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { changePassword } from "../../../services/userApi";

export default function SecuritySettingsScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirm) {
      Alert.alert("Missing fields", "Fill all password fields.");
      return;
    }
    if (newPassword !== confirm) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      Alert.alert("Success", "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (e) {
      Alert.alert("Error", e.message || "Unable to change password");
    }
  };

  return (
    <LinearGradient colors={["#050816", "#02010f"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Security & sign-in</Text>
        <Text style={styles.subtitle}>
          Manage your password and sign-in security.
        </Text>

        <View style={styles.card}>
          <Field
            label="Current password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <Field
            label="New password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Field
            label="Confirm new password"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <Pressable
            style={styles.primaryBtn}
            onPress={handleChangePassword}
          >
            <Text style={styles.primaryText}>Update password</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        style={styles.fieldInput}
        placeholderTextColor="rgba(156,163,175,0.9)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 80 },
  title: { color: "#f9fafb", fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#9ca3af", marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: "rgba(15,23,42,0.96)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    padding: 16,
  },
  fieldBlock: { marginBottom: 14 },
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
    color: "#f9fafb",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  primaryBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
  },
  primaryText: { color: "#111827", fontWeight: "800" },
});
