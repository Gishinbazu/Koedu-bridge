// app/settings/notifications.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

export default function NotificationSettingsScreen() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [appNotifs, setAppNotifs] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("koedu_notifications");
        if (!raw) return;
        const saved = JSON.parse(raw);
        setEmailNotifs(saved.email ?? true);
        setSmsNotifs(saved.sms ?? false);
        setAppNotifs(saved.app ?? true);
      } catch (e) {
        console.log("Notif load error", e);
      }
    })();
  }, []);

  const persist = async (next) => {
    try {
      await AsyncStorage.setItem("koedu_notifications", JSON.stringify(next));
    } catch (e) {
      console.log("Notif save error", e);
    }
  };

  const toggleEmail = () => {
    const next = { email: !emailNotifs, sms: smsNotifs, app: appNotifs };
    setEmailNotifs(next.email);
    persist(next);
  };
  const toggleSms = () => {
    const next = { email: emailNotifs, sms: !smsNotifs, app: appNotifs };
    setSmsNotifs(next.sms);
    persist(next);
  };
  const toggleApp = () => {
    const next = { email: emailNotifs, sms: smsNotifs, app: !appNotifs };
    setAppNotifs(next.app);
    persist(next);
  };

  return (
    <LinearGradient colors={["#050816", "#02010f"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Choose how KOEDU Bridge keeps you informed about your application.
        </Text>

        <NotifRow
          label="Email updates"
          description="Receive email updates about your applications and deadlines."
          value={emailNotifs}
          onValueChange={toggleEmail}
        />
        <NotifRow
          label="SMS alerts"
          description="Receive SMS reminders for important dates."
          value={smsNotifs}
          onValueChange={toggleSms}
        />
        <NotifRow
          label="In-app notifications"
          description="Get notifications inside KOEDU Bridge app."
          value={appNotifs}
          onValueChange={toggleApp}
        />
      </ScrollView>
    </LinearGradient>
  );
}

function NotifRow({ label, description, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 80 },

  title: { color: "#f9fafb", fontSize: 26, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: "#9ca3af", fontSize: 14, marginBottom: 18 },

  row: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: { color: "#f9fafb", fontSize: 15, fontWeight: "700" },
  rowDesc: { color: "#9ca3af", fontSize: 12, marginTop: 4 },
});
