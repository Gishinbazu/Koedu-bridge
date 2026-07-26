// app/auth/signup.js
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { registerUser } from "../../services/authApi";
import { signupStyles as styles } from "../../styles/AuthStyle/signupStyles";

// =========================================================================
// 🚀 SOUS-COMPOSANTS DÉCLARÉS À L'EXTÉRIEUR POUR ÉVITER LA PERTE DU FOCUS
// =========================================================================

function Point({ icon, text }) {
  return (
    <View style={styles.pointRow}>
      <Ionicons name={icon} size={16} color="#7CFFB2" />
      <Text style={styles.pointText}>{text}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  secureTextEntry,
  icon,
  error,
  rightAdornment,
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          error && {
            borderColor: "#ff9b9b",
            backgroundColor: "rgba(255,155,155,0.06)",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect ?? false}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            {
              flex: 1,
              color: "#FFFFFF", // Texte blanc visible
              fontSize: 14,
              outlineStyle: "none", // Supprime la bordure bleue par défaut sur navigateur
            },
          ]}
        />
        {!!rightAdornment && (
          <View style={{ marginLeft: 8 }}>{rightAdornment}</View>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// =========================================================================
// ÉCRAN PRINCIPAL
// =========================================================================

export default function SignupScreen() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accept, setAccept] = useState(false);

  // ui state
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // inline errors
  const [errors, setErrors] = useState({});

  // anims
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  const { width } = useWindowDimensions();
  const isMobile = width < 820;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  // helpers
  const emailValid = useMemo(
    () => /^\S+@\S+\.\S+$/.test((email || "").trim()),
    [email],
  );

  const pwdScore = useMemo(() => {
    const p = password || "";
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 5);
  }, [password]);

  const pwdLabel =
    ["Very weak", "Weak", "Okay", "Good", "Strong", "Great"][pwdScore] ||
    "Very weak";
  const pwdBarWidth = `${(pwdScore / 5) * 100}%`;

  const validate = () => {
    const emailClean = (email || "").trim().toLowerCase();
    const nameClean = (name || "").trim();
    const next = {};
    if (!nameClean) next.name = "Please enter your full name.";
    if (!emailClean) next.email = "Email is required.";
    else if (!emailValid) next.email = "Please enter a valid email.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Minimum 6 characters.";
    if (!confirmPassword) next.confirm = "Please confirm your password.";
    else if (password !== confirmPassword)
      next.confirm = "Passwords do not match.";
    if (!accept) next.accept = "You must accept the Terms & Privacy.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    const emailClean = (email || "").trim().toLowerCase();
    const nameClean = (name || "").trim();

    setLoading(true);
    try {
      // 🔐 KOEDU backend signup
      const res = await registerUser({
        username: nameClean,
        email: emailClean,
        password,
      });

      console.log("✅ Signup success:", res);
      setModalVisible(true);
    } catch (e) {
      console.error("[signup]", e);
      let msg = "Sign up failed.";
      if (e?.message) msg = e.message;

      if (Platform.OS === "web") {
        alert(`Sign up Error: ${msg}`);
      } else {
        Alert.alert("Sign up", msg);
      }
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
      <LinearGradient
        colors={["rgba(3,8,23,0.55)", "rgba(3,8,23,0.75)"]}
        style={styles.gradientOverlay}
      />
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.outer,
              { flexDirection: isMobile ? "column" : "row" },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Left: brand / pitch */}
            <View
              style={[
                styles.left,
                isMobile && {
                  paddingHorizontal: 20,
                  paddingTop: 24,
                  alignItems: "center",
                },
              ]}
            >
              <Text style={styles.kicker}>KOEDU Bridge</Text>
              <Text style={styles.heroTitle}>Create your account</Text>
              <Text style={styles.heroSub}>
                Find programs, track your application, and get
                guidance—end-to-end.
              </Text>
              <View style={styles.points}>
                <Point
                  icon="checkmark-circle-outline"
                  text="Verified programs & deadlines"
                />
                <Point
                  icon="checkmark-circle-outline"
                  text="Secure document handling"
                />
                <Point
                  icon="checkmark-circle-outline"
                  text="Status tracking & reminders"
                />
              </View>
              <Pressable
                style={styles.backHome}
                onPress={() => router.push("/")}
              >
                <Ionicons name="arrow-back" size={16} color="#fff" />
                <Text style={styles.backHomeText}>Back to Home</Text>
              </Pressable>
            </View>

            {/* Right: form card */}
            <Animated.View
              style={{
                transform: [{ translateY: slide }],
                opacity: fade,
                flex: 1,
                marginTop: isMobile ? 16 : 0,
              }}
            >
              <BlurView intensity={50} tint="dark" style={styles.card}>
                <Text style={styles.cardTitle}>Sign up</Text>

                {/* Name */}
                <Field
                  label="Full name"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name)
                      setErrors((e) => ({ ...e, name: undefined }));
                  }}
                  placeholder="e.g. Jane Doe"
                  icon="person-outline"
                  error={errors.name}
                />

                {/* Email */}
                <Field
                  label="Email"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email)
                      setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail-outline"
                  error={errors.email}
                  rightAdornment={
                    email.length > 0 ? (
                      <Ionicons
                        name={emailValid ? "checkmark-circle" : "close-circle"}
                        size={18}
                        color={emailValid ? "#7CFFB2" : "#ff9b9b"}
                      />
                    ) : null
                  }
                />

                {/* Password */}
                <Field
                  label="Password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password)
                      setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  placeholder="Minimum 6 characters"
                  secureTextEntry={!showPwd}
                  icon="lock-closed-outline"
                  error={errors.password}
                  rightAdornment={
                    <Pressable onPress={() => setShowPwd((v) => !v)}>
                      <Ionicons
                        name={showPwd ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color="#fff"
                      />
                    </Pressable>
                  }
                />

                {/* Strength meter */}
                <View style={styles.meterWrap}>
                  <View style={styles.meterBg}>
                    <View style={[styles.meterFill, { width: pwdBarWidth }]} />
                  </View>
                  <Text style={styles.meterLabel}>{pwdLabel}</Text>
                </View>

                {/* Confirm */}
                <Field
                  label="Confirm password"
                  value={confirmPassword}
                  onChangeText={(t) => {
                    setConfirmPassword(t);
                    if (errors.confirm)
                      setErrors((e) => ({ ...e, confirm: undefined }));
                  }}
                  placeholder="Re-enter password"
                  secureTextEntry={!showConfirm}
                  icon="shield-checkmark-outline"
                  error={errors.confirm}
                  rightAdornment={
                    <Pressable onPress={() => setShowConfirm((v) => !v)}>
                      <Ionicons
                        name={showConfirm ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color="#fff"
                      />
                    </Pressable>
                  }
                />

                {/* Terms */}
                <Pressable
                  style={styles.termsRow}
                  onPress={() => setAccept((v) => !v)}
                >
                  <Ionicons
                    name={accept ? "checkbox" : "square-outline"}
                    size={20}
                    color={accept ? "#FFD166" : "#fff"}
                  />
                  <Text style={styles.termsText}>
                    I agree to the{" "}
                    <Text
                      style={styles.link}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        router.push("/legal/terms");
                      }}
                    >
                      Terms
                    </Text>{" "}
                    and{" "}
                    <Text
                      style={styles.link}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        router.push("/legal/privacy");
                      }}
                    >
                      Privacy
                    </Text>
                    .
                  </Text>
                </Pressable>
                {!!errors.accept && (
                  <Text style={styles.errorText}>{errors.accept}</Text>
                )}

                {/* Submit */}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    (!accept || loading) && { opacity: 0.7 },
                  ]}
                  onPress={handleSignup}
                  disabled={!accept || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#0B1A2A" />
                  ) : (
                    <>
                      <Ionicons
                        name="sparkles-outline"
                        size={16}
                        color="#0B1A2A"
                      />
                      <Text style={styles.submitText}>Create account</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Login redirect */}
                <View style={styles.redirectRow}>
                  <Text style={styles.redirectText}>
                    Already have an account?
                  </Text>
                  <Pressable onPress={() => router.push("/auth/login")}>
                    <Text style={styles.redirectLink}> Log in</Text>
                  </Pressable>
                </View>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Success modal */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={44} color="#16a34a" />
            <Text style={styles.modalTitle}>Account created!</Text>
            <Text style={styles.modalSub}>Welcome to KOEDU Bridge.</Text>
            <Pressable
              onPress={() => {
                setModalVisible(false);
                router.replace("/auth/login");
              }}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>Go to Login</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}
