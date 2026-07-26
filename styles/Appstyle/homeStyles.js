// styles/homeStyles.js

import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ───────── Layout global ───────── */
  bg: {
    flex: 1,
  },
  container: {
    paddingBottom: 60,
  },
  wrapper: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  /* ───────── HERO ───────── */
  heroWrapper: {
    width: "100%",
    height: 900,
    position: "relative",
    backgroundColor: "#000",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...(Platform.OS === "web" ? { willChange: "transform" } : {}),
  },

  // Full-bleed sur web (pour supprimer le petit gap sur la droite)
  heroFullBleed:
    Platform.OS === "web"
      ? { width: "100vw", marginLeft: "calc(50% - 50vw)" }
      : {},

  heroVideo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

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
    borderWidth: 2,
    borderRadius: 20,
    padding: 42,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 9,
  },

  /* ───────── Texte HERO ───────── */
  titleLarge: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 44,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
});

/* ───────── Overrides Mobile (≤520px) ───────── */
export const mobile = StyleSheet.create({
  container: {
    paddingBottom: 80,
    paddingHorizontal: 10,
  },

  wrapper: {
    paddingHorizontal: 12,
    marginBottom: 18,
    maxWidth: "100%",
  },

  heroWrapper: {
    height: 360,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  heroOverlay: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },

  heroGlass: {
    maxWidth: 720,
    padding: 14,
    borderRadius: 16,
  },

  titleLarge: {
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 12,
  },
});
