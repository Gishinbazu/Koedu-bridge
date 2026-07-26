// app/settings/account.js
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getSettings, updateAccountSettings } from "../../../services/userApi";

export default function AccountSettingsScreen() {
  const [displayName, setDisplayName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        setDisplayName(s.displayName || "");
        setTimezone(s.timezone || "");
      } catch (e) {
        console.log("getSettings error", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      await updateAccountSettings({ displayName, timezone });
      Alert.alert("Saved", "Account settings updated.");
    } catch (e) {
      Alert.alert("Error", e.message || "Unable to save");
    }
  };

  return (
    <LinearGradient colors={["#050816", "#02010f"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Account Settings</Text>
        <Text style={styles.subtitle}>
          Basic preferences used across KOEDU Bridge.
        </Text>

        <View style={styles.card}>
          <LabelField
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <LabelField
            label="Time zone"
            value={timezone}
            onChangeText={setTimezone}
            placeholder="Asia/Seoul"
          />

          <Pressable style={styles.primaryBtn} onPress={handleSave}>
            <Text style={styles.primaryText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function LabelField({ label, ...props }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        style={styles.fieldInput}
        placeholderTextColor="rgba(148,163,184,0.85)"
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
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
  },
  primaryText: {
    color: "#111827",
    fontWeight: "800",
  },
});
