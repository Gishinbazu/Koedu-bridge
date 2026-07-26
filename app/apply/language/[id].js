// app/apply/language/[id].js
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { COUNTRIES } from "../../../constants/countries";
import { API_BASE_URL, apiFetch } from "../../../services/apiClient";
import { getApplicationByIdOrKoeduId } from "../../../services/applicationsApi";

// ✅ Styles
import styles, { COLORS } from "../../../styles/apply/bachelorstyle";

// =========================================================================
// 🚀 SOUS-COMPOSANTS DÉCLARÉS À L'EXTÉRIEUR POUR ÉVITER LA PERTE DU FOCUS
// =========================================================================

function InputField({
  icon,
  placeholder,
  value,
  onChange,
  keyboard = "default",
}) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={20}
        color={COLORS.textMuted}
        style={{ marginRight: 10 }}
      />
      <TextInput
        style={[
          styles.input,
          {
            flex: 1,
            color: "#FFFFFF",
            fontSize: 14,
            outlineStyle: "none",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        autoCorrect={false}
      />
    </View>
  );
}

function SelectField({ icon, placeholder, value, onPress }) {
  return (
    <Pressable style={styles.inputContainer} onPress={onPress}>
      <Ionicons
        name={icon}
        size={20}
        color={COLORS.textMuted}
        style={{ marginRight: 10 }}
      />
      <Text style={[styles.inputText, !value && { color: COLORS.textMuted }]}>
        {value || placeholder}
      </Text>
      <Ionicons
        name="caret-down"
        size={16}
        color={COLORS.textMuted}
        style={{ marginLeft: "auto" }}
      />
    </Pressable>
  );
}

function UploadBox({
  label,
  file,
  docKey,
  icon,
  required = true,
  onPick,
  onView,
  onDelete,
}) {
  return (
    <View style={styles.uploadRow}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={styles.uploadLabel}>{label}</Text>
          {required && (
            <View style={styles.reqBadge}>
              <Text style={styles.reqText}>REQ</Text>
            </View>
          )}
        </View>
        <Text style={styles.uploadSubText} numberOfLines={1}>
          {file ? file.name : "Select File..."}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 6 }}>
        {file?.url ? (
          <Pressable
            style={[
              styles.uploadBtn,
              { backgroundColor: "rgba(56,189,248,0.2)" },
            ]}
            onPress={() => onView(file.url)}
          >
            <Ionicons name="eye-outline" size={18} color="#38BDF8" />
          </Pressable>
        ) : null}

        {!file ? (
          <Pressable style={styles.uploadBtn} onPress={() => onPick(docKey)}>
            <MaterialCommunityIcons name={icon} size={20} color="#000" />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.deleteBtn} onPress={() => onDelete(docKey)}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// =========================================================================
// ÉCRAN PRINCIPAL
// =========================================================================

export default function LanguageApplyFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const routeId = useMemo(() => {
    if (!id) return "";
    return Array.isArray(id) ? id[0] : String(id);
  }, [id]);

  // -------- STATE --------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [realAppId, setRealAppId] = useState(null);

  // Program résumé
  const [programTypeLabel, setProgramTypeLabel] = useState("Language Program");
  const [programName, setProgramName] = useState("");

  // Formulaire
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    dob: "",
    phone: "",
    email: "",
  });

  const [dobISO, setDobISO] = useState("");
  const [dateObject, setDateObject] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [eduData, setEduData] = useState({ lastSchool: "", major: "" });
  const [sponsor, setSponsor] = useState("self");

  const [docs, setDocs] = useState({
    passport: null,
    photo: null,
    transcript: null,
    bankStatement: null,
    familyCertificate: null,
  });

  // -------- PREFILL FROM BACKEND --------
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        if (!routeId) {
          setError("Missing ID in route.");
          return;
        }

        console.log("🔍 Fetching application with ID:", routeId);
        const app = await getApplicationByIdOrKoeduId(routeId);
        console.log("📦 Received application payload:", app);

        if (!alive) return;

        if (!app || (!app._id && !app.id && !app.koeduId)) {
          console.warn("⚠️ No application found for ID:", routeId);
          setError(
            "No existing application found. You can fill out a new one.",
          );
          return;
        }

        setIsEditing(true);
        setRealAppId(app._id || app.id || app.koeduId);

        // 1. Remplir les données personnelles
        const nextForm = {
          fullName: app.fullName || "",
          nationality: app.nationality || "",
          dob: app.dob || "",
          phone: app.phone || "",
          email: app.email || "",
        };
        setFormData(nextForm);

        // 2. Formater la date de naissance
        if (app.dob) {
          let iso = "";
          let dObj = new Date();

          if (/^\d{2}\/\d{2}\/\d{4}$/.test(app.dob)) {
            const [d, m, y] = app.dob.split("/");
            iso = `${y}-${m}-${d}`;
            dObj = new Date(Number(y), Number(m) - 1, Number(d));
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(app.dob)) {
            iso = app.dob;
            const [y, m, d] = app.dob.split("-");
            dObj = new Date(Number(y), Number(m) - 1, Number(d));
            nextForm.dob = `${d}/${m}/${y}`;
            setFormData({ ...nextForm });
          }

          if (iso) setDobISO(iso);
          if (!Number.isNaN(dObj.getTime())) setDateObject(dObj);
        }

        // 3. Éducation & Parrain
        setEduData({
          lastSchool: app.lastSchool || "",
          major: app.major || "",
        });
        setSponsor(app.sponsor || "self");

        // 4. Documents joints
        setDocs({
          passport:
            app.passportName || app.passportUrl || app.passport
              ? {
                  name: app.passportName || "Passport.pdf",
                  url: app.passportUrl || app.passport,
                  isExisting: true,
                }
              : null,
          transcript:
            app.transcriptName || app.transcriptUrl || app.transcript
              ? {
                  name: app.transcriptName || "Transcript.pdf",
                  url: app.transcriptUrl || app.transcript,
                  isExisting: true,
                }
              : null,
          bankStatement:
            app.bankStatementName || app.bankStatementUrl || app.bankStatement
              ? {
                  name: app.bankStatementName || "BankStatement.pdf",
                  url: app.bankStatementUrl || app.bankStatement,
                  isExisting: true,
                }
              : null,
          familyCertificate:
            app.familyCertificateName ||
            app.familyCertificateUrl ||
            app.familyCertificate
              ? {
                  name: app.familyCertificateName || "FamilyCert.pdf",
                  url: app.familyCertificateUrl || app.familyCertificate,
                  isExisting: true,
                }
              : null,
          photo:
            app.photoName || app.photoUrl || app.photo
              ? {
                  name: app.photoName || "Photo.png",
                  url: app.photoUrl || app.photo,
                  isExisting: true,
                }
              : null,
        });

        if (app.programTypeLabel) setProgramTypeLabel(app.programTypeLabel);
        if (app.programName) setProgramName(app.programName);
      } catch (e) {
        console.error("❌ Language apply load error:", e);
        if (alive) setError("Could not load application data.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [routeId]);

  // -------- HANDLERS --------
  const handleInput = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleEduInput = (field, value) =>
    setEduData((prev) => ({ ...prev, [field]: value }));

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const onDateChange = (_event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setDateObject(selectedDate);
      const d = String(selectedDate.getDate()).padStart(2, "0");
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const y = selectedDate.getFullYear();
      handleInput("dob", `${d}/${m}/${y}`);
    }
  };

  const onWebDateChange = (e) => {
    const iso = e.target.value;
    setDobISO(iso);
    if (!iso) return handleInput("dob", "");
    const [y, m, d] = iso.split("-");
    handleInput("dob", `${d}/${m}/${y}`);
  };

  const pickDocument = async (key) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDocs((prev) => ({ ...prev, [key]: result.assets[0] }));
      }
    } catch {
      showAlert("Error", "Upload failed");
    }
  };

  const removeDocument = (key) => setDocs((prev) => ({ ...prev, [key]: null }));

  const openExistingDocument = (url) => {
    if (!url) return;
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    if (Platform.OS === "web") {
      window.open(fullUrl, "_blank");
    } else {
      Linking.openURL(fullUrl);
    }
  };

  // -------- SAVE / UPDATE APPLICATION --------
  const handleSaveChanges = async () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      showAlert(
        "Validation Error",
        "Please fill in all required fields (Full Name, Email).",
      );
      return;
    }

    if (!docs.bankStatement) {
      showAlert(
        "Missing Document",
        "Please upload the Bank Balance Certificate.",
      );
      return;
    }
    if (!docs.passport) {
      showAlert("Missing Document", "Please upload the Passport copy.");
      return;
    }
    if (!docs.transcript) {
      showAlert("Missing Document", "Please upload the Transcript.");
      return;
    }

    setSaving(true);
    try {
      const targetId = realAppId || routeId;
      const formDataToSend = new FormData();

      formDataToSend.append("fullName", formData.fullName.trim());
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("lastSchool", eduData.lastSchool);
      formDataToSend.append("major", eduData.major);
      formDataToSend.append("sponsor", sponsor);

      const appendFileIfNew = (key, fileObj) => {
        if (!fileObj || fileObj.isExisting) return;

        if (fileObj.file && Platform.OS === "web") {
          formDataToSend.append(key, fileObj.file);
        } else if (fileObj.uri) {
          formDataToSend.append(key, {
            uri: fileObj.uri,
            name: fileObj.name || `${key}.pdf`,
            type: fileObj.mimeType || fileObj.type || "application/pdf",
          });
        }
      };

      appendFileIfNew("passport", docs.passport);
      appendFileIfNew("transcript", docs.transcript);
      appendFileIfNew("bankStatement", docs.bankStatement);
      appendFileIfNew("familyCertificate", docs.familyCertificate);
      appendFileIfNew("photo", docs.photo);

      console.log("🚀 Submitting update to /api/applications/" + targetId);

      await apiFetch(`/api/applications/${targetId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      showAlert("Success", "Application updated successfully!");
      router.push("/student/dashboard");
    } catch (err) {
      console.error("❌ Update application error:", err);
      showAlert("Error", err?.message || "Failed to update application.");
    } finally {
      setSaving(false);
    }
  };

  const webDateInputStyle = {
    width: "100%",
    backgroundColor: "transparent",
    color: "#FFFFFF",
    border: "none",
    outline: "none",
    fontSize: 14,
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={styles.screen}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your application...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.bgStart, COLORS.bgEnd]}
      style={styles.screen}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>
              {isEditing ? "Edit Application" : "Language Application"}
            </Text>
            <Text style={styles.headerSubtitle}>ID: {routeId || "—"}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Program résumé */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Program</Text>
              <Text style={styles.summaryValue}>
                {programName || "Korean Language"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Program type</Text>
              <Text style={styles.summaryValue}>
                {programTypeLabel || "Language Program"}
              </Text>
            </View>
          </View>

          {/* SECTION 1: Personal Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="person-circle-outline" size={20} /> Personal
              Details
            </Text>

            <InputField
              icon="person-outline"
              placeholder="Full Legal Name"
              value={formData.fullName}
              onChange={(t) => handleInput("fullName", t)}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <SelectField
                  icon="flag-outline"
                  placeholder="Nationality"
                  value={formData.nationality}
                  onPress={() => setShowCountryPicker(true)}
                />
              </View>

              <View style={{ flex: 1 }}>
                {Platform.OS === "web" ? (
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={COLORS.textMuted}
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <input
                        type="date"
                        style={webDateInputStyle}
                        value={dobISO}
                        onChange={onWebDateChange}
                      />
                    </View>
                  </View>
                ) : (
                  <SelectField
                    icon="calendar-outline"
                    placeholder="DD/MM/YYYY"
                    value={formData.dob}
                    onPress={() => setShowDatePicker(true)}
                  />
                )}
              </View>
            </View>

            <InputField
              icon="mail-outline"
              placeholder="Email Address"
              value={formData.email}
              onChange={(t) => handleInput("email", t)}
              keyboard="email-address"
            />
            <InputField
              icon="call-outline"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(t) => handleInput("phone", t)}
              keyboard="phone-pad"
            />
          </View>

          {/* SECTION 2: Education */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="school-outline" size={20} /> Education
            </Text>

            <InputField
              icon="business-outline"
              placeholder="Last School Attended"
              value={eduData.lastSchool}
              onChange={(t) => handleEduInput("lastSchool", t)}
            />
            <InputField
              icon="ribbon-outline"
              placeholder="Major / Stream (Optional)"
              value={eduData.major}
              onChange={(t) => handleEduInput("major", t)}
            />
          </View>

          {/* SECTION 3: Financial Proof */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="cash-outline" size={20} /> Financial Proof
            </Text>

            <View style={styles.toggleContainer}>
              <Pressable
                style={[
                  styles.toggleBtn,
                  sponsor === "self" && styles.toggleActive,
                ]}
                onPress={() => setSponsor("self")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    sponsor === "self" && styles.toggleTextActive,
                  ]}
                >
                  My Account
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.toggleBtn,
                  sponsor === "parents" && styles.toggleActive,
                ]}
                onPress={() => setSponsor("parents")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    sponsor === "parents" && styles.toggleTextActive,
                  ]}
                >
                  Parents' Account
                </Text>
              </Pressable>
            </View>

            <View style={{ marginTop: 10 }}>
              <UploadBox
                label="Bank Balance Certificate"
                icon="bank"
                file={docs.bankStatement}
                docKey="bankStatement"
                onPick={pickDocument}
                onView={openExistingDocument}
                onDelete={removeDocument}
              />

              {sponsor === "parents" && (
                <View style={styles.conditionalBox}>
                  <UploadBox
                    label="Family Relation Certificate"
                    icon="account-group"
                    file={docs.familyCertificate}
                    docKey="familyCertificate"
                    onPick={pickDocument}
                    onView={openExistingDocument}
                    onDelete={removeDocument}
                  />
                </View>
              )}
            </View>
          </View>

          {/* SECTION 4: Standard Docs */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="document-text-outline" size={20} /> Standard
              Documents
            </Text>

            <UploadBox
              label="Passport"
              icon="passport"
              file={docs.passport}
              docKey="passport"
              onPick={pickDocument}
              onView={openExistingDocument}
              onDelete={removeDocument}
            />
            <UploadBox
              label="Transcript (Last School)"
              icon="school"
              file={docs.transcript}
              docKey="transcript"
              onPick={pickDocument}
              onView={openExistingDocument}
              onDelete={removeDocument}
            />
            <UploadBox
              label="ID Photo (Optional)"
              icon="camera-account"
              file={docs.photo}
              docKey="photo"
              required={false}
              onPick={pickDocument}
              onView={openExistingDocument}
              onDelete={removeDocument}
            />
          </View>

          {/* BOUTON DE SOUMISSION / MISE À JOUR */}
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              (saving || pressed) && { opacity: 0.8 },
            ]}
            onPress={handleSaveChanges}
            disabled={saving}
          >
            <LinearGradient
              colors={[COLORS.primary, "#F59E0B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              {saving ? (
                <ActivityIndicator color="#111" />
              ) : (
                <>
                  <Text style={styles.submitText}>Save Changes</Text>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#111"
                  />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* COUNTRY PICKER */}
      <Modal
        animationType="slide"
        transparent
        visible={showCountryPicker}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Nationality</Text>
              <Pressable onPress={() => setShowCountryPicker(false)}>
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>

            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.countryItem}
                  onPress={() => {
                    handleInput("nationality", item);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.countryText,
                      formData.nationality === item && {
                        color: COLORS.primary,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* DATE PICKER (MOBILE) */}
      {showDatePicker && Platform.OS !== "web" && (
        <View
          style={Platform.OS === "ios" ? styles.iosDatePickerContainer : {}}
        >
          <DateTimePicker
            value={dateObject}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
            themeVariant="dark"
          />
        </View>
      )}
    </LinearGradient>
  );
}
