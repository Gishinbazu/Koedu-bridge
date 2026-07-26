// app/admin/applications/applicationDetail.components.js
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { styles } from "../../../styles/Adminstyle/applicationDetail.styles";

/* =========================================================
   UI COMPONENTS
   ========================================================= */

// Composant pour afficher une ligne d'information (Label: Value)
export function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "—"}</Text>
    </View>
  );
}

// Composant pour les boutons de changement de statut
export function StatusButton({ label, icon, color, active, onPress, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.statusButton,
        {
          borderColor: color,
          backgroundColor: active ? color : "transparent",
          opacity: loading ? 0.6 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={active ? "#111827" : color} />
      ) : (
        <Ionicons name={icon} size={16} color={active ? "#111827" : color} />
      )}
      <Text style={[styles.statusButtonText, { color: active ? "#111827" : color }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// Composant de carte générique pour regrouper les sections
export function Card({ title, children }) {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
}