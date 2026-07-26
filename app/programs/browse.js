// app/programs/browse.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiFetch } from "../../services/apiClient";

const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316",
  cardBg: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.2)",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
};

const CATEGORIES = ["All", "Language", "Bachelor", "Master"];

// Base URL du backend — à adapter selon l'environnement (dev/prod).
// Idéalement, mets cette valeur dans une variable d'environnement Expo
// (ex: process.env.EXPO_PUBLIC_API_URL) plutôt qu'en dur ici.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export default function ProgramsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/programs", { method: "GET" });
      const list = res?.programs || res || [];
      setPrograms(list);

      // 🔍 DEBUG TEMPORAIRE — à retirer une fois le champ PDF identifié.
      // Regarde la console (terminal Expo ou console navigateur) et
      // cherche le champ qui contient l'URL du PDF (pdfUrl, pdf, brochureUrl...).
      console.log("PROGRAMS DATA:", JSON.stringify(list, null, 2));
    } catch (err) {
      console.log("Error loading programs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage selon la recherche et la catégorie
  const filteredPrograms = programs.filter((prog) => {
    const name = (prog.title || prog.name || "").toLowerCase();
    const uni = (prog.university || "").toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      uni.includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (prog.type || "").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Ouvrir le fichier PDF dans le navigateur ou une vue web
  const handleOpenPdf = (pdfUrl) => {
    if (!pdfUrl) return;

    // Si c'est un chemin relatif de type /uploads/..., ajoute l'URL du backend
    const fullUrl = pdfUrl.startsWith("http")
      ? pdfUrl
      : `${API_BASE_URL}${pdfUrl}`;

    Linking.openURL(fullUrl).catch(() => {
      alert("Unable to open PDF document.");
    });
  };

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={COLORS.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Academic Programs</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* BARRE DE RECHERCHE */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search degree or university..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FILTRES PAR CATÉGORIE */}
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextSelected,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* LISTE DES PROGRAMMES */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            {filteredPrograms.length === 0 ? (
              <Text style={styles.emptyText}>No programs found.</Text>
            ) : (
              filteredPrograms.map((prog, idx) => (
                <View key={prog.id || prog._id || idx} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.typeBadge}>
                      {(prog.type || "Bachelor").toUpperCase()}
                    </Text>
                    {prog.pdfUrl ? (
                      <Pressable
                        onPress={() => handleOpenPdf(prog.pdfUrl)}
                        style={styles.pdfBtn}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={16}
                          color="#3B82F6"
                        />
                        <Text style={styles.pdfBtnText}>Brochure (PDF)</Text>
                      </Pressable>
                    ) : null}
                  </View>

                  <Text style={styles.progName}>{prog.title || prog.name}</Text>
                  <Text style={styles.universityName}>
                    📍 {prog.university}
                  </Text>

                  <Pressable
                    style={styles.applyBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/apply",
                        params: { programId: prog.id || prog._id },
                      })
                    }
                  >
                    <Text style={styles.applyBtnText}>Apply Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: "700" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 10,
    marginLeft: 8,
  },

  categoryRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: { color: COLORS.textMuted, fontSize: 12, fontWeight: "600" },
  categoryTextSelected: { color: "#fff" },

  content: { padding: 16, gap: 16 },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  pdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pdfBtnText: { color: "#3B82F6", fontSize: 12, fontWeight: "600" },

  progName: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  universityName: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },

  applyBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  applyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
