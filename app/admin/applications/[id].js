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

  if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) return maybeUrl;

  if (maybeUrl.startsWith("/")) return `${API_BASE_URL}${maybeUrl}`;

  return `${API_BASE_URL}/${maybeUrl}`;
}

function looksLikeImage(url) {
  if (!url) return false;
  const u = String(url).toLowerCase();
  return (
    u.endsWith(".png") ||
    u.endsWith(".jpg") ||
    u.endsWith(".jpeg") ||
    u.endsWith(".webp") ||
    u.includes("image/")
  );
}

function guessDocsFromApplication(app) {
  if (!app) return [];

  const docs = [];
  const add = (label, url, name) => {
    if (!url && !name) return;
    docs.push({ label, url: url || null, name: name || null });
  };

  add("Passport", app.passportUrl, app.passportName);
  add("Transcript", app.transcriptUrl, app.transcriptName);
  add("Bank balance certificate", app.bankStatementUrl, app.bankStatementName);
  add("ID Photo", app.photoUrl, app.photoName);

  if (app.sponsor === "parents") {
    add(
      "Family relation certificate",
      app.familyCertificateUrl,
      app.familyCertificateName
    );
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

  const docs = useMemo(() => guessDocsFromApplication(application), [application]);

  const statusColor = STATUS_COLORS[status] || COLORS.textMuted;
  const statusLabel = STATUS_LABELS[status] || status || "Unknown";

  // ✅ Reliable open (no canOpenURL)
  const handleOpenUrl = useCallback(async (url) => {
    const full = ensureAbsoluteUrl(url);
    if (!full) {
      alert("File URL not available.");
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
      alert("Failed to open the document.");
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
    [application]
  );

  /* ================================
     LOADING/ERROR STATES
     ================================ */

  if (checkingAdmin || loading) {
    const message = checkingAdmin ? "Checking admin access..." : "Loading application...";
    return (
      <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
        <SafeAreaView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{message}</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error || !application) {
    return (
      <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
        <SafeAreaView style={[styles.centerContainer, { padding: 20 }]}>
          <Ionicons name="alert-circle-outline" size={28} color={COLORS.primary} />
          <Text style={styles.errorTitle}>Failed to load application</Text>
          <Text style={styles.errorText}>{error || "Application not found."}</Text>
          <Pressable onPress={() => router.back()} style={styles.goBackButton}>
            <Text style={styles.goBackButtonText}>Go back</Text>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  /* ================================
     RENDER
     ================================ */

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="arrow-back-outline" size={18} color={COLORS.text} />
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
              <Ionicons name="speedometer-outline" size={18} color={COLORS.text} />
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

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* 1. STATUS + METADATA */}
          <Card>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabelText}>Current status</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusBadgeText}>{statusLabel}</Text>
                </View>
              </View>

              <View>
                <Text style={styles.metaText}>Submitted: {formatDate(createdAt)}</Text>
                {updatedAt && <Text style={styles.metaText}>Updated: {formatDate(updatedAt)}</Text>}
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

          {/* 2. APPLICATION SUMMARY */}
          <Card title="Application Summary">
            <InfoRow label="KOEDU ID" value={koeduId} />
            <InfoRow label="Program" value={programName} />
            <InfoRow label="Program type" value={programTypeLabel || TYPE_LABELS[programType] || "—"} />
            <InfoRow label="University" value={universityName} />
            <InfoRow label="Intake" value={intake} />
            <InfoRow label="Campus" value={campus} />

            <Text style={styles.summaryNote}>This data comes from your submitted application.</Text>
          </Card>

          {/* 3. APPLICATION DETAILS */}
          <Card title="Application Details">
            <Text style={styles.detailGroupTitle}>Personal details</Text>
            <InfoRow label="Full name" value={fullName} />
            <InfoRow label="Nationality" value={nationality} />
            <InfoRow label="Date of Birth" value={dob} />
            <InfoRow label="Email" value={email} />
            <InfoRow label="Phone" value={phone} />
            {passportNumber ? <InfoRow label="Passport number" value={passportNumber} /> : null}

            <Text style={styles.detailGroupTitle}>Education</Text>
            <InfoRow label="Last school" value={lastSchool} />
            <InfoRow label="Major / Stream" value={major} />

            <Text style={styles.detailGroupTitle}>Financial sponsor</Text>
            <InfoRow label="Sponsor" value={sponsor} />
          </Card>

          {/* 4. DOCUMENTS */}
<Card title="Submitted documents">
  {docs.length === 0 ? (
    <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
      No documents found for this application.
    </Text>
  ) : (
    docs.map((doc, idx) => {
      const label = doc.label || `Document ${idx + 1}`;
      const fullUrl = ensureAbsoluteUrl(doc.url);
      const isImg = looksLikeImage(fullUrl);

      const onPressDoc = () => {
        if (!doc?.url) {
          alert("This document has no URL yet.");
          return;
        }
        handleOpenUrl(doc.url);
      };

      return (
        <Pressable
          key={`${label}-${idx}`}
          onPress={onPressDoc}
          disabled={!doc?.url}
          style={({ pressed }) => [
            styles.documentItem,
            pressed && doc?.url ? { opacity: 0.9 } : null,
            !doc?.url ? { opacity: 0.6 } : null,
          ]}
        >
          {/* Label */}
          <Text style={styles.documentLabel}>{label}</Text>

          {/* Content */}
          {!fullUrl ? (
            <View style={styles.missingWrap}>
              <Ionicons name="document-outline" size={16} color={COLORS.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={styles.missingTitle}>
                  {doc.name ? "File name:" : "No file uploaded"}
                </Text>
                {doc.name ? <Text style={styles.missingName}>{doc.name}</Text> : null}
                <Text style={[styles.urlTiny, { marginTop: 6, opacity: 0.9 }]}>
                  (No URL available)
                </Text>
              </View>

              {doc?.url ? (
                <Ionicons name="open-outline" size={18} color={COLORS.primary} />
              ) : null}
            </View>
          ) : (
            <>
              {isImg ? (
                <View style={styles.imageWrap}>
                  <Image source={{ uri: fullUrl }} style={styles.image} resizeMode="cover" />
                </View>
              ) : (
                <View style={styles.fileRow}>
                  <Ionicons name="document-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.fileButtonText}>
                    {doc.name || "Open document"}
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Ionicons name="open-outline" size={18} color={COLORS.primary} />
                </View>
              )}

              {/* URL is also clickable (same pressable parent) */}
              <Text style={styles.urlTiny}>{fullUrl}</Text>
            </>
          )}
        </Pressable>
      );
    })
  )}
</Card>


          {/* 5. EXTRA / NOTES */}
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
