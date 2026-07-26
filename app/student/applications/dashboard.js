// app/student/dashboard.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { getCurrentUser } from "../../../services/authApi";
import { getStudentApplication } from "../../../services/userApi";
import LogoutButton from "../../auth/LogoutButton";

import styles, { COLORS } from "../../../styles/student/dashboard.styles";

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
        backgroundColor: "rgba(15,23,42,0.9)", // petite pill sombre
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

// Lignes simples
function SummaryItem({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value || "—"}</Text>
    </View>
  );
}

// Lignes type “summary.js”
function DetailRow({ label, value }) {
  return (
    <View style={styles.detailsRow}>
      <Text style={styles.detailsLabel}>{label}</Text>
      <Text style={styles.detailsValue}>{value || "—"}</Text>
    </View>
  );
}

// Documents
function DocumentItem({ label, fileName }) {
  const hasFile = !!fileName;
  return (
    <View style={styles.documentRow}>
      <Text style={styles.documentName}>{label}</Text>
      <Text
        style={[
          styles.documentStatus,
          { color: hasFile ? "#4ade80" : "#f97316" },
        ]}
      >
        {hasFile ? fileName : "Not uploaded"}
      </Text>
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

  useEffect(() => {
    (async () => {
      try {
        const [me, appRes] = await Promise.all([
          getCurrentUser(),
          getStudentApplication(),
        ]);

        // 🔥 on prend directement ce que renvoie l’API
        setUser(me?.user || me);
        setApp(appRes);
      } catch (e) {
        console.log("Error loading student dashboard:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // si pas encore d'application
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

  // Données pour affichage
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
        {/* ====== NAV GAUCHE ====== */}
        <View style={styles.sideNav}>
          <Text style={styles.sideNavTitle}>My KOEDU</Text>

          {/* Edit Application → renvoie vers le même flux que /apply/language/[id] */}
          <Pressable
            style={styles.sideNavBtn}
            onPress={() => {
              if (app.koeduId) {
                // ex: /apply/language/sunmoon-2026-lang-1y
                router.push(`/apply/language/${app.koeduId}`);
              } else {
                router.push("/apply");
              }
            }}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sideNavBtnText}>Edit Application</Text>
          </Pressable>

          {/* My Profile */}
          <Pressable
            style={styles.sideNavBtn}
            onPress={() => router.push("/student/applications/profile")}
          >
            <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sideNavBtnText}>My Profile</Text>
          </Pressable>
        </View>

        {/* ====== COLONNE PRINCIPALE ====== */}
        <View style={styles.mainColumn}>
          {/* STATUS + TIMELINE */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Application Status</Text>

            <View style={styles.statusBox}>
              <Ionicons
                name="time-outline"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.statusText}>{status}</Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` },
                ]}
              />
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

          {/* SUMMARY HAUT NIVEAU */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Application Summary</Text>

            <SummaryItem label="KOEDU ID" value={app.koeduId} />
            <SummaryItem label="Program" value={app.programName} />
            <SummaryItem
              label="Program type"
              value={app.programTypeLabel}
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

          {/* 🤝 SECTION QUI COPIE summary.js */}
          <View style={styles.card}>
            <Text className="card-title" style={styles.cardTitle}>
              Application Details
            </Text>

            {/* Personal details */}
            <Text style={styles.detailsGroupTitle}>Personal details</Text>
            <DetailRow label="Full name" value={app.fullName} />
            <DetailRow label="Nationality" value={app.nationality} />
            <DetailRow label="Date of Birth" value={app.dob} />
            <DetailRow label="Email" value={app.email} />
            <DetailRow label="Phone" value={app.phone} />

            {/* Education */}
            <Text style={styles.detailsGroupTitle}>Education</Text>
            <DetailRow label="Last school" value={app.lastSchool} />
            <DetailRow label="Major / Stream" value={app.major} />

            {/* Financial sponsor */}
            <Text style={styles.detailsGroupTitle}>Financial sponsor</Text>
            <DetailRow
              label="Bank account owner"
              value={
                app.sponsor === "parents"
                  ? "Parents / Family member"
                  : "Student (self)"
              }
            />
            <DetailRow
              label="Required balance"
              value="USD 20,000 or more"
            />
          </View>

          {/* Documents – même logique que FileRow dans summary.js */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Uploaded documents</Text>

            <DocumentItem
              label="Passport"
              fileName={app.passportName}
            />
            <DocumentItem
              label="Transcript"
              fileName={app.transcriptName}
            />
            <DocumentItem
              label="Bank balance certificate"
              fileName={app.bankStatementName}
            />
            {app.sponsor === "parents" && (
              <DocumentItem
                label="Family relation certificate"
                fileName={app.familyCertificateName}
              />
            )}
            <DocumentItem
              label="ID Photo"
              fileName={app.photoName}
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

          {/* Quick actions bas (sans My Profile, déjà à gauche) */}
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
            {/* ➕ NEW: open Apply Hub / Edit */}
            <QuickAction
              label="Edit Application"
              icon="create-outline"
              onPress={() => {
                if (app.koeduId) {
                  router.push(`/apply/language/${app.koeduId}`);
                } else {
                  router.push("/apply");
                }
              }}
            />
          </View>

          <View style={{ height: 50 }} />
        </View>
      </View>
    </ScrollView>
  );
}
