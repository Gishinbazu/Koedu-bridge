// styles/student/dashboard.styles.js
import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#050816",
  card: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.25)",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  primary: "#F97316",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  // Conteneur pour BackButton + Welcome
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Conteneur des actions (Déconnexion)
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  welcome: {
    fontSize: 16,
    color: COLORS.muted,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },

  // =============== LAYOUT PRINCIPAL ===============
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sideNav: {
    width: 180,
    marginRight: 12,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sideNavTitle: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  sideNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "rgba(15,23,42,0.8)",
  },
  sideNavBtnText: {
    marginLeft: 8,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  mainColumn: {
    flex: 1,
  },

  // =============== CARTES ===============
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardTitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 10,
  },

  /* Status */
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  statusText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },

  progressBar: {
    height: 7,
    borderRadius: 20,
    backgroundColor: "rgba(148,163,184,0.2)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },

  progressLabel: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },

  /* Summary */
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryLabel: {
    color: COLORS.muted,
    fontSize: 13,
  },

  summaryValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  /* Documents */
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  documentName: {
    color: COLORS.text,
    fontSize: 14,
  },

  documentStatus: {
    fontWeight: "700",
    fontSize: 14,
  },

  /* Notifications */
  notification: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  notificationText: {
    color: COLORS.text,
    fontSize: 13,
  },

  noNotif: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },

  /* Quick Actions (en bas) */
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },

  actionLabel: {
    marginTop: 6,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },

  linkBtn: {
    marginTop: 12,
  },

  linkText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  /* Timeline */
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "transparent",
  },
  timelineLabel: {
    color: COLORS.muted,
    fontSize: 13,
  },

  // Application details (données du formulaire)
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailsLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
  detailsValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default styles;
