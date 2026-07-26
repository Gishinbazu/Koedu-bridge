// components/TestimonialsCarousel.js
import {
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import StarRating from "./StarRating";

const testimonials = [
  {
    id: 1,
    name: "Grace, Nigeria",
    program: "Bachelor in Computer Engineering",
    quote:
      "KOEDU Bridge m’a aidée à comprendre chaque étape de l’admission. J’ai reçu du feedback rapide sur mes documents et j’ai pu arriver en Corée sereinement.",
    rating: 5,
  },
  {
    id: 2,
    name: "Carlos, Peru",
    program: "Master in AI & Data",
    quote:
      "Le manager KOEDU Bridge m’a conseillé sur les programmes 100% English track et m’a aidé à préparer mon dossier de bourse.",
    rating: 5,
  },
  {
    id: 3,
    name: "Dina, DR Congo",
    program: "Bachelor in Global Business",
    quote:
      "Sans KOEDU Bridge, j’aurais perdu énormément de temps entre les traductions, les frais et la communication avec l’université.",
    rating: 4,
  },
];

export default function TestimonialsCarousel() {
  const { width } = useWindowDimensions();
  const itemWidth = Math.min(width * 0.8, 360);

  return (
    <View style={styles.container}>
      <Carousel
        width={itemWidth}
        height={220}
        data={testimonials}
        loop
        autoPlay
        autoPlayInterval={5000}
        style={{ alignSelf: "center" }}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: itemWidth }]}>
            <StarRating value={item.rating} />
            <Text style={styles.quote} numberOfLines={4}>
              “{item.quote}”
            </Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.program}>{item.program}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  quote: {
    fontSize: 14,
    color: "#111827",
    marginTop: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  program: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
