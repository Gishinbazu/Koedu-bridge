import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  navWrap: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "web" ? 8 : 4,
    paddingBottom: 8,
    borderBottomWidth: Platform.OS === "web" ? StyleSheet.hairlineWidth : 0,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  navWrapWebFixed: {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  fullBleed:
    Platform.OS === "web"
      ? { width: "100vw", marginLeft: "calc(50% - 50vw)" }
      : {},
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1200,
    width: "100%",
    marginHorizontal: "auto",
  },
  logoContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  brand: { fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },

  linksRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  linkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
  },
  linkHover: { backgroundColor: "rgba(255,255,255,0.08)" },
  linkActive: { backgroundColor: "rgba(255,255,255,0.16)" },
  linkText: { fontSize: 15, fontWeight: "700" },
  linkPill: { flexDirection: "row", alignItems: "center", gap: 6 },
  activeDot: { width: 6, height: 6, borderRadius: 3 },

  hamBtn: { padding: 6, borderRadius: 8 },

  mobileMenu: {
    position: "absolute",
    top: 56 + 12, // NAV_HEIGHT + 12
    right: 12,
    left: 12,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  mobileItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mobileLink: { fontSize: 17, fontWeight: "700" },
  mobileDivider: { height: 1, marginVertical: 8 },

  // user menu desktop
  userMenuWrap: { marginLeft: 8, position: "relative" },
  userAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.55)",
  },
  userName: { marginLeft: 6, marginRight: 4, fontWeight: "700" },
  userMenuCard: {
    position: "absolute",
    top: 56 - 6, // NAV_HEIGHT - 6
    right: 0,
    width: 240,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 10,
    marginTop: 6,
  },
  userMenuSection: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#9ca3af",
    marginTop: 4,
    marginBottom: 4,
  },
  userMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  userMenuItemText: { color: "#e5e7eb", fontSize: 14, fontWeight: "600" },
  userMenuDivider: {
    height: 1,
    backgroundColor: "rgba(148,163,184,0.3)",
    marginVertical: 6,
  },

  mobileUserMenu: {
    position: "absolute",
    top: 56 + 8, // NAV_HEIGHT + 8
    right: 12,
    borderRadius: 14,
    backgroundColor: "rgba(8,16,28,0.9)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(148,163,184,0.4)",
    padding: 8,
  },
});