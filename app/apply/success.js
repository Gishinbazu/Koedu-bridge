// app/apply/success.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
};

export default function ApplicationSuccessScreen() {
  const router = useRouter();
  const { fullName, id, programTypeLabel } = useLocalSearchParams();

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={70} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Application submitted</Text>
        <Text style={styles.subtitle}>
          Thank you{fullName ? `, ${fullName}` : ""}!{"\n"}
          Your application for {programTypeLabel || "the program"} has been received.
        </Text>
        {id && (
          <Text style={styles.refText}>Application reference ID: {id}</Text>
        )}

        <View style={styles.buttons}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.primaryText}>Back to home</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.replace("/programs")}
          >
            <Text style={styles.secondaryText}>Browse other programs</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    alignItems: "center",
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 10,
  },
  refText: {
    color: COLORS.text,
    fontSize: 12,
    marginBottom: 24,
  },
  buttons: {
    width: "100%",
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryText: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
    paddingVertical: 11,
    alignItems: "center",
  },
  secondaryText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
  },
});