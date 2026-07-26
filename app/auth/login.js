// app/auth/login.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { apiFetch } from "../../services/apiClient";
import { loginUser } from "../../services/authApi";
import { loginStyles as styles } from "../../styles/AuthStyle/authStyles";

export default function LoginScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  /* --------------------------------------------------
     LOAD REMEMBER ME
  --------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const pref = await AsyncStorage.getItem("koedu_rememberMe");
      const savedEmail = await AsyncStorage.getItem("koedu_rememberEmail");

      if (pref === "true") {
        setRememberMe(true);
        if (savedEmail) setEmail(savedEmail);
      }
    })();
  }, []);

  const toggleRemember = async () => {
    const next = !rememberMe;
    setRememberMe(next);

    await AsyncStorage.setItem("koedu_rememberMe", next ? "true" : "false");

    if (next && email) {
      await AsyncStorage.setItem("koedu_rememberEmail", email);
    } else {
      await AsyncStorage.removeItem("koedu_rememberEmail");
    }
  };

  /* --------------------------------------------------
     LOGIN HANDLER (WITH REDIRECT)
  --------------------------------------------------- */
  const handleLogin = async () => {
    const emailClean = email.trim().toLowerCase();

    if (!emailClean || !password) {
      return Alert.alert(
        "Missing fields",
        "Please enter both email and password."
      );
    }

    setLoading(true);

    try {
      const res = await loginUser({
        email: emailClean,
        password,
      });

      const user = res?.user;

      // 🔐 Verify token really works
      try {
        await apiFetch("/api/users/me");
      } catch {}

      // 🔁 CHECK REDIRECT AFTER LOGIN
      const redirect = await AsyncStorage.getItem("redirect_after_login");

      if (redirect) {
        await AsyncStorage.removeItem("redirect_after_login");
        router.replace(redirect);
        return;
      }

      // 🔀 DEFAULT REDIRECTION BY ROLE
      if (user?.role === "admin" || user?.role === "superadmin") {
        router.replace("/admin");
      } else if (user?.role === "manager") {
        router.replace("/manager");
      } else {
        router.replace("/");
      }
    } catch (e) {
      Alert.alert(
        "Sign-in failed",
        e?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/sunrise.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.bgDim} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            {/* 🏠 HOME BUTTON */}
            <Pressable
              style={styles.homeButton}
              onPress={() => router.replace("/")}
            >
              <Ionicons
                name="home-outline"
                size={18}
                color="#e5e7eb"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </Pressable>

            {/* MAIN CARD */}
            <View style={styles.cardContainer}>
              {/* LEFT PANEL */}
              <View style={styles.leftPanel}>
                <Text style={styles.logo}>KOEDU Bridge</Text>
                <Text style={styles.welcome}>Welcome back</Text>
                <Text style={styles.subWelcome}>
                  Sign in to your account
                </Text>
                <Text style={styles.description}>
                  Access your dashboard, applications, and documents all in one
                  place.
                </Text>
              </View>

              {/* RIGHT PANEL */}
              <View style={styles.rightPanel}>
                <Text style={styles.title}>Sign in</Text>

                {/* Email */}
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9aa4b2"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />

                {/* Password */}
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#9aa4b2"
                    secureTextEntry={secure}
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <Text style={styles.eye}>
                      {secure ? "👁️" : "🙈"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Options */}
                <View style={styles.optionsRow}>
                  <Pressable onPress={toggleRemember} style={styles.checkRow}>
                    <Ionicons
                      name={rememberMe ? "checkbox" : "square-outline"}
                      size={20}
                      color="#dbeafe"
                    />
                    <Text style={styles.rememberText}>Remember me</Text>
                  </Pressable>

                  <TouchableOpacity
                    onPress={() => router.push("/auth/forgot-password")}
                  >
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                {/* LOGIN BUTTON */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign in</Text>
                  )}
                </TouchableOpacity>

                {/* SIGN UP */}
                <TouchableOpacity
                  onPress={() => router.push("/auth/signup")}
                >
                  <Text style={styles.link}>
                    Don’t have an account? Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
