import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiFetch } from "../../../services/apiClient";
import { COLORS, styles } from "../../../styles/Adminstyle/Accountstyles"; // Import colors and styles from the new file

export default function AdminMyInfoScreen() {
  const router = useRouter();
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("koedu_user");
        if (!raw) {
          router.replace("/auth/login");
          return;
        }
        const u = JSON.parse(raw);
        if (!u || u.role !== "admin") {
          router.replace("/");
          return;
        }

        // 🔐 Appel backend pour avoir la version à jour
        let backendUser = u;
        try {
          const res = await apiFetch("/api/admin/account/me", {
            method: "GET",
          });
          if (res?.user) {
            backendUser = res.user;
          }
        } catch (err) {
          console.log("Admin my-info backend /me error:", err);
          // on continue avec u si l'appel échoue
        }

        setUser(backendUser);
        setFullName(backendUser.username || backendUser.name || "");
        setEmail(backendUser.email || "");
        setPhone(backendUser.phone || "");
        setOrganization(backendUser.organization || "");
      } catch (e) {
        console.log("Admin my-info load error:", e.message);
        router.replace("/");
      } finally {
        setCheckingAdmin(false);
      }
    })();
  }, [router]);

  const handleSave = async () => {
    try {
      const payload = {
        name: fullName,
        email,
        phone,
        organization,
      };

      const res = await apiFetch("/api/admin/account/account", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const updatedUser = res?.user;
      if (updatedUser) {
        setUser(updatedUser);
        await AsyncStorage.setItem("koedu_user", JSON.stringify(updatedUser));
      }
      alert("Profile updated successfully.");
    } catch (err) {
      console.log("update admin profile error:", err);
      alert(err.message || "Failed to update profile.");
    }
  };

  // 🚪 Fonction de Déconnexion
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("koedu_user");
      await AsyncStorage.removeItem("koedu_token"); // Au cas où un jeton JWT est aussi stocké
      router.replace("/auth/login");
    } catch (err) {
      console.log("Logout error:", err);
      alert("Failed to log out.");
    }
  };

  if (checkingAdmin) {
    return (
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: COLORS.textMuted, marginTop: 8 }}>
            Checking admin access...
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons
                name="arrow-back-outline"
                size={18}
                color={COLORS.text}
              />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>

            <Ionicons
              name="person-circle-outline"
              size={22}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />
            <View>
              <Text style={styles.headerTitle}>My information</Text>
              <Text style={styles.headerSubtitle}>
                Basic admin profile details
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* CARD PROFIL */}
          <View style={styles.card}>
            <LabeledInput
              label="Full name"
              placeholder="Your full name"
              value={fullName}
              onChangeText={setFullName}
            />
            <LabeledInput
              label="Email"
              placeholder="you@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <LabeledInput
              label="Phone number"
              placeholder="+82..."
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <LabeledInput
              label="Organization / Agency"
              placeholder="KOEDU Bridge / Partner agency"
              value={organization}
              onChangeText={setOrganization}
            />

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save changes</Text>
            </Pressable>
          </View>

          {/* SECTION ACCOUNT SETTINGS */}
          <View style={localStyles.sectionContainer}>
            <Text style={localStyles.sectionTitle}>Account settings</Text>

            {/* Security and Sign-in */}
            <Pressable
              style={localStyles.settingRow}
              onPress={() => router.push("/admin/account/security")}
            >
              <View style={localStyles.rowLeft}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={COLORS.text}
                />
                <Text style={localStyles.settingLabel}>
                  Security and Sign-in
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textMuted}
              />
            </Pressable>

            {/* Notifications */}
            <Pressable
              style={localStyles.settingRow}
              onPress={() => router.push("/admin/account/notifications")}
            >
              <View style={localStyles.rowLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={COLORS.text}
                />
                <Text style={localStyles.settingLabel}>Notifications</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textMuted}
              />
            </Pressable>

            {/* Region & Language */}
            <Pressable
              style={localStyles.settingRow}
              onPress={() => router.push("/admin/account/region-language")}
            >
              <View style={localStyles.rowLeft}>
                <Ionicons name="globe-outline" size={22} color={COLORS.text} />
                <Text style={localStyles.settingLabel}>
                  Country / Region & Language
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textMuted}
              />
            </Pressable>

            {/* 🔴 BOUTON LOGOUT */}
            <Pressable
              style={({ pressed }) => [
                localStyles.settingRow,
                localStyles.logoutRow,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleLogout}
            >
              <View style={localStyles.rowLeft}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text style={localStyles.logoutLabel}>Log out</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </Pressable>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function LabeledInput({ label, ...props }) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="rgba(148,163,184,0.9)"
        {...props}
      />
    </View>
  );
}

// 🎨 Styles locaux pour la section Account Settings & Logout
const localStyles = StyleSheet.create({
  sectionContainer: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  settingRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  logoutRow: {
    marginTop: 12,
    borderBottomWidth: 0, // Supprime la ligne du bas pour mettre en valeur
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444", // Couleur rouge d'alerte pour le logout
  },
});
