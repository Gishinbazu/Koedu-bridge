// --- KOEDU THEME CONSTANTS ---
const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316", // KOEDU Orange
  cardBg: "rgba(30, 41, 59, 0.7)",
  border: "rgba(249, 115, 22, 0.3)",
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  inputBg: "#0F172A",
  success: "#10B981",
  error: "#EF4444",
};

import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: { flex: 1 },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 14,
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSubtitle: {
    color: COLORS.primary,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  scrollContent: { padding: 20, paddingBottom: 100 },

  progressContainer: {
    height: 6,
    backgroundColor: "#334155",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  stepText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 20,
    textAlign: "right",
  },

  errorBox: {
    backgroundColor: "rgba(239,68,68,0.15)",
    borderColor: COLORS.error,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  sectionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  helperText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 12,
    fontStyle: "italic",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 15,
    marginBottom: 12,
    height: 50,
  },
  input: { flex: 1, color: "#fff", height: "100%" },
  inputText: { flex: 1, color: "#fff" },
  row: { flexDirection: "row", justifyContent: "space-between" },

  webDateInput: {
    width: "100%",
    height: 48,
    borderWidth: 0,
    outlineWidth: 0,
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: 14,
    fontFamily: Platform.OS === "web" ? "inherit" : undefined,
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleActive: { backgroundColor: "#334155" },
  toggleText: { color: "#64748B", fontWeight: "600", fontSize: 13 },
  toggleTextActive: { color: "#fff", fontWeight: "700" },
  conditionalBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.3)",
  },
  alertRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  alertText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  uploadLabel: { color: "#E2E8F0", fontWeight: "600", fontSize: 13 },
  reqBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  reqText: { fontSize: 8, fontWeight: "900", color: "#111" },
  uploadSubText: { color: "#64748B", fontSize: 11, marginTop: 2 },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  uploadBtnText: { color: "#111", fontWeight: "700", fontSize: 12 },
  deleteBtn: {
    padding: 8,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 8,
  },

  submitBtn: {
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  gradientBtn: {
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  submitText: {
    color: "#111",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  countryItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countryText: { color: "#CBD5E1", fontSize: 16 },

  iosDatePickerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#0F172A",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
});

export { COLORS, styles };
