// app/apply/summary.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { updateApplicationByKoedu } from "../../services/applicationsApi";

// Importation des styles et des couleurs
import styles, { COLORS } from "../../styles/apply/summarystyle";

export default function ApplicationSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    id, // 👈 koeduId (peut être string[] selon Expo Router)
    programTypeLabel,
    fullName,
    nationality,
    dob,
    phone,
    email,
    lastSchool,
    major,
    sponsor,
    passportName,
    transcriptName,
    bankStatementName,
    familyCertificateName,
    photoName,
  } = params;

  // ✅ Expo Router: params peuvent être string | string[]
  const pick = (v) => (Array.isArray(v) ? v[0] : v);

  const idSafe = pick(id);
  const sponsorSafe = pick(sponsor);
  const sponsorKey = (sponsorSafe || "").toLowerCase();

  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    try {
      if (!idSafe) {
        Alert.alert(
          "Missing ID",
          "Application ID (koeduId) is missing. Please restart the application process."
        );
        return;
      }

      // Validation minimale
      if (!passportName || !transcriptName || !bankStatementName) {
        Alert.alert(
          "Missing documents",
          "Passport, Transcript, and Bank Balance Certificate are required before submission."
        );
        return;
      }

      // ✅ si sponsor parents → family certificate required
      if (sponsorKey === "parents" && !familyCertificateName) {
        Alert.alert(
          "Missing document",
          "Family relation certificate is required when sponsor is Parents."
        );
        return;
      }

      // Payload : uniquement les champs que l'étudiant remplit ici
      const payload = {
        fullName,
        nationality,
        dob,
        phone,
        email,
        lastSchool,
        major,
        sponsor: sponsorSafe, // ✅ on garde la valeur safe
        passportName,
        transcriptName,
        bankStatementName,
        familyCertificateName: familyCertificateName ?? "",
        photoName: photoName ?? "",
        status: "pending",
      };

      // 🔥 MAJ de l'application déjà créée (par /apply/index.js)
      const result = await updateApplicationByKoedu(idSafe, payload);
      console.log("Application updated:", result);

      // Redirection vers l'écran de succès
      router.replace({
        pathname: "/apply/success",
        params: {
          id: idSafe,
          fullName: fullName ?? "",
          programTypeLabel: programTypeLabel ?? "Program",
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", error?.message || "Server error.");
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.bgStart, COLORS.bgEnd]}
      style={styles.screen}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Review your application</Text>
          <Text style={styles.headerSubtitle}>
            {programTypeLabel || "Program"} · ID: {idSafe || "—"}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={COLORS.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.infoText}>
            Please check all details carefully before final submission.
          </Text>
        </View>

        {/* PERSONAL */}
        <Section title="Personal details">
          <Row label="Full name" value={fullName} />
          <Row label="Nationality" value={nationality} />
          <Row label="Date of Birth" value={dob} />
          <Row label="Email" value={email} />
          <Row label="Phone" value={phone} />
        </Section>

        {/* EDUCATION */}
        <Section title="Education">
          <Row label="Last school" value={lastSchool} />
          <Row label="Major / Stream" value={major} />
        </Section>

        {/* FINANCIAL */}
        <Section title="Financial sponsor">
          <Row
            label="Bank account owner"
            value={
              sponsorKey === "parents"
                ? "Parents / Family member"
                : "Student (self)"
            }
          />
          <Row label="Required balance" value="USD 20,000 or more" />
        </Section>

        {/* DOCUMENTS */}
        <Section title="Uploaded documents">
          <FileRow label="Passport" fileName={passportName} required />
          <FileRow label="Transcript" fileName={transcriptName} required />
          <FileRow
            label="Bank balance certificate"
            fileName={bankStatementName}
            required
          />
          {sponsorKey === "parents" && (
            <FileRow
              label="Family relation certificate"
              fileName={familyCertificateName}
              required
            />
          )}
          <FileRow label="ID Photo" fileName={photoName} required={false} />
        </Section>

        {/* BUTTONS */}
        <View style={styles.btnRow}>
          <Pressable
            style={[styles.btn, styles.btnGhost]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnGhostText}>Back & edit</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={handleSubmit}>
            <LinearGradient
              colors={[COLORS.primary, "#F59E0B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#111827"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.btnText}>Confirm & submit</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function Section({ title, children }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || "—"}</Text>
    </View>
  );
}

// Affichage spécial pour les fichiers
function FileRow({ label, fileName, required = true }) {
  const hasFile = !!fileName;

  return (
    <View style={styles.fileRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.fileNameText}>
          {hasFile
            ? fileName
            : required
            ? "Not uploaded (required)"
            : "Not uploaded (optional)"}
        </Text>
      </View>
      <Ionicons
        name={hasFile ? "checkmark-circle" : "close-circle"}
        size={20}
        color={hasFile ? "#22c55e" : "#f97316"}
      />
    </View>
  );
}
