import { Platform, StyleSheet } from "react-native";

// Palette KOEDU
export const COLORS = {
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

export const STATUS_LABELS = {
  pending: "Pending",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const STATUS_COLORS = {
  pending: COLORS.badgePending,
  in_review: COLORS.badgeReview,
  accepted: COLORS.badgeAccepted,
  rejected: COLORS.badgeRejected,
};

export const TYPE_LABELS = {
  language: "Language",
  bachelor: "Bachelor",
  master: "Master",
};

/**
 * Formats an ISO date string into DD/MM/YYYY format.
 * @param {string} dateStr The date string to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// -----------------------------------------------------------
// Stylesheet (toutes les références aux COLORS sont maintenant résolues localement)
// -----------------------------------------------------------

export const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === "android" ? 40 : 10,
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitleWrap: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "rgba(148,163,184,0.5)",
        backgroundColor: "rgba(15,23,42,0.9)",
        marginRight: 10,
    },
    backText: {
        color: COLORS.text,
        fontSize: 12,
        marginLeft: 4,
        fontWeight: "600",
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: "800",
    },
    headerSubtitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
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