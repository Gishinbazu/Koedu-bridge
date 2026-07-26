// app/programs/index.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

// 🔗 Source officielle des programmes 2026 (extrait des PDFs)
import { PROGRAMS_2026 } from '../../data/PROGRAMS_DB';

// Importation des styles depuis le fichier séparé
import styles from '../../styles/apply/Programstyle';

// On utilise la DB 2026 comme liste de base
const PROGRAMS = PROGRAMS_2026;

// Filtres simples côté UI
const LEVELS = ['All', 'Bachelor', 'Master', 'Language'];
const LANGS = ['All', 'Korean', 'English'];

export default function ProgramsIndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // search initialisée avec ?q= de la home
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [lang, setLang] = useState('All');

  useEffect(() => {
    if (params?.q && typeof params.q === 'string') {
      setSearch(params.q);
    }
  }, [params?.q]);

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase();

    return PROGRAMS.filter((p) => {
      if (level !== 'All' && p.level !== level) return false;
      if (lang !== 'All' && p.language !== lang) return false;

      if (!q) return true;
      const blob = `${p.name} ${p.university} ${p.city} ${p.level} ${p.language}`.toLowerCase();
      return blob.includes(q);
    });
  }, [search, level, lang]);

  const handleOpenProgram = (program) => {
    router.push(`/programs/${program.id}`);
  };
  
  const handleGoBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <LinearGradient
        colors={['#050816', '#02010f']}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <Text style={styles.pageTitle}>Find a program for 2026</Text>
          <Text style={styles.pageSubtitle}>
            Browse Korean language, bachelor and master programmes at Sunmoon University for the 2026 intake.
          </Text>

          {/* CARD FILTER + LIST */}
          <View style={styles.cardShadow}>
            <LinearGradient
              colors={['#f97316', '#af002d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardOverlay} />

              <View style={styles.cardInner}>
                
                {/* ⬅️ BOUTON RETURN MIS À JOUR ⬅️ */}
                <Pressable
                  onPress={handleGoBack}
                  style={styles.backButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#F97316" /> {/* Icône plus grande et orange */}
                  <Text style={styles.backButtonText}>Back</Text> {/* Texte changé à "Back" */}
                </Pressable>
                
                {/* Search + filters */}
                <View style={styles.filtersBlock}>
                  <View style={styles.searchBox}>
                    <Ionicons
                      name="search"
                      size={18}
                      color="rgba(209,213,219,0.9)"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder="Search 2026 programs (AI, Business, Korean language…)"
                      placeholderTextColor="rgba(148,163,184,0.9)"
                      style={styles.searchInput}
                      returnKeyType="search"
                    />
                  </View>

                  <View style={styles.filtersRow}>
                    <FilterGroup
                      label="Level"
                      values={LEVELS}
                      active={level}
                      onChange={setLevel}
                    />
                    <FilterGroup
                      label="Language"
                      values={LANGS}
                      active={lang}
                      onChange={setLang}
                    />
                  </View>
                </View>

                {/* LIST */}
                <View style={styles.listBlock}>
                  {filteredPrograms.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => handleOpenProgram(p)}
                      style={({ pressed }) => [
                        styles.programCard,
                        pressed && { opacity: 0.9, transform: [{ translateY: 1 }] },
                      ]}
                    >
                      <View style={styles.programHeader}>
                        <Text style={styles.programName}>{p.name}</Text>
                        <View style={styles.badgesRow}>
                          <Badge icon="school-outline" label={p.level} />
                          <Badge icon="language-outline" label={p.language} />
                          <Badge icon="location-outline" label={p.city} />
                        </View>
                      </View>

                      <Text style={styles.university}>{p.university}</Text>
                      <Text style={styles.overview} numberOfLines={2}>
                        {p.overview}
                      </Text>

                      <View style={styles.metaRow}>
                        <Meta icon="calendar-outline" label={p.intakes} />
                        <Meta icon="time-outline" label={p.duration} />
                        <Meta icon="cash-outline" label={p.tuition} />
                      </View>

                      <View style={styles.cardFooter}>
                        <Pressable
                          style={styles.detailsBtn}
                          onPress={() => handleOpenProgram(p)}
                        >
                          <Text style={styles.detailsText}>View details</Text>
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color="#f97316"
                          />
                        </Pressable>
                      </View>
                    </Pressable>
                  ))}

                  {filteredPrograms.length === 0 && (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color="#9ca3af"
                      />
                      <Text style={styles.emptyTitle}>No programs found</Text>
                      <Text style={styles.emptyText}>
                        Try changing the filters or search terms.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

/* ───────────── Small presentational components ───────────── */

function FilterGroup({ label, values, active, onChange }) {
  // Reste inchangé...
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.filterChipsRow}>
        {values.map((v) => {
          const isActive = v === active;
          return (
            <Pressable
              key={v}
              onPress={() => onChange(v)}
              style={[
                styles.chip,
                isActive && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive && styles.chipTextActive,
                ]}
              >
                {v}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Badge({ icon, label }) {
  // Reste inchangé...
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={13} color="#111827" style={{ marginRight: 4 }} />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function Meta({ icon, label }) {
  // Reste inchangé...
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={13} color="#fb923c" style={{ marginRight: 4 }} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}