// app/settings/language.js
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getSettings,
  updateLanguageSettings,
} from "../../../services/settingsApi";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ko", label: "한국어" },
];

export default function LanguageSettingsScreen() {
  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("KR");

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        if (s.language) setLanguage(s.language);
        if (s.region) setRegion(s.region);
      } catch {}
    })();
  }, []);

  const handleSave = async () => {
    try {
      await updateLanguageSettings({ language, region });
      Alert.alert("Saved", "Language & region updated.");
    } catch (e) {
      Alert.alert("Error", e.message || "Unable to save");
    }
  };

  return (
    <LinearGradient colors={["#050816", "#02010f"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Country/Region & Language</Text>
        <Text style={styles.subtitle}>
          Choose how KOEDU Bridge displays dates, language and content.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.pillRow}>
            {LANG_OPTIONS.map((opt) => (
              <Pressable
                key={opt.code}
                style={[
                  styles.pill,
                  language === opt.code && styles.pillActive,
                ]}
                onPress={() => setLanguage(opt.code)}
              >
                <Text
                  style={[
                    styles.pillText,
                    language === opt.code && styles.pillTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Region</Text>
          <View style={styles.pillRow}>
            {["KR", "CD", "US"].map((code) => (
              <Pressable
                key={code}
                style={[
                  styles.pill,
                  region === code && styles.pillActive,
                ]}
                onPress={() => setRegion(code)}
              >
                <Text
                  style={[
                    styles.pillText,
                    region === code && styles.pillTextActive,
                  ]}
                >
                  {code}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.primaryBtn} onPress={handleSave}>
            <Text style={styles.primaryText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 80 },
  title: { color: "#f9fafb", fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#9ca3af", marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: "rgba(15,23,42,0.96)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    padding: 16,
  },
  sectionTitle: {
    color: "#f97316",
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillActive: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  pillText: { color: "#e5e7eb", fontWeight: "600", fontSize: 13 },
  pillTextActive: { color: "#111827" },
  primaryBtn: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
  },
  primaryText: { color: "#111827", fontWeight: "800" },
});
