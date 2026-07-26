// app/apply/language/[id].js
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

// Styles KOEDU pour Language
import styles, { COLORS } from "../../../styles/apply/bachelorstyle";

// ✅ Tous les pays (si tu as déjà constants/countries, tu peux importer à la place)
import { COUNTRIES } from "../../../constants/countries";
// Si tu préfères la petite liste, tu peux commenter la ligne au-dessus
// et décommenter ceci :
// const COUNTRIES = ["Vietnam","Uzbekistan","China","Mongolia","France","United States","Japan","Russia",
//   "Philippines","Indonesia","Myanmar","Bangladesh","Nepal","India","Pakistan",
//   "Kazakhstan","Kyrgyzstan","Thailand","Other",
// ];

export default function LanguageApplyFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // -------- STATE: Form Data --------
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

  // -------- HANDLERS --------
  const handleInput = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleEduInput = (field, value) =>
    setEduData((prev) => ({ ...prev, [field]: value }));

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setDateObject(selectedDate);
      const d = selectedDate.getDate().toString().padStart(2, "0");
      const m = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const y = selectedDate.getFullYear();
      handleInput("dob", `${d}/${m}/${y}`);
    }
  };

  const onWebDateChange = (e) => {
    const iso = e.target.value;
    setDobISO(iso);
    if (!iso) {
      handleInput("dob", "");
      return;
    }
    const [y, m, d] = iso.split("-");
    handleInput("dob", `${d}/${m}/${y}`);
  };

  const pickDocument = async (key) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setDocs((prev) => ({ ...prev, [key]: result.assets[0] }));
      }
    } catch (err) {
      Alert.alert("Error", "Upload failed");
    }
  };

  const removeDocument = (key) =>
    setDocs((prev) => ({ ...prev, [key]: null }));

  const validateAndProceed = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.nationality ||
      !formData.dob
    ) {
      return Alert.alert(
        "Missing Info",
        "Please fill in all Personal Information fields."
      );
    }

    if (!eduData.lastSchool)
      return Alert.alert("Missing Info", "Enter last school attended.");

    if (!docs.passport || !docs.transcript || !docs.bankStatement) {
      return Alert.alert(
        "Missing Docs",
        "Passport, Transcript, and Bank Statement are required."
      );
    }

    if (sponsor === "parents" && !docs.familyCertificate) {
      return Alert.alert(
        "Missing Cert",
        "Parent sponsorship requires Family Relation Certificate."
      );
    }

    router.push({
      pathname: "/apply/summary",
      params: {
        track: "language",
        id,
        ...formData,
        ...eduData,
        sponsor,
        passportName: docs.passport?.name,
        transcriptName: docs.transcript?.name,
        bankStatementName: docs.bankStatement?.name,
        familyCertificateName: docs.familyCertificate?.name,
        photoName: docs.photo?.name,
      },
    });
  };

  // -------- UI SUB-COMPONENTS --------
  const InputField = ({ icon, placeholder, value, onChange, keyboard = "default" }) => (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={20}
        color={COLORS.textMuted}
        style={{ marginRight: 10 }}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
      />
    </View>
  );

  const SelectField = ({ icon, placeholder, value, onPress }) => (
    <Pressable style={styles.inputContainer} onPress={onPress}>
      <Ionicons
        name={icon}
        size={20}
        color={COLORS.textMuted}
        style={{ marginRight: 10 }}
      />
      <Text
        style={[styles.inputText, !value && { color: COLORS.textMuted }]}
      >
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

  const UploadBox = ({ label, file, docKey, icon, required = true }) => (
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
        <Text style={styles.uploadSubText}>
          {file ? file.name : "Select File..."}
        </Text>
      </View>
      {!file ? (
        <Pressable style={styles.uploadBtn} onPress={() => pickDocument(docKey)}>
          <MaterialCommunityIcons name={icon} size={20} color="#000" />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.deleteBtn} onPress={() => removeDocument(docKey)}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </Pressable>
      )}
    </View>
  );

  // Style simple pour l’input date web
  const webDateInputStyle = {
    width: "100%",
    backgroundColor: "transparent",
    color: COLORS.text,
    border: "none",
    outline: "none",
    fontSize: 14,
  };

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={styles.screen}>
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
            <Text style={styles.headerTitle}>Language Program Application</Text>
            <Text style={styles.headerSubtitle}>
              Program ID: {id} · Korean Language Program
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: "60%" }]} />
          </View>
          <Text style={styles.stepText}>Step 2 of 3: Information & Docs</Text>

          {/* SECTION 1: Personal Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="person-circle-outline" size={20} /> Personal Details
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
            <Text style={styles.helperText}>
              Who owns the bank account ($20,000+)?
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
              />

              {sponsor === "parents" && (
                <View style={styles.conditionalBox}>
                  <View style={styles.alertRow}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={styles.alertText}>
                      Proof of relationship required
                    </Text>
                  </View>
                  <UploadBox
                    label="Family Relation Certificate"
                    icon="account-group"
                    file={docs.familyCertificate}
                    docKey="familyCertificate"
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
            />
            <UploadBox
              label="Transcript (Last School)"
              icon="school"
              file={docs.transcript}
              docKey="transcript"
            />
            <UploadBox
              label="ID Photo (Optional)"
              icon="camera-account"
              file={docs.photo}
              docKey="photo"
              required={false}
            />
          </View>

          {/* SUBMIT */}
          <Pressable style={styles.submitBtn} onPress={validateAndProceed}>
            <LinearGradient
              colors={[COLORS.primary, "#F59E0B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.submitText}>Review Application</Text>
              <Ionicons name="arrow-forward-circle" size={24} color="#111" />
            </LinearGradient>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* COUNTRY PICKER (Modal natif) */}
      <Modal
        animationType="slide"
        transparent={true}
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
                  {formData.nationality === item && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* DATE PICKER (MOBILE) */}
      {showDatePicker && Platform.OS !== "web" && (
        <View
          style={
            Platform.OS === "ios" ? styles.iosDatePickerContainer : {}
          }
        >
          {Platform.OS === "ios" && (
            <View style={styles.iosPickerHeader}>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text
                  style={{ color: COLORS.primary, fontWeight: "700" }}
                >
                  Done
                </Text>
              </Pressable>
            </View>
          )}
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
