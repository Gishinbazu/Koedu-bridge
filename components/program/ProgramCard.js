import { Pressable, StyleSheet, Text } from 'react-native';
import ProgramMetaRow from './ProgramMetaRow';

export default function ProgramCard({ program, onPress }) {
  if (!program) return null;
  const {
    title = 'Untitled program',
    university = 'Unknown university',
    level = '—',
    semester,
    description,
  } = program;

  return (
    <Pressable style={({ pressed }) => [s.card, pressed && { opacity: 0.95 }]} onPress={onPress}>
      <Text style={s.title} numberOfLines={2}>{title}</Text>
      <ProgramMetaRow university={university} level={level} semester={semester} style={{ marginBottom: 8 }} />
      {!!description && <Text style={s.desc} numberOfLines={3}>{description}</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    flexBasis: '48%',
    minWidth: 260,
    flexGrow: 1,
  },
  title: { fontSize: 16, fontWeight: '800', color: '#0b1e3a', marginBottom: 6 },
  desc: { color: '#4b5563', lineHeight: 20 },
});
