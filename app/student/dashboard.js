// app/student/dashboard.js
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { API_BASE_URL } from "../../services/apiClient";
import { getCurrentUser } from "../../services/authApi";
import { getStudentApplication } from "../../services/userApi";
import LogoutButton from "../auth/LogoutButton";

import styles, { COLORS } from "../../styles/student/dashboard.styles";

// ---------- HELPERS ----------
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

// ---------- Back Button ----------
function BackButton() {
  const router = useRouter();
  if (!router.canGoBack()) return null;

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        backgroundColor: "rgba(15,23,42,0.9)",
        marginRight: 15,
      }}
    >
      <Ionicons name="chevron-back" size={18} color={COLORS.primary} />
      <Text
        style={{
          color: COLORS.primary,
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        Back
      </Text>
    </Pressable>
  );
}

function SummaryItem({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value || "—"}</Text>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>{label}</Text>
      <Text style={styles.detailsValue}>{value || "—"}</Text>
    </View>
  );
}

function DocumentItem({ label, fileName, fileUrl }) {
  const hasFile = Boolean(fileName || fileUrl);
  const fullUrl = ensureAbsoluteUrl(
    fileUrl || (fileName ? `/uploads/${fileName}` : null),
  );

  const handleOpenDoc = () => {
    if (!fullUrl) return;
    if (Platform.OS === "web") {
      window.open(fullUrl, "_blank");
    } else {
      Linking.openURL(fullUrl);
    }
  };

  return (
    <View style={styles.documentRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.documentName}>{label}</Text>
        <Text
          style={[
            styles.documentStatus,
            { color: hasFile ? "#4ade80" : "#f97316" },
          ]}
          numberOfLines={1}
        >
          {hasFile ? fileName || "Uploaded Document" : "Not uploaded"}
        </Text>
      </View>

      {hasFile && fullUrl ? (
        <Pressable
          onPress={handleOpenDoc}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(249, 115, 22, 0.15)",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "rgba(249, 115, 22, 0.3)",
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
          <Text
            style={{ color: COLORS.primary, fontSize: 11, fontWeight: "700" }}
          >
            View
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function QuickAction({ label, icon, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.actionBtn}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

// ===============================
// DASHBOARD
// ===============================
export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Chargement des données à CHAQUE FOIS que l'écran reprend le focus
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      async function loadDashboardData() {
        try {
          console.log("🔄 Re-fetching latest student application data...");
          const [me, appRes] = await Promise.all([
            getCurrentUser(),
            getStudentApplication(),
          ]);

          if (!alive) return;

          setUser(me?.user || me);
          const applicationData = appRes?.application || appRes;
          setApp(applicationData);
        } catch (e) {
          console.log("Error loading student dashboard:", e);
        } finally {
          if (alive) setLoading(false);
        }
      }

      loadDashboardData();

      return () => {
        alive = false;
      };
    }, []),
  );

  const handleEditApplication = () => {
    if (!app) {
      router.push("/apply");
      return;
    }

    const appId = app.koeduId || app._id || app.id;
    const track = (app.programType || app.track || "language").toLowerCase();

    if (appId) {
      router.push(`/apply/${track}/${appId}`);
    } else {
      router.push("/apply");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!app) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <BackButton />
            <View>
              <Text style={styles.welcome}>Welcome 👋</Text>
              <Text style={styles.name}>
                {user?.fullName || user?.username}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <LogoutButton />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>No application found</Text>
          <Text style={{ color: COLORS.muted, fontSize: 13 }}>
            You haven&apos;t submitted an application yet.
          </Text>
          <View style={{ height: 10 }} />
          <QuickAction
            label="Start application"
            icon="document-text-outline"
            onPress={() => router.push("/apply")}
          />
        </View>
      </ScrollView>
    );
  }

  const progress = app.progress || 25;
  const status = app.status || "pending";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <BackButton />
          <View>
            <Text style={styles.welcome}>Welcome 👋</Text>
            <Text style={styles.name}>{user?.fullName || user?.username}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <LogoutButton />
        </View>
      </View>

      {/* LAYOUT : sidebar gauche + contenu droite */}
      <View style={styles.mainRow}>
        {/* NAV GAUCHE */}
        <View style={styles.sideNav}>
          <Text style={styles.sideNavTitle}>My KOEDU</Text>

          <Pressable style={styles.sideNavBtn} onPress={handleEditApplication}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sideNavBtnText}>Edit Application</Text>
          </Pressable>

          <Pressable
            style={styles.sideNavBtn}
            onPress={() => router.push("/student/applications/profile")}
          >
            <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sideNavBtnText}>My Profile</Text>
          </Pressable>
        </View>

        {/* COLONNE PRINCIPALE */}
        <View style={styles.mainColumn}>
          {/* STATUS + TIMELINE */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Application Status</Text>

            <View style={styles.statusBox}>
              <Ionicons name="time-outline" size={22} color={COLORS.primary} />
              <Text style={styles.statusText}>{status.toUpperCase()}</Text>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{progress}% Completed</Text>

            {app.timeline && (
              <View style={{ marginTop: 12 }}>
                {[
                  {
                    key: "submitted",
                    label: "Application submitted",
                    done: app.timeline.submitted,
                  },
                  {
                    key: "adminReview",
                    label: "KOEDU Bridge review",
                    done: app.timeline.adminReview,
                  },
                  {
                    key: "universityReview",
                    label: "University review",
                    done: app.timeline.universityReview,
                  },
                  {
                    key: "finalDecision",
                    label: "Final decision",
                    done: app.timeline.finalDecision,
                  },
                ].map((step) => (
                  <View key={step.key} style={styles.timelineRow}>
                    <View
                      style={[
                        styles.timelineDot,
                        step.done && {
                          backgroundColor: "#4ade80",
                          borderColor: "#4ade80",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.timelineLabel,
                        step.done && {
                          color: COLORS.text,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* SUMMARY */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Application Summary</Text>

            <SummaryItem label="KOEDU ID" value={app.koeduId} />
            <SummaryItem label="Program" value={app.programName} />
            <SummaryItem
              label="Program type"
              value={app.programTypeLabel || app.programType}
            />
            <SummaryItem
              label="University"
              value={app.universityName || "Sunmoon University"}
            />
            <SummaryItem label="Intake" value={app.intake} />

            <View style={styles.linkBtn}>
              <Text style={styles.linkText}>
                This data comes from your submitted application.
              </Text>
            </View>
          </View>

          {/* APPLICATION DETAILS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Application Details</Text>

            <Text style={styles.detailsGroupTitle}>Personal details</Text>
            <DetailRow label="Full name" value={app.fullName} />
            <DetailRow label="Nationality" value={app.nationality} />
            <DetailRow label="Date of Birth" value={app.dob} />
            <DetailRow label="Email" value={app.email} />
            <DetailRow label="Phone" value={app.phone} />

            <Text style={styles.detailsGroupTitle}>Education</Text>
            <DetailRow label="Last school" value={app.lastSchool} />
            <DetailRow label="Major / Stream" value={app.major} />

            <Text style={styles.detailsGroupTitle}>Financial sponsor</Text>
            <DetailRow
              label="Bank account owner"
              value={
                app.sponsor === "parents"
                  ? "Parents / Family member"
                  : "Student (self)"
              }
            />
            <DetailRow label="Required balance" value="USD 20,000 or more" />
          </View>

          {/* UPLOADED DOCUMENTS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Uploaded documents</Text>

            <DocumentItem
              label="Passport"
              fileName={app.passportName}
              fileUrl={app.passportUrl || app.passport}
            />
            <DocumentItem
              label="Transcript"
              fileName={app.transcriptName}
              fileUrl={app.transcriptUrl || app.transcript}
            />
            <DocumentItem
              label="Bank balance certificate"
              fileName={app.bankStatementName}
              fileUrl={app.bankStatementUrl || app.bankStatement}
            />
            {app.sponsor === "parents" && (
              <DocumentItem
                label="Family relation certificate"
                fileName={app.familyCertificateName}
                fileUrl={app.familyCertificateUrl || app.familyCertificate}
              />
            )}
            <DocumentItem
              label="ID Photo"
              fileName={app.photoName}
              fileUrl={app.photoUrl || app.photo}
            />
          </View>

          {/* Notifications */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications</Text>
            {user?.notifications?.length > 0 ? (
              user.notifications.map((n, i) => (
                <View key={i} style={styles.notification}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={COLORS.primary}
                  />
                  <Text style={styles.notificationText}>{n}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noNotif}>No notifications</Text>
            )}
          </View>

          {/* Quick actions */}
          <View style={styles.actions}>
            <QuickAction
              label="Upload Documents"
              icon="cloud-upload-outline"
              onPress={() => router.push("/student/applications/documents")}
            />
            <QuickAction
              label="Track Application"
              icon="receipt-outline"
              onPress={() => router.push("/student/applications/dashboard")}
            />
            <QuickAction
              label="Edit Application"
              icon="create-outline"
              onPress={handleEditApplication}
            />
          </View>

          <View style={{ height: 50 }} />
        </View>
      </View>
    </ScrollView>
  );
}
