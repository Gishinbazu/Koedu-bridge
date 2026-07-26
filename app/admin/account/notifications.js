// app/admin/account/notifications.js
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

export default function AdminNotificationsScreen() {
  const router = useRouter();
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const [emailNewApp, setEmailNewApp] = useState(true);
  const [emailStatusChange, setEmailStatusChange] = useState(true);
  const [emailWeeklySummary, setEmailWeeklySummary] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(true);

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
        console.log("Admin guard (notifications) error:", e.message);
        router.replace("/");
      } finally {
        setCheckingAdmin(false);
      }
    })();
  }, [router]);

  const handleSave = () => {
    // Plug backend plus tard
    alert("Notification preferences saved locally (connect API later).");
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
              name="notifications-outline"
              size={22}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />
            <View>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSubtitle}>
                Configure email & in-app alerts
              </Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Email notifications</Text>

            <SwitchRow
              title="New applications"
              subtitle="Receive an email when a new student submits an application."
              value={emailNewApp}
              onValueChange={setEmailNewApp}
            />
            <SwitchRow
              title="Status changes"
              subtitle="Get notified when an application is accepted, rejected or updated."
              value={emailStatusChange}
              onValueChange={setEmailStatusChange}
            />
            <SwitchRow
              title="Weekly summary"
              subtitle="Receive a weekly recap of applications and key metrics."
              value={emailWeeklySummary}
              onValueChange={setEmailWeeklySummary}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>In-app notifications</Text>

            <SwitchRow
              title="Enable in-app alerts"
              subtitle="Display a small banner inside the admin dashboard when something important happens."
              value={inAppAlerts}
              onValueChange={setInAppAlerts}
            />
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save preferences</Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function SwitchRow({ title, subtitle, ...props }) {
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.switchTitle}>{title}</Text>
        <Text style={styles.switchSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        thumbColor={props.value ? COLORS.primary : "#e5e7eb"}
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
  switchRow: {
    marginTop: 10,
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
  saveButton: {
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
});
