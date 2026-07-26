// components/StarRating.js
import { StyleSheet, Text, View } from "react-native";

export default function StarRating({ value = 5, max = 5 }) {
  const full = Math.round(value);
  const stars = Array.from({ length: max }).map((_, i) =>
    i < full ? "★" : "☆"
  );

  return (
    <View style={styles.row}>
      <Text style={styles.stars}>{stars.join(" ")}</Text>
      <Text style={styles.value}>
        {typeof value === "number" ? value.toFixed(1) : value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stars: {
    fontSize: 16,
    color: "#fbbf24", // jaune
    marginRight: 6,
  },
  value: {
    fontSize: 12,
    color: "#6b7280",
  },
});
