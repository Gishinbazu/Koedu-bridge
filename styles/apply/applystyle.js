import { StyleSheet } from "react-native";

export const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316",
  cardBg: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.4)",
  text: "#F9FAFB",
  textMuted: "#9CA3B8",
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
  },
  backBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 12,
  },

  progressContainer: {
    height: 4,
    backgroundColor: "#1f2937",
    borderRadius: 999,
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    width: "40%",
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },

  cardsGrid: {
    gap: 16,
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  cardText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});

export default styles;