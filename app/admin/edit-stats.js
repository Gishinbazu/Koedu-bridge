// app/admin/edit-stats.js
// Écran d’édition des statistiques KOEDU Bridge (admin only)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { API_BASE_URL } from '../../services/apiClient';
import { getCurrentUser } from '../../services/authApi';

export default function EditStatsScreen() {
  const router = useRouter();

  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: '',
    activeApplications: '',
    partnerUniversities: '',
    visaSuccessRate: '',
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  console.log('[EditStats] API_BASE_URL =', API_BASE_URL);

  // 1) Vérifier que l'utilisateur est admin
  useEffect(() => {
    (async () => {
      try {
        const me = await getCurrentUser();
        setCurrentUser(me || null);
      } catch (e) {
        console.log('EditStats / getCurrentUser error:', e?.message);
        setCurrentUser(null);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  // 2) Charger les stats depuis le backend (Mongo via API)
  useEffect(() => {
    if (!currentUser) return;
    const isAdmin =
      currentUser?.role === 'admin' || currentUser?.userRole === 'admin';
    if (!isAdmin) {
      return;
    }

    (async () => {
      setLoadingStats(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem('koedu_token');
        if (!token) {
          setError('You are not logged in.');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/admin/metrics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          console.log('GET /api/admin/metrics error:', res.status, data);
          setError(data?.message || 'Unable to load statistics.');
          return;
        }

        // backend renvoie { metrics: {...} }
        const m = data?.metrics || data || {};

        setStats({
          totalStudents: String(m.totalStudents ?? ''),
          activeApplications: String(m.activeApplications ?? ''),
          partnerUniversities: String(m.partnerUniversities ?? ''),
          visaSuccessRate: String(m.visaSuccessRate ?? ''),
        });
      } catch (e) {
        console.log('Error fetching stats:', e);
        setError('Network error while loading statistics.');
      } finally {
        setLoadingStats(false);
      }
    })();
  }, [currentUser]);

  const handleChange = (key, value) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const token = await AsyncStorage.getItem('koedu_token');
      if (!token) {
        Alert.alert('Not logged in', 'Please log in again.');
        return;
      }

      const payload = {
        totalStudents: Number(stats.totalStudents) || 0,
        activeApplications: Number(stats.activeApplications) || 0,
        partnerUniversities: Number(stats.partnerUniversities) || 0,
        visaSuccessRate: Number(stats.visaSuccessRate) || 0,
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/metrics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.log('PUT /api/admin/metrics error:', res.status, data);
        setError(data?.message || 'Failed to save statistics.');
        Alert.alert('Error', data?.message || 'Failed to save statistics.');
        return;
      }

      Alert.alert('Saved', 'Statistics have been updated successfully.');
    } catch (e) {
      console.log('Error saving stats:', e);
      setError('Network error while saving statistics.');
      Alert.alert('Error', 'Network error while saving statistics.');
    } finally {
      setSaving(false);
    }
  };

  // --- Rendu selon l'état user / admin ---

  if (loadingUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.mutedText}>Checking your access...</Text>
      </View>
    );
  }

  const isAdmin =
    currentUser?.role === 'admin' || currentUser?.userRole === 'admin';

  if (!currentUser || !isAdmin) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Access denied</Text>
        <Text style={styles.mutedText}>
          This page is only available for KOEDU Bridge admins.
        </Text>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.backButtonText}>Go back to Home</Text>
        </Pressable>
      </View>
    );
  }

  // --- Rendu principal admin ---

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.headerTitle}>Edit KOEDU Bridge statistics</Text>
        <Text style={styles.headerSubtitle}>
          These numbers are shown on the homepage KPI bar.
        </Text>

        {loadingStats ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator />
            <Text style={styles.mutedText}>Loading current statistics...</Text>
          </View>
        ) : (
          <>
            {error ? (
              <Text style={[styles.mutedText, { color: '#b91c1c' }]}>
                {error}
              </Text>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Total students supported</Text>
              <TextInput
                value={stats.totalStudents}
                onChangeText={(v) => handleChange('totalStudents', v)}
                keyboardType="numeric"
                style={styles.input}
                placeholder="e.g. 120"
              />
              <Text style={styles.helper}>
                Example: 120 foreign students who got admission/visa with KOEDU
                Bridge.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Active applications</Text>
              <TextInput
                value={stats.activeApplications}
                onChangeText={(v) => handleChange('activeApplications', v)}
                keyboardType="numeric"
                style={styles.input}
                placeholder="e.g. 35"
              />
              <Text style={styles.helper}>
                Number of applications that are currently in process.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Partner universities</Text>
              <TextInput
                value={stats.partnerUniversities}
                onChangeText={(v) => handleChange('partnerUniversities', v)}
                keyboardType="numeric"
                style={styles.input}
                placeholder="e.g. 15"
              />
              <Text style={styles.helper}>
                Universities or language institutes you actively work with.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Visa success rate (%)</Text>
              <TextInput
                value={stats.visaSuccessRate}
                onChangeText={(v) => handleChange('visaSuccessRate', v)}
                keyboardType="numeric"
                style={styles.input}
                placeholder="e.g. 98"
              />
              <Text style={styles.helper}>
                Example: 98 means 98% of KOEDU Bridge students got their visa
                approved.
              </Text>
            </View>

            <Pressable
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Save statistics</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.backLink}
              onPress={() => router.push('/')}
            >
              <Text style={styles.backLinkText}>← Back to Home</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({ ios: 60, android: 40, default: 40 }),
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 8, default: 10 }),
    fontSize: 15,
    backgroundColor: '#f9fafb',
  },
  helper: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#0b3b79',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  backLink: {
    marginTop: 12,
    alignSelf: 'center',
  },
  backLinkText: {
    fontSize: 14,
    color: '#0b3b79',
    textDecorationLine: 'underline',
  },
  centered: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  mutedText: {
    fontSize: 14,
    color: '#6b7280',
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0b3b79',
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
