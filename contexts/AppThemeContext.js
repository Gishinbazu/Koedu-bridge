import { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";
// Si tu veux sauvegarder le thème dans la mémoire du téléphone :
// import AsyncStorage from "@react-native-async-storage/async-storage";

const AppThemeContext = createContext();

// 🎨 Définition des couleurs du thème
const lightTheme = {
  mode: "light",
  background: "#FFFFFF",
  top: "#0D1B2A",         // couleur du topbar KOEDU Bridge
  text: "#000000",
  card: "#F5F5F5",
};

const darkTheme = {
  mode: "dark",
  background: "#0B0D0F",
  top: "#0D1B2A",
  text: "#FFFFFF",
  card: "#1A1D21",
};

export function AppThemeProvider({ children }) {
  const systemPreference = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemPreference === "dark");

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Si tu veux activer la sauvegarde du thème :
  // useEffect(() => {
  //   AsyncStorage.setItem("APP_THEME", isDarkMode ? "dark" : "light");
  // }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <AppThemeContext.Provider
      value={{
        isDarkMode,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}
