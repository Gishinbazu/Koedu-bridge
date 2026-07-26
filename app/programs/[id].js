// app/programs/[id].js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PROGRAMS_2026 } from "../../data/PROGRAMS_DB";

export default function ProgramDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const program = PROGRAMS_2026.find((p) => String(p.id) === String(id));

  if (!program) {
    return (
      <View style={styles.notFoundWrap}>
        <Text style={styles.notFoundText}>Program not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back to programs</Text>
        </Pressable>
      </View>
    );
  }

  /* ------------------------------------------------------ */
  /* APPLY BUTTON (Guard login)                             */
  /* ------------------------------------------------------ */
  const handleApply = async () => {
    // ✅ Check login
    const token = await AsyncStorage.getItem("koedu_token");
    const rawUser = await AsyncStorage.getItem("koedu_user");

    if (!token || !rawUser) {
      // ✅ Save where user wanted to go
      await AsyncStorage.setItem(
        "redirect_after_login",
        `/programs/${program.id}`
      );

      router.push("/auth/login");
      return;
    }

    // ✅ Continue to apply
    const lvl = (program.level || "").toLowerCase();
    let track = "bachelor"; // default

    if (lvl.includes("language")) track = "language";
    else if (lvl.includes("master") || lvl.includes("graduate")) track = "master";

    router.push(`/apply/${track}/${program.id}`);
  };

  return (
    <LinearGradient colors={["#050816", "#02010f"]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* BACK BUTTON */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color="#f97316" />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>

        {/* TITLE */}
        <Text style={styles.title}>{program.name}</Text>
        <Text style={styles.university}>{program.university}</Text>

        {/* BADGES */}
        <View style={styles.badgesRow}>
          <Badge icon="school-outline" label={program.level} />
          <Badge icon="language-outline" label={program.language} />
          <Badge icon="location-outline" label={program.city} />
        </View>

        {/* OVERVIEW CARD */}
        <Section title="Overview">
          <Text style={styles.p}>{program.overview}</Text>
        </Section>

        {/* KEY INFO */}
        <Section title="Key Information">
          <Info icon="calendar-outline" label="Intakes" value={program.intakes} />
          <Info icon="time-outline" label="Duration" value={program.duration} />
          <Info icon="cash-outline" label="Tuition" value={program.tuition} />
        </Section>

        {/* REQUIREMENTS */}
        {program.requirements?.length > 0 && (
          <Section title="Admission Requirements (2026)">
            {program.requirements.map((req, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.bulletText}>{req}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* APPLY BUTTON */}
        <Pressable style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyText}>Apply with KOEDU Bridge</Text>
          <Ionicons name="chevron-forward" size={18} color="#111" />
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

/* ------------------------------------------------------ */
/* COMPONENTS                                             */
/* ------------------------------------------------------ */

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Badge({ icon, label }) {
  return (
    <View style={styles.badge}>
      <Ionicons
        name={icon}
        size={12}
        color="#111827"
        style={{ marginRight: 4 }}
      />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function Info({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#fb923c" />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ------------------------------------------------------ */
/* STYLES                                                 */
/* ------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: { flex: 1 },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 6,
  },
  backBtnText: { color: "#f97316", fontWeight: "700" },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  university: {
    color: "#9ca3af",
    marginTop: 4,
    fontSize: 14,
  },

  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "700",
  },

  section: {
    backgroundColor: "rgba(15,23,42,0.95)",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#f97316",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  p: {
    color: "#e5e7eb",
    fontSize: 14,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    color: "#f9fafb",
    fontWeight: "700",
    fontSize: 13,
  },
  infoValue: {
    color: "#9ca3af",
    fontSize: 13,
  },

  bulletRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  bulletText: {
    color: "#e5e7eb",
    fontSize: 14,
    flex: 1,
  },

  applyBtn: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  applyText: {
    color: "#111",
    fontWeight: "800",
    fontSize: 15,
  },

  notFoundWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#050816",
  },
  notFoundText: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 10,
  },
  backLink: {
    color: "#f97316",
    fontWeight: "700",
  },
});
