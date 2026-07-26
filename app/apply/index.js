// app/apply/index.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ✅ ULTRA-SAFE IMPORT
import * as applicationsApi from "../../services/applicationsApi";

import styles, { COLORS } from "../../styles/apply/applystyle";

export default function ApplyHubScreen() {
  const router = useRouter();
  const [loadingTrack, setLoadingTrack] = useState(null);

  // ✅ helper: récupère le meilleur id possible
  const getAppId = (app) => app?.koeduId || app?._id || app?.id;

  // ✅ routes Expo Router SAFE (pathname + params)
  const routeByTrack = useMemo(
    () => ({
      language: "/apply/language/[id]",
      bachelor: "/apply/bachelor/[id]",
      master: "/apply/master/[id]",
    }),
    [],
  );

  const payloadByTrack = useMemo(
    () => ({
      language: {
        track: "language",
        programName: "Korean Language Program (1 year)",
        programTypeLabel: "Language Program",
        intake: "Spring 2026",
        universityName: "Sunmoon University",
      },
      bachelor: {
        track: "bachelor",
        programName: "Bachelor’s Degree",
        programTypeLabel: "Bachelor Program",
        intake: "Spring 2026",
        universityName: "Sunmoon University",
      },
      master: {
        track: "master",
        programName: "Master’s Degree",
        programTypeLabel: "Master Program",
        intake: "Spring 2026",
        universityName: "Sunmoon University",
      },
    }),
    [],
  );

  const showAlertWithAction = (title, message, onConfirm) => {
    if (Platform.OS === "web") {
      if (confirm(`${title}\n\n${message}`)) {
        if (onConfirm) onConfirm();
      }
    } else {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel" },
        { text: "Log In", onPress: onConfirm },
      ]);
    }
  };

  const startTrack = async (track) => {
    if (loadingTrack) return; // évite double-click
    setLoadingTrack(track);

    try {
      if (typeof applicationsApi.createApplication !== "function") {
        console.log("❌ createApplication is missing:", applicationsApi);
        if (Platform.OS === "web") {
          alert(
            "Import error: createApplication is undefined. Check services/applicationsApi.js path.",
          );
        } else {
          Alert.alert(
            "Import error",
            "createApplication is undefined. Check services/applicationsApi.js path.",
          );
        }
        return;
      }

      const res = await applicationsApi.createApplication(
        payloadByTrack[track],
      );
      const app = res?.application || res; // si API renvoie directement l'app
      const id = getAppId(app);

      if (!id) {
        console.log("❌ No application id returned:", res);
        if (Platform.OS === "web") {
          alert("Server error: No application id returned by backend.");
        } else {
          Alert.alert("Server error", "No application id returned by backend.");
        }
        return;
      }

      // ✅ push SAFE : pathname + params (Expo Router)
      router.push({
        pathname: routeByTrack[track],
        params: { id: String(id) },
      });
    } catch (err) {
      const errorMsg = err?.message || err;
      console.log(`Error creating ${track} application:`, errorMsg);

      // Handle missing or expired token / unauthorized access
      if (
        typeof errorMsg === "string" &&
        (errorMsg.includes("No token") ||
          errorMsg.includes("401") ||
          errorMsg.includes("Unauthorized") ||
          errorMsg.includes("jwt"))
      ) {
        showAlertWithAction(
          "Authentication Required",
          "You must be logged in to start an application.",
          () => router.push("/auth/login"),
        );
      } else {
        if (Platform.OS === "web") {
          alert(`Error: ${errorMsg || "Server error."}`);
        } else {
          Alert.alert("Error", errorMsg || "Server error.");
        }
      }
    } finally {
      setLoadingTrack(null);
    }
  };

  const Card = ({ track, icon, title, desc, tag }) => {
    const isLoading = loadingTrack === track;

    return (
      <Pressable
        onPress={() => startTrack(track)}
        disabled={!!loadingTrack}
        hitSlop={10}
        style={({ pressed }) => [
          styles.card,
          local.card,
          pressed && !loadingTrack && local.cardPressed,
          !!loadingTrack && local.cardDisabled,
          isLoading && local.cardLoading,
        ]}
      >
        <View style={local.cardRow}>
          <View style={local.left}>
            <View style={local.iconWrap}>
              <Ionicons name={icon} size={22} color={COLORS.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, local.title]}>{title}</Text>
              <Text style={[styles.cardText, local.desc]} numberOfLines={3}>
                {desc}
              </Text>

              <View style={local.tagRow}>
                <Text style={[styles.tag, local.tag]}>{tag}</Text>
              </View>
            </View>
          </View>

          <View style={local.right}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <View style={local.arrowBtn}>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={COLORS.primary}
                />
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.bgStart, COLORS.bgEnd]}
      style={styles.screen}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.title}>Start your application</Text>
              <Text style={styles.subtitle}>
                Choose the program you want to apply for
              </Text>
            </View>

            <View style={{ width: 40 }} />
          </View>

          {/* PROGRESS BAR */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
          </View>

          {/* LIST */}
          <View style={[styles.cardsGrid, local.grid]}>
            <Card
              track="language"
              icon="chatbubbles-outline"
              title="Korean Language"
              desc="1-year intensive Korean language program at Sunmoon University. Perfect for learning Korean before entering a degree program."
              tag="1-year · D-4-1 Visa"
            />

            <Card
              track="bachelor"
              icon="school-outline"
              title="Bachelor Program"
              desc="4-year undergraduate degree at Sunmoon University. For students starting a new major or continuing their education in Korea."
              tag="4-year · D-2 Visa"
            />

            <Card
              track="master"
              icon="ribbon-outline"
              title="Master Program"
              desc="2-year graduate program designed for advanced academic studies and specialization in your field. Requires a Bachelor degree."
              tag="2-year · D-2 Visa"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const local = StyleSheet.create({
  grid: {
    gap: 14,
    paddingTop: 4,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(12, 18, 34, 0.55)",
    overflow: "hidden",
  },
  cardPressed: {
    transform: [{ scale: 0.992 }],
    opacity: 0.92,
  },
  cardDisabled: {
    opacity: 0.75,
  },
  cardLoading: {
    borderColor: "rgba(249,115,22,0.35)",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  left: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 140, 0, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 140, 0, 0.20)",
  },
  title: {
    letterSpacing: 0.2,
  },
  desc: {
    marginTop: 6,
    lineHeight: 20,
    opacity: 0.95,
  },
  tagRow: {
    marginTop: 10,
  },
  tag: {
    opacity: 0.95,
  },
  right: {
    width: 46,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 140, 0, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 140, 0, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
});
