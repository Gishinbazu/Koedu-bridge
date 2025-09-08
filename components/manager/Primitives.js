// components/manager/Primitives.js
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function KPI({ icon, value, label }) {
  return (
    <View style={s.kpi}>
      <View style={s.kpiIcon}><Ionicons name={icon} size={16} color="#0b3b79" /></View>
      <Text style={s.kpiVal}>{String(value)}</Text>
      <Text style={s.kpiLab}>{label}</Text>
    </View>
  );
}

export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} style={s.sectionBtn}>
          <Text style={s.sectionBtnText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Badge({ children }) {
  return <View style={s.badge}><Text style={s.badgeText}>{children}</Text></View>;
}

export function Empty({ text = 'No data' }) {
  return <Text style={s.empty}>{text}</Text>;
}

const s = StyleSheet.create({
  card: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, backgroundColor: '#ffffff',
  },
  kpi: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, backgroundColor: '#ffffff',
    minWidth: 200, flexGrow: 1,
  },
  kpiIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  kpiVal: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  kpiLab: { color: '#64748b', marginTop: 2 },

  section: { marginTop: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '800', color: '#0f172a', fontSize: 16 },
  sectionBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' },
  sectionBtnText: { color: '#0b3b79', fontWeight: '700' },

  badge: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { color: '#0b3b79', fontWeight: '800', fontSize: 12 },

  empty: { padding: 12, color: '#64748b' },
});
