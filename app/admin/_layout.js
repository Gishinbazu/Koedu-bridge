// app/admin/_layout.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AdminLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const stored = await AsyncStorage.getItem("koedu_user");
        if (!stored) {
          router.replace("/auth/login");
          return;
        }
        const user = JSON.parse(stored);

        if (user.role !== "admin") {
          // pas admin → renvoi vers home
          router.replace("/");
          return;
        }

        setAllowed(true);
      } catch (e) {
        console.log("AdminLayout check error:", e);
        router.replace("/auth/login");
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050816",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={{ color: "#e5e7eb", marginTop: 8 }}>
          Checking admin access...
        </Text>
      </View>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
