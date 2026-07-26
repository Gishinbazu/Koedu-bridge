// app/admin/applications/[id].js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { API_BASE_URL, apiFetch } from "../../../services/apiClient";
import { fetchApplicationById } from "../../../services/applicationsApi";
import {
  COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  TYPE_LABELS,
  styles,
} from "../../../styles/Adminstyle/applicationDetail.styles";
import { Card, InfoRow, StatusButton } from "./applicationDetail.components";

/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function ensureAbsoluteUrl(maybeUrl) {
  if (!maybeUrl || typeof maybeUrl !== "string") return null;

  if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) {
    return maybeUrl;
  }

  if (maybeUrl.startsWith("/")) {
    return `${API_BASE_URL}${maybeUrl}`;
  }

  return `${API_BASE_URL}/${maybeUrl}`;
}

function looksLikeImage(url, name) {
  const str = (url || name || "").toLowerCase();
  return (
    str.endsWith(".png") ||
    str.endsWith(".jpg") ||
    str.endsWith(".jpeg") ||
    str.endsWith(".webp") ||
    str.includes("image/")
  );
}

function guessDocsFromApplication(app) {
  if (!app) return [];

  const docs = [];
  const add = (label, url, name) => {
    // Si l'URL n'est pas explicite, on tente de la reconstruire si le nom du fichier existe
    let finalUrl = url;
    if (!finalUrl && name) {
      finalUrl = `/uploads/${name}`;
    }

    if (!finalUrl && !name) return;
    docs.push({ label, url: finalUrl || null, name: name || null });
  };

  // 1. Champs à plat
  add("Passport", app.passportUrl || app.passport, app.passportName);
  add("Transcript", app.transcriptUrl || app.transcript, app.transcriptName);
  add(
    "Bank balance certificate",
    app.bankStatementUrl || app.bankStatement,
    app.bankStatementName,
  );
  add("ID Photo", app.photoUrl || app.photo, app.photoName);

  if (app.sponsor === "parents") {
    add(
      "Family relation certificate",
      app.familyCertificateUrl || app.familyCertificate,
      app.familyCertificateName,
    );
  }

  // 2. Objet dynamique `documents` si présent
  if (app.documents && typeof app.documents === "object") {
    Object.entries(app.documents).forEach(([key, val]) => {
      if (typeof val === "string" && val) {
        const formattedLabel = key.replace(/([A-Z])/g, " $1").trim();
        add(
          formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1),
          val,
          val.split("/").pop(),
        );
      } else if (val && typeof val === "object") {
        const formattedLabel = key.replace(/([A-Z])/g, " $1").trim();
        add(
          formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1),
          val.url || val.path,
          val.name || `${key}`,
        );
      }
    });
  }

  const seen = new Set();
  return docs.filter((d) => {
    const key = `${d.label}|${d.name || ""}|${d.url || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* =========================================================
   SCREEN
   ========================================================= */

export default function AdminApplicationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const appId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        setError(null);

        const raw = await AsyncStorage.getItem("koedu_user");
        const u = raw ? JSON.parse(raw) : null;

        if (!u || u.role !== "admin") {
          router.replace(u ? "/" : "/auth/login");
          return;
        }

        if (!appId) {
          router.replace("/admin/applications");
          return;
        }

        setLoading(true);
        const res = await fetchApplicationById(appId);
        const app = res?.application || res;
        setApplication(app);
      } catch (e) {
        console.log("Admin application detail error:", e);
        setError(e?.message || "Failed to load application.");
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    }
    loadApplication();
  }, [router, appId]);

  const {
    status,
    fullName,
    programType,
    createdAt,
    updatedAt,
    passportNumber,
    programName,
    intake,
    campus,
    koeduId,
    universityName,
    programTypeLabel,
    nationality,
    dob,
    email,
    phone,
    lastSchool,
    major,
    sponsor,
    motivation,
    notes,
    comments,
  } = application || {};

  const docs = useMemo(
    () => guessDocsFromApplication(application),
    [application],
  );

  const statusColor = STATUS_COLORS[status] || COLORS.textMuted;
  const statusLabel = STATUS_LABELS[status] || status || "Unknown";

  const handleOpenUrl = useCallback(async (url) => {
    const full = ensureAbsoluteUrl(url);
    if (!full) {
      alert("Fichier introuvable.");
      return;
    }

    try {
      if (Platform.OS === "web") {
        window.open(full, "_blank");
        return;
      }
      await Linking.openURL(full);
    } catch (e) {
      console.log("Open file error:", e);
      alert("Impossible d'ouvrir le document.");
    }
  }, []);

  const handleChangeStatus = useCallback(
    async (nextStatus) => {
      const id = application?._id || application?.id;
      if (!id) return;

      try {
        setUpdatingStatus(true);
        const res = await apiFetch(`/api/admin/applications/${id}/status`, {
          method: "PATCH",
          body: { status: nextStatus },
        });

        const updated = res.application || res;
        setApplication(updated);
      } catch (err) {
        console.log("Update status error:", err);
        alert(err?.message || "Failed to update status.");
      } finally {
        setUpdatingStatus(false);
      }
    },
    [application],
  );

  if (checkingAdmin || loading) {
    return (
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading application...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error || !application) {
    return (
      <LinearGradient
        colors={[COLORS.bgStart, COLORS.bgEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={[styles.centerContainer, { padding: 20 }]}>
          <Ionicons
            name="alert-circle-outline"
            size={28}
            color={COLORS.primary}
          />
          <Text style={styles.errorTitle}>Failed to load application</Text>
          <Text style={styles.errorText}>
            {error || "Application not found."}
          </Text>
          <Pressable onPress={() => router.back()} style={styles.goBackButton}>
            <Text style={styles.goBackButtonText}>Go back</Text>
          </Pressable>
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

            <Pressable
              onPress={() => router.replace("/admin/dashboard")}
              style={({ pressed }) => [
                styles.backButton,
                { marginLeft: 6 },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons
                name="speedometer-outline"
                size={18}
                color={COLORS.text}
              />
              <Text style={styles.backButtonText}>Dashboard</Text>
            </Pressable>

            <Ionicons
              name="document-text-outline"
              size={22}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />

            <View>
              <Text style={styles.headerTitle}>Application detail</Text>
              <Text style={styles.headerSubtitle}>
                {fullName || "—"} · {TYPE_LABELS[programType] || "Program"}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. STATUS */}
          <Card>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabelText}>Current status</Text>
                <View
                  style={[styles.statusBadge, { backgroundColor: statusColor }]}
                >
                  <Text style={styles.statusBadgeText}>{statusLabel}</Text>
                </View>
              </View>

              <View>
                <Text style={styles.metaText}>
                  Submitted: {formatDate(createdAt)}
                </Text>
                {updatedAt && (
                  <Text style={styles.metaText}>
                    Updated: {formatDate(updatedAt)}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.statusActionsRow}>
              <StatusButton
                label="Mark as pending"
                icon="time-outline"
                active={status === "pending"}
                color={COLORS.badgePending}
                onPress={() => handleChangeStatus("pending")}
                loading={updatingStatus}
              />
              <StatusButton
                label="In review"
                icon="search-outline"
                active={status === "in_review"}
                color={COLORS.badgeReview}
                onPress={() => handleChangeStatus("in_review")}
                loading={updatingStatus}
              />
              <StatusButton
                label="Accept"
                icon="checkmark-circle-outline"
                active={status === "accepted"}
                color={COLORS.badgeAccepted}
                onPress={() => handleChangeStatus("accepted")}
                loading={updatingStatus}
              />
              <StatusButton
                label="Reject"
                icon="close-circle-outline"
                active={status === "rejected"}
                color={COLORS.badgeRejected}
                onPress={() => handleChangeStatus("rejected")}
                loading={updatingStatus}
              />
            </View>
          </Card>

          {/* 2. SUMMARY */}
          <Card title="Application Summary">
            <InfoRow label="KOEDU ID" value={koeduId} />
            <InfoRow label="Program" value={programName} />
            <InfoRow
              label="Program type"
              value={programTypeLabel || TYPE_LABELS[programType] || "—"}
            />
            <InfoRow label="University" value={universityName} />
            <InfoRow label="Intake" value={intake} />
            <InfoRow label="Campus" value={campus} />
          </Card>

          {/* 3. DETAILS */}
          <Card title="Application Details">
            <Text style={styles.detailGroupTitle}>Personal details</Text>
            <InfoRow label="Full name" value={fullName} />
            <InfoRow label="Nationality" value={nationality} />
            <InfoRow label="Date of Birth" value={dob} />
            <InfoRow label="Email" value={email} />
            <InfoRow label="Phone" value={phone} />
            {passportNumber ? (
              <InfoRow label="Passport number" value={passportNumber} />
            ) : null}

            <Text style={styles.detailGroupTitle}>Education</Text>
            <InfoRow label="Last school" value={lastSchool} />
            <InfoRow label="Major / Stream" value={major} />

            <Text style={styles.detailGroupTitle}>Financial sponsor</Text>
            <InfoRow label="Sponsor" value={sponsor} />
          </Card>

          {/* 4. DOCUMENTS CLIQUABLES (PNG + PDF) */}
          <Card title={`Submitted documents (${docs.length})`}>
            {docs.length === 0 ? (
              <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
                No documents uploaded by the student yet.
              </Text>
            ) : (
              docs.map((doc, idx) => {
                const label = doc.label || `Document ${idx + 1}`;
                const fullUrl = ensureAbsoluteUrl(doc.url);
                const isImage = looksLikeImage(fullUrl, doc.name);

                return (
                  <Pressable
                    key={`${label}-${idx}`}
                    onPress={() => handleOpenUrl(doc.url)}
                    style={({ pressed }) => [
                      localStyles.docCard,
                      pressed && { opacity: 0.8, backgroundColor: "#0f172a" },
                    ]}
                  >
                    <View style={localStyles.docHeaderRow}>
                      <Text style={localStyles.docLabel}>{label}</Text>
                      {isImage ? (
                        <Text style={localStyles.badgeImage}>PNG / Image</Text>
                      ) : (
                        <Text style={localStyles.badgePdf}>PDF</Text>
                      )}
                    </View>

                    {/* APERÇU DE L'IMAGE SI C'EST UN PNG */}
                    {isImage && fullUrl ? (
                      <View style={localStyles.imageWrap}>
                        <Image
                          source={{ uri: fullUrl }}
                          style={localStyles.image}
                          resizeMode="cover"
                        />
                      </View>
                    ) : null}

                    <View style={localStyles.fileRow}>
                      <Ionicons
                        name={
                          isImage ? "image-outline" : "document-text-outline"
                        }
                        size={22}
                        color={isImage ? COLORS.primary : "#38BDF8"}
                      />

                      <View style={{ flex: 1 }}>
                        <Text style={localStyles.fileName} numberOfLines={1}>
                          {doc.name || `${label}`}
                        </Text>
                        <Text style={localStyles.clickHint}>
                          Click to view full file
                        </Text>
                      </View>

                      <View style={localStyles.openBtn}>
                        <Ionicons name="open-outline" size={16} color="#FFF" />
                        <Text style={localStyles.openBtnText}>Open</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </Card>

          {/* 5. NOTES */}
          {motivation || notes || comments ? (
            <Card title="Additional notes">
              {motivation ? (
                <>
                  <Text style={styles.detailGroupTitle}>Motivation</Text>
                  <Text style={styles.longText}>{motivation}</Text>
                </>
              ) : null}
              {notes ? (
                <>
                  <Text style={styles.detailGroupTitle}>Notes</Text>
                  <Text style={styles.longText}>{notes}</Text>
                </>
              ) : null}
              {comments ? (
                <>
                  <Text style={styles.detailGroupTitle}>Comments</Text>
                  <Text style={styles.longText}>{comments}</Text>
                </>
              ) : null}
            </Card>
          ) : null}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  docCard: {
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
    marginBottom: 12,
  },
  docHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  docLabel: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "700",
  },
  badgeImage: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: "rgba(249,115,22,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePdf: {
    color: "#38BDF8",
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: "rgba(56,189,248,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  imageWrap: {
    height: 160,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fileName: {
    color: "#F9FAFB",
    fontSize: 13,
    fontWeight: "600",
  },
  clickHint: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  openBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  openBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
