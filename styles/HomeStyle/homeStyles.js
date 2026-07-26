// styles/HomeStyle/homeStyles.js
import { Platform, StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  bg: { flex: 1 },
  container: { paddingBottom: 60 },
  wrapper: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  /* HERO */
  heroWrapper: {
    width: "100%",
    height: 560,
    position: "relative",
    backgroundColor: "#000",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...(Platform.OS === "web" ? { willChange: "transform" } : {}),
  },

  heroFullBleed:
    Platform.OS === "web"
      ? { width: "100vw", marginLeft: "calc(50% - 50vw)" }
      : {},

  heroVideo: { ...StyleSheet.absoluteFillObject, zIndex: 0 },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 36,
  },

  heroGlass: {
    width: "100%",
    maxWidth: 960,
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  /* HERO CONTENT */
  heroContent: { alignItems: "center", width: "100%" },
  textBlock: { alignItems: "center", width: "100%" },

  titleLarge: {
    fontFamily: "Merriweather_700Bold",
    fontSize: 36,
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 44,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },

  description: {
    fontFamily: "Merriweather_400Regular",
    fontSize: 17,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 26,
  },

  heroButtons: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    elevation: 4,
  },

  buttonText: { fontWeight: "700", fontSize: 16 },

  outlineBtn: {
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
  },

  outlineText: { fontWeight: "700", fontSize: 16 },

  /* SECTION TITLES */
  sectionTitle: {
    fontFamily: "Merriweather_700Bold",
    fontSize: 22,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  /* DIVIDER */
  gradientDivider: { height: 1, marginVertical: 18 },

  /* FOOTER CTA */
  footerCta: { borderTopWidth: 1, paddingTop: 18, paddingBottom: 36 },

  footerCtaCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  footerTitle: {
    fontFamily: "Merriweather_700Bold",
    fontSize: 18,
  },

  footerSubtitle: {},

  /* FALLBACK BOX */
  fallbackBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff1f0",
    borderWidth: 1,
    borderColor: "#ffccc7",
  },
  fallbackTitle: { fontWeight: "800", marginBottom: 6, color: "#a8071a" },
  fallbackText: { color: "#5c0011" },

  /* FLOATING BUTTON */
  fabWrap: { position: "absolute", right: 14, bottom: 20 },

  fabCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 2,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});

/* ========== MOBILE (≤ 520px) ========== */
export const homeMobile = StyleSheet.create({
  container: { paddingBottom: 80, paddingHorizontal: 10 },
  wrapper: { paddingHorizontal: 12, marginBottom: 18, maxWidth: "100%" },

  heroWrapper: {
    height: 360,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  heroOverlay: { paddingHorizontal: 12, paddingVertical: 20 },

  heroGlass: { maxWidth: 720, padding: 14, borderRadius: 16 },

  titleLarge: { fontSize: 26, lineHeight: 32, marginBottom: 10 },

  description: { fontSize: 14, lineHeight: 20, marginBottom: 14 },

  heroButtons: { flexDirection: "column", gap: 10, width: "100%" },

  button: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 },

  outlineBtn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 },

  sectionTitle: { fontSize: 20 },
  sectionSubtitle: { fontSize: 13 },

  footerCta: { paddingTop: 14, paddingBottom: 28 },

  footerCtaCard: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },

  footerTitle: { fontSize: 18 },
  footerSubtitle: { fontSize: 14 },

  fabWrap: { right: 10, bottom: 10 },
  fabCard: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 999 },
});
