// app/settings/notifications.js
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import {
    getSettings,
    updateNotificationSettings,
} from "../services/settingsApi";

export default function NotificationSettingsScreen() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        if (s.notifications) {
          setEmailUpdates(!!s.notifications.emailUpdates);
          setSmsUpdates(!!s.notifications.smsUpdates);
          setMarketing(!!s.notifications.marketing);
        }
      } catch {}
    })();
  }, []);

  const handleSave = async () => {
    try {
      await updateNotificationSettings({
        emailUpdates,
        smsUpdates,
        marketing,
      });
      Alert.alert("Saved", "Notification preferences updated.");
    } catch (e) {
      Alert.alert("Error", e.message || "Unable to save");
    }
  };

  return (
    <LinearGradient colors={["#050816", "#02010f"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Choose how KOEDU Bridge contacts you.
        </Text>

        <View style={styles.card}>
          <RowSwitch
            label="Application updates by email"
            value={emailUpdates}
            onValueChange={setEmailUpdates}
          />
          <RowSwitch
            label="Important alerts by SMS"
            value={smsUpdates}
            onValueChange={setSmsUpdates}
          />
          <RowSwitch
            label="KOEDU tips & marketing"
            value={marketing}
            onValueChange={setMarketing}
          />

          <Pressable style={styles.primaryBtn} onPress={handleSave}>
            <Text style={styles.primaryText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function RowSwitch({ label, ...props }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch {...props} />
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rowLabel: { color: "#e5e7eb", fontSize: 14 },
  primaryBtn: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
  },
  primaryText: { color: "#111827", fontWeight: "800" },
});
