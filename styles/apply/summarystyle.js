import { StyleSheet } from "react-native";

export const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316",
  cardBg: "rgba(15,23,42,0.9)",
  border: "rgba(148,163,184,0.4)",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
};

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerTitle: {
    color: "#f9fafb",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSubtitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.35)",
    marginBottom: 16,
  },
  infoText: {
    color: COLORS.text,
    fontSize: 12,
  },

  sectionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  rowLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  rowValue: {
    color: COLORS.text,
    fontSize: 13,
    maxWidth: "60%",
    textAlign: "right",
  },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  fileNameText: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 2,
  },

  btnRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  btn: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 14,
  },
  btnGhost: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnGhostText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});

export default styles;