// app/my/applications.js
// Student "My Applications" page

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { fetchMyApplications } from '../../services/applicationsApi';

const COLORS = {
  bgStart: '#050816',
  bgEnd: '#02010f',
  primary: '#2563EB',
  cardBg: 'rgba(15,23,42,0.95)',
  border: 'rgba(148,163,184,0.4)',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  badgePending: '#FBBF24',
  badgeReview: '#3B82F6',
  badgeAccepted: '#22C55E',
  badgeRejected: '#EF4444',
};

const STATUS_LABELS = {
  pending: 'Pending',
  submitted: 'Submitted',
  in_review: 'In review',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const STATUS_COLORS = {
  pending: COLORS.badgePending,
  submitted: COLORS.badgeReview,
  in_review: COLORS.badgeReview,
  accepted: COLORS.badgeAccepted,
  rejected: COLORS.badgeRejected,
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function MyApplicationsScreen() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  // 1) Vérifier que l'utilisateur est connecté
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('koedu_user');
        if (!raw) {
          router.replace('/auth/login');
          return;
        }
        const u = JSON.parse(raw);
        if (!u) {
          router.replace('/auth/login');
          return;
        }
        setCurrentUser(u);
      } catch (e) {
        console.log('MyApplications auth error:', e?.message);
        router.replace('/auth/login');
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, [router]);

  // 2) Charger les candidatures de cet utilisateur
  useEffect(() => {
    if (!currentUser) return;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchMyApplications(); // appelle /api/applications/my
        const list = data?.applications || data || [];
        setApplications(list);
      } catch (e) {
        console.log('fetchMyApplications error:', e);
        setError(e?.message || 'Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  const handleOpenApplication = (item) => {
    const id = item._id || item.id;
    if (!id) return;
    // à toi de créer /applications/[id].js si tu veux un détail étudiant
    router.push(`/admin/applications/${id}`); // ou une autre route plus tard
  };

  if (checkingAuth) {
    return (
      <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.muted}>Checking your session...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={() => router.replace('/')}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons name="arrow-back-outline" size={18} color={COLORS.text} />
              <Text style={styles.backButtonText}>Home</Text>
            </Pressable>

            <Ionicons
              name="folder-open-outline"
              size={22}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />
            <View>
              <Text style={styles.headerTitle}>My applications</Text>
              <Text style={styles.headerSubtitle}>
                Track your KOEDU Bridge applications in real time.
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENU */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.muted}>Loading your applications...</Text>
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <Text style={[styles.muted, { color: '#fecaca' }]}>{error}</Text>
            </View>
          ) : applications.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>No applications yet</Text>
              <Text style={styles.muted}>
                Start by choosing a program and submitting your first application.
              </Text>
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push('/programs')}
              >
                <Text style={styles.primaryButtonText}>Browse programs</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={applications}
              keyExtractor={(item) => item._id || item.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => {
                const status = item.status || 'pending';
                const statusColor = STATUS_COLORS[status] || COLORS.textMuted;
                const statusLabel = STATUS_LABELS[status] || status;

                return (
                  <Pressable
                    onPress={() => handleOpenApplication(item)}
                    style={({ pressed }) => [
                      styles.card,
                      { opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.programName}>
                        {item.programName || 'Program'}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusColor },
                        ]}
                      >
                        <Text style={styles.statusText}>{statusLabel}</Text>
                      </View>
                    </View>

                    <Text style={styles.universityText}>
                      {item.universityName || item.campus || 'Korean university'}
                    </Text>

                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>
                        Submitted: {formatDate(item.createdAt)}
                      </Text>
                      {item.intake && (
                        <Text style={styles.metaText}>Intake: {item.intake}</Text>
                      )}
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  content: { flex: 1 },
  centered: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center' },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  programName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  universityText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
