// components/university/UniversityCard.js
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function UniversityCard({ university, onPress }) {
  return (
    <Pressable style={s.card} onPress={onPress} accessibilityRole="button">
      {!!university.logoUrl && (
        <Image source={{ uri: university.logoUrl }} style={s.logo} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{university.name}</Text>
        <Text style={s.meta}>
          {university.city} • {university.region} • {university.type}
        </Text>
        {!!university.shortDesc && (
          <Text style={s.desc} numberOfLines={2}>
            {university.shortDesc}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  title: { fontWeight: '800', color: '#0b3b79' },
  meta: { color: '#64748b', marginTop: 2 },
  desc: { color: '#334155', marginTop: 4 },
});
