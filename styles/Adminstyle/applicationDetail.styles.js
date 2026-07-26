import { Platform, StyleSheet } from "react-native";

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
  draft: "Draft",
  pending: "Pending",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const STATUS_COLORS = {
  draft: "rgba(148,163,184,0.6)",
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

export const styles = StyleSheet.create({
  // General Containers
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: 8,
  },
  errorTitle: {
    color: COLORS.text,
    marginTop: 10,
    fontWeight: "800",
  },
  errorText: {
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: "center",
  },
  goBackButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  goBackButtonText: {
    color: "#0b1120",
    fontWeight: "900",
  },

  // Header
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

  // Card
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  // Status Section
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  statusLabelText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: "right", // Added for consistency with dates
  },
  statusActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // Info Row (Details)
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 12,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    flex: 1,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 13,
    flex: 2,
    textAlign: "right",
  },
  detailGroupTitle: {
    color: COLORS.text,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 6,
  },

  // Application Status Card
  statusTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.25)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  progressText: {
    color: COLORS.textMuted,
    marginTop: 8,
    fontSize: 12,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timelineText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  // Application Summary Card
  summaryNote: {
    color: COLORS.primary,
    marginTop: 10,
    fontWeight: "800",
    fontSize: 12,
  },

  // Documents Section
  documentItem: {
  marginTop: 10,
  padding: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.25)",
},

  documentLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  longText: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  imageWrap: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(2,6,23,0.7)",
  },
  image: {
    width: "100%",
    height: 220,
  },
  fileButton: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(2,6,23,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileButtonText: {
    color: COLORS.primary,
    fontWeight: "900",
  },
  urlTiny: {
    color: "rgba(148,163,184,0.8)",
    fontSize: 10,
    marginTop: 6,
  },

  // Missing URL block
  missingWrap: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.35)",
    backgroundColor: "rgba(249,115,22,0.08)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  missingTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  missingName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  missingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.45)",
  },
  missingBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  documentPressable: {
  marginTop: 8,
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.3)",
},

fileRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

});