// app/admin/dashboard.js
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

import AdminAccountMenu from "../../components/AdminAccountMenu";
import { apiFetch } from "../../services/apiClient";

const COLORS = {
  // Primary Backgrounds
  bgStart: "#050816",
  bgEnd: "#02010f",
  // Primary/Accent
  primary: "#F97316", // Tailwind orange-500
  primaryDark: "#EA580C", // Tailwind orange-600
  // Card/Container Backgrounds
  cardBg: "rgba(15,23,42,0.95)",
  cardBgHover: "rgba(30,41,59,0.9)",
  // Borders
  border: "rgba(148,163,184,0.2)",
  // Text
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
  // Badge Colors
  badgePending: "#FBBF24",
  badgeReview: "#3B82F6",
  badgeAccepted: "#22C55E",
  badgeRejected: "#EF4444",
  badgeText: "#000000",
};

export default function AdminDashboardScreen() {
  const router = useRouter();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

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
        setAdminUser(u);

        // Charger metrics
        const res = await apiFetch("/api/admin/metrics", {
          method: "GET",
        });
        setMetrics(res);
      } catch (e) {
        console.log("Admin dashboard load error:", e.message);
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    })();
  }, [router]);

  if (checkingAdmin) {
    return (
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={{ flex: 1 }}
      >
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

  const total = metrics?.totalApplications || 0;
  const byStatus = metrics?.byStatus || {};
  const byType = metrics?.byType || {};
  const last7Days = metrics?.last7Days || 0;

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.headerTitle}>Admin Dashboard</Text>
              <Text style={styles.headerSubtitle}>
                Hello {adminUser?.username || "Admin"} 👋
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* QUICK ACTIONS (GRILLE 4 BOUTONS) */}
          <Text style={styles.sectionTitleHeader}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <QuickAction
              icon="folder-open-outline"
              label="Applications"
              description="View and filter all applications."
              onPress={() => router.push("/admin/applications")}
            />
            <QuickAction
              icon="school-outline"
              label="Programs"
              description="Add, edit, or remove programs."
              onPress={() => router.push("/programs")}
            />
            <QuickAction
              icon="stats-chart-outline"
              label="Edit Statistics"
              description="Manage homepage stats & numbers."
              onPress={() => router.push("/admin/edit-stats")}
            />
            <QuickAction
              icon="time-outline"
              label="Pending Review"
              description="Jump straight to pending applications."
              onPress={() => router.push("/admin/applications?status=pending")}
            />
          </View>

          {/* KPI CARDS */}
          <View style={styles.cardRow}>
            <KpiCard
              icon="people-outline"
              label="Total Applications"
              value={total}
              subtitle="All time submissions"
            />
            <KpiCard
              icon="trending-up-outline"
              label="New Submissions"
              value={last7Days}
              subtitle="In the last 7 days"
            />
          </View>

          {/* Status breakdown */}
          <View style={styles.fullCard}>
            <Text style={styles.sectionTitle}>
              Application Status Breakdown
            </Text>
            <View style={styles.badgeRow}>
              <StatusStat
                label="Pending"
                color={COLORS.badgePending}
                value={byStatus.pending || 0}
              />
              <StatusStat
                label="In review"
                color={COLORS.badgeReview}
                value={byStatus.in_review || 0}
              />
              <StatusStat
                label="Accepted"
                color={COLORS.badgeAccepted}
                value={byStatus.accepted || 0}
              />
              <StatusStat
                label="Rejected"
                color={COLORS.badgeRejected}
                value={byStatus.rejected || 0}
              />
            </View>
          </View>

          {/* Type breakdown */}
          <View style={styles.fullCard}>
            <Text style={styles.sectionTitle}>Breakdown by Program Type</Text>
            <View style={styles.badgeRow}>
              <TypeStat label="Language" value={byType.language || 0} />
              <TypeStat label="Bachelor" value={byType.bachelor || 0} />
              <TypeStat label="Master" value={byType.master || 0} />
            </View>
          </View>

          {/* Account & Settings Menu Component */}
          <View style={styles.fullCard}>
            <Text style={styles.sectionTitle}>Account & Settings</Text>
            <AdminAccountMenu showDashboardLink={false} />
          </View>

          {loading && (
            <View
              style={{ alignItems: "center", marginTop: 16, marginBottom: 12 }}
            >
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text
                style={{ color: COLORS.textMuted, marginTop: 4, fontSize: 12 }}
              >
                Refreshing stats...
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function QuickAction({ icon, label, description, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCard,
        pressed && { backgroundColor: COLORS.cardBgHover },
      ]}
    >
      <Ionicons name={icon} size={24} color={COLORS.primary} />
      <Text style={styles.quickLabel}>{label}</Text>
      <Text style={styles.quickDesc}>{description}</Text>
    </Pressable>
  );
}

function KpiCard({ icon, label, value, subtitle }) {
  return (
    <View style={styles.kpiCard}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <Text style={styles.kpiLabel}>{label}</Text>
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiSubtitle}>{subtitle}</Text>
    </View>
  );
}

function StatusStat({ label, value, color }) {
  return (
    <View style={[styles.statusPill, { backgroundColor: color }]}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
}

function TypeStat({ label, value }) {
  return (
    <View style={styles.typePill}>
      <Text style={styles.typeLabel}>{label}</Text>
      <Text style={styles.typeValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitleHeader: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  // --- Quick Actions Grid ---
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  quickCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
  },
  quickDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  // --- KPI Cards ---
  cardRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kpiLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  kpiValue: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 4,
  },
  kpiSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 4,
  },
  // --- Full Cards (Status/Type) ---
  fullCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  // --- Status Pills ---
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 120,
    flex: 1,
  },
  statusLabel: {
    color: COLORS.badgeText,
    fontSize: 13,
    fontWeight: "700",
  },
  statusValue: {
    color: COLORS.badgeText,
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 10,
  },
  // --- Type Pills ---
  typePill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(2, 6, 23, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 140,
    flex: 1,
  },
  typeLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  typeValue: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 10,
  },
});
