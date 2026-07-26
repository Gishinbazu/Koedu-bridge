// app/admin/settings/index.js
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

export default function AdminSettingsHome() {
  const router = useRouter();
  const [checkingAdmin, setCheckingAdmin] = useState(true);

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
        console.log("Admin guard (settings) error:", e.message);
        router.replace("/");
      } finally {
        setCheckingAdmin(false);
      }
    })();
  }, [router]);

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
            {/* Back */}
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
              name="settings-outline"
              size={22}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />
            <View>
              <Text style={styles.headerTitle}>Admin settings</Text>
              <Text style={styles.headerSubtitle}>
                Manage your profile, security and preferences
              </Text>
            </View>
          </View>

          <View style={styles.headerActionsRow}>
            <Pressable
              onPress={() => router.push("/admin/dashboard")}
              style={({ pressed }) => [
                styles.dashboardButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons
                name="speedometer-outline"
                size={16}
                color="#0b1120"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.dashboardButtonText}>Go to dashboard</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Cards de sections */}
          <SettingCard
            icon="person-circle-outline"
            title="My informations"
            subtitle="Name, email, phone and organization details"
            onPress={() => router.push("/admin/settings/my-info")}
          />

          <SettingCard
            icon="lock-closed-outline"
            title="Security & sign-in"
            subtitle="Password, sessions and sign-in methods"
            onPress={() => router.push("/admin/settings/security")}
          />

          <SettingCard
            icon="notifications-outline"
            title="Notifications"
            subtitle="Email and in-app alerts for applications"
            onPress={() => router.push("/admin/settings/notifications")}
          />

          <SettingCard
            icon="globe-outline"
            title="Country/Region & Language"
            subtitle="Locale, timezone and interface language"
            onPress={() => router.push("/admin/settings/region-language")}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function SettingCard({ icon, title, subtitle, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { backgroundColor: "rgba(15,23,42,0.98)" },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={20} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textMuted}
        />
      </View>
    </Pressable>
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
  headerActionsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dashboardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  dashboardButtonText: {
    color: "#0b1120",
    fontSize: 12,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
