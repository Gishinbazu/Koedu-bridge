// app/admin/applications/index.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { API_BASE_URL } from "../../../services/apiClient";
import { fetchAllApplicationsAdmin } from "../../../services/applicationsApi";

// Palette KOEDU
const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316",
  cardBg: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.4)",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
  badgePending: "#FBBF24",
  badgeReview: "#3B82F6",
  badgeAccepted: "#22C55E",
  badgeRejected: "#EF4444",
};

const STATUS_LABELS = {
  pending: "Pending",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const STATUS_COLORS = {
  pending: COLORS.badgePending,
  in_review: COLORS.badgeReview,
  accepted: COLORS.badgeAccepted,
  rejected: COLORS.badgeRejected,
};

const TYPE_LABELS = {
  language: "Language",
  bachelor: "Bachelor",
  master: "Master",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AdminApplicationsIndex() {
  const router = useRouter();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [exporting, setExporting] = useState(false);

  // ----- ADMIN GUARD -----
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
        console.log("Admin guard (applications) error:", e.message);
        router.replace("/");
      } finally {
        setCheckingAdmin(false);
      }
    })();
  }, [router]);

  // ----- FETCH DES CANDIDATURES -----
  useEffect(() => {
    if (checkingAdmin) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchAllApplicationsAdmin();
        setApplications(res.applications || []);
      } catch (e) {
        console.log("fetchAllApplicationsAdmin error:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [checkingAdmin]);

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();

    return applications
      .filter((app) => {
        if (statusFilter !== "all" && app.status !== statusFilter) return false;
        if (typeFilter !== "all" && app.programType !== typeFilter) return false;

        if (!q) return true;

        const blob = `${app.fullName} ${app.programName} ${app.programId} ${app.email} ${app.nationality}`.toLowerCase();
        return blob.includes(q);
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [applications, search, statusFilter, typeFilter]);

  const handleOpenApplication = (item) => {
    const id = item._id || item.id;
    if (!id) return;
    router.push(`/admin/applications/${id}`);
  };

  // ----- EXPORT CSV -----
  const handleExportCSV = async () => {
    try {
      setExporting(true);

      const token = await AsyncStorage.getItem("koedu_token");
      if (!token) {
        alert("Please log in again as admin.");
        return;
      }

      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("programType", typeFilter);
      if (search.trim()) params.append("search", search.trim());

      const url = `${API_BASE_URL}/api/admin/applications/export?${params.toString()}`;

      if (Platform.OS === "web") {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Export failed: HTTP ${res.status}`);
        }

        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "koedu-applications.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        // Mobile / native : on appelle l'export, et on informe l'admin
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Export failed: HTTP ${res.status}`);
        }

        alert(
          "Export generated.\nFor now, please open the admin dashboard in a web browser to download the file."
        );
      }
    } catch (err) {
      console.log("Export CSV error:", err);
      alert(err.message || "Failed to export applications.");
    } finally {
      setExporting(false);
    }
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
            {/* 🔙 Bouton arrière */}
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
              name="folder-open-outline"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />
            <View>
              <Text style={styles.headerTitle}>Applications dashboard</Text>
              <Text style={styles.headerSubtitle}>
                {applications.length} application
                {applications.length > 1 ? "s" : ""} (live)
              </Text>
            </View>
          </View>

          {/* 🔁 Bouton pour aller au dashboard admin */}
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* CARD : FILTRES / SEARCH */}
          <View style={styles.filtersCard}>
            {/* SEARCH */}
            <View style={styles.searchRow}>
              <Ionicons
                name="search"
                size={18}
                color="rgba(148,163,184,0.9)"
                style={{ marginRight: 6 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, program, email…"
                placeholderTextColor="rgba(148,163,184,0.8)"
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
            </View>

            {/* FILTERS */}
            <View style={styles.filtersRow}>
              <FilterGroup
                label="Status"
                options={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "in_review", label: "In review" },
                  { value: "accepted", label: "Accepted" },
                  { value: "rejected", label: "Rejected" },
                ]}
                active={statusFilter}
                onChange={setStatusFilter}
              />
              <FilterGroup
                label="Program type"
                options={[
                  { value: "all", label: "All" },
                  { value: "language", label: "Language" },
                  { value: "bachelor", label: "Bachelor" },
                  { value: "master", label: "Master" },
                ]}
                active={typeFilter}
                onChange={setTypeFilter}
              />
            </View>
          </View>

          {/* LISTE DES APPLICATIONS */}
          <View style={styles.listCard}>
            <View style={styles.listHeader}>
              <View>
                <Text style={styles.listTitle}>Recent applications</Text>
                <Text style={styles.listCount}>
                  {filteredApplications.length} result
                  {filteredApplications.length > 1 ? "s" : ""}
                </Text>
              </View>

              <Pressable
                onPress={handleExportCSV}
                disabled={exporting}
                style={({ pressed }) => [
                  styles.exportButton,
                  pressed && { opacity: 0.8 },
                  exporting && { opacity: 0.6 },
                ]}
              >
                <Ionicons
                  name="download-outline"
                  size={16}
                  color={COLORS.text}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.exportButtonText}>
                  {exporting ? "Exporting..." : "Export CSV"}
                </Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.emptyText}>Loading applications...</Text>
              </View>
            ) : filteredApplications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={COLORS.textMuted}
                />
                <Text style={styles.emptyTitle}>No applications found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting filters or search terms.
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredApplications}
                keyExtractor={(item) => item._id || item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleOpenApplication(item)}
                    style={({ pressed }) => [
                      styles.appRow,
                      pressed && { backgroundColor: "rgba(15,23,42,0.9)" },
                    ]}
                  >
                    {/* LEFT : Nom + Programme */}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.appName}>{item.fullName}</Text>
                      <Text style={styles.appProgram} numberOfLines={1}>
                        {TYPE_LABELS[item.programType] || "Program"} ·{" "}
                        {item.programName}
                      </Text>
                      <Text style={styles.appMeta} numberOfLines={1}>
                        {item.nationality} · {item.email}
                      </Text>
                    </View>

                    {/* RIGHT : date + status + chevron */}
                    <View style={styles.appRight}>
                      <Text style={styles.dateText}>
                        {formatDate(item.createdAt)}
                      </Text>
                      <StatusBadge status={item.status} />
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={COLORS.textMuted}
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  </Pressable>
                )}
              />
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ───────── Small components ───────── */

function FilterGroup({ label, options, active, onChange }) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.filterChipsRow}>
        {options.map((opt) => {
          const isActive = opt.value === active;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive && styles.chipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status || "Unknown";
  const color = STATUS_COLORS[status] || COLORS.textMuted;
  return (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

/* ───────── Styles ───────── */

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

  filtersCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  filterGroup: {
    flex: 1,
    minWidth: 140,
  },
  filterLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  filterChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    backgroundColor: "#020617",
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#111827",
    fontWeight: "800",
  },

  listCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  listTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  listCount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },

  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(15,23,42,0.95)",
  },
  exportButtonText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
  },

  appRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(30,64,175,0.4)",
    marginHorizontal: 6,
  },
  appName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  appProgram: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  appMeta: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  appRight: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    color: "#111827",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 4,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
    maxWidth: 260,
  },
});

