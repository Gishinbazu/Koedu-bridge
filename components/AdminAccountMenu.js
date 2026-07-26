// components/AdminAccountMenu.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LogoutButton from "../app/auth/LogoutButton"; // Import du bouton de déconnexion

export default function AdminAccountMenu({
  onNavigate,
  showDashboardLink = false,
  showLogout = true,
  containerStyle,
}) {
  const router = useRouter();

  const handlePress = (route) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {showDashboardLink && (
        <MenuItem
          label="Admin Dashboard"
          icon="speedometer-outline"
          onPress={() => handlePress("/admin/dashboard")}
        />
      )}

      <MenuItem
        label="My Information"
        icon="person-outline"
        onPress={() => handlePress("/admin/account/my-info")}
      />

      <MenuItem
        label="Security & Sign-in"
        icon="shield-checkmark-outline"
        onPress={() => handlePress("/admin/account/security")}
      />

      <MenuItem
        label="Notifications"
        icon="notifications-outline"
        onPress={() => handlePress("/admin/account/notifications")}
      />

      <MenuItem
        label="Country / Region & Language"
        icon="globe-outline"
        onPress={() => handlePress("/admin/account/region-language")}
      />

      {showLogout && (
        <>
          <View style={styles.divider} />
          <View style={styles.logoutWrapper}>
            <LogoutButton />
          </View>
        </>
      )}
    </View>
  );
}

function MenuItem({ label, icon, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={icon}
          size={18}
          color={danger ? "#fecaca" : "#e5e7eb"}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.menuItemText, danger && styles.dangerText]}>
          {label}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={danger ? "#fecaca" : "rgba(255,255,255,0.4)"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
  },
  dangerText: {
    color: "#fecaca",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 10,
  },
  logoutWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignItems: "flex-start",
  },
});
