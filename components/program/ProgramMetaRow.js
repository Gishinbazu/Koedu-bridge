import { StyleSheet, Text, View } from 'react-native';

/**
 * Ligne méta compacte : université • niveau • semestre
 */
export default function ProgramMetaRow({ university, level, semester, style }) {
  const chips = [university, level, semester].filter(Boolean);
  return (
    <View style={[s.row, style]}>
      <Text style={s.meta} numberOfLines={2}>
        {chips.join(' • ')}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  meta: { color: '#cbd5e1' }, // claire sur fond sombre (ProgramHero), reste OK sur fond clair
});
