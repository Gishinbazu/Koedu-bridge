import { StyleSheet, Text, View } from 'react-native';

/**
 * Petites “fiches” info : durée, langue, frais…
 * Usage:
 * <ProgramFactCard icon="⏱️" label="Durée" value="4 years" />
 */
export default function ProgramFactCard({ icon = 'ℹ️', label, value }) {
  if (!label) return null;
  return (
    <View style={s.card}>
      <Text style={s.icon} accessible accessibilityLabel={`${label}`}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.value}>{value ?? '—'}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    minWidth: 150,
    flex: 1,
  },
  icon: { fontSize: 18 },
  label: { fontSize: 12, color: '#64748b' },
  value: { fontSize: 15, color: '#0f172a', fontWeight: '700', marginTop: 2 },
});
