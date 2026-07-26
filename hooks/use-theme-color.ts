// hooks/use-theme-color.ts
import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

type Theme = "light" | "dark";

type Props = {
  light?: string;
  dark?: string;
};

/**
 * Petit helper pour choisir une couleur selon le thème.
 * - si props.light / props.dark sont fournis, on les utilise
 * - sinon on renvoie une couleur par défaut depuis Colors
 */
export function useThemeColor(
  props: Props,
  colorName: keyof typeof Colors = "background"
) {
  const scheme = (useColorScheme() ?? "light") as Theme;

  if (scheme === "dark") {
    // couleur donnée en paramètre ou fallback sombre
    return props.dark ?? (colorName === "background"
      ? Colors.background
      : Colors.primaryDark);
  }

  // thème clair
  return props.light ?? (colorName === "background"
    ? Colors.cardBackground
    : Colors.primary);
}
