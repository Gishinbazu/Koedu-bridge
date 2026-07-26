// app/modal.tsx — simple modal KOEDU Bridge sans alias spéciaux

import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Need help with your application?</Text>
        <Text style={styles.body}>
          KOEDU Bridge Managers can guide you step by step: programs,
          documents, visas and dormitory.
        </Text>

        <Link href="/info/contact" style={styles.link}>
          <Text style={styles.linkText}>Contact support</Text>
        </Link>

        <Link href="../" style={styles.closeLink}>
          <Text style={styles.closeText}>Close</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 16,
  },
  link: {
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#0b3b79",
    alignItems: "center",
    marginBottom: 8,
  },
  linkText: {
    color: "#fff",
    fontWeight: "700",
  },
  closeLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  closeText: {
    color: "#6b7280",
    fontWeight: "500",
  },
});
