// components/RenderBlocks.js
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function RenderBlocks({ page }) {
  const router = useRouter();
  if (!page?.blocks) return null;

  return (
    <View style={{ gap: 10 }}>
      {page.blocks.map((b, i) => {
        switch (b.type) {
          case 'lead':
            return (
              <View key={i} style={s.card}>
                <Text style={s.lead}>{b.text}</Text>
              </View>
            );
          case 'accordion':
            return (
              <View key={i} style={s.card}>
                <Text style={s.h3}>{b.title}</Text>
                {b.items?.map((t, k) => (
                  <View key={k} style={s.bulletRow}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={s.body}>{t}</Text>
                  </View>
                ))}
              </View>
            );
          case 'cta':
            return (
              <View key={i} style={s.cta}>
                <Text style={s.h2}>{b.title}</Text>
                {!!b.subtitle && <Text style={s.sub}>{b.subtitle}</Text>}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {!!b.primary && (
                    <Pressable onPress={() => router.push(b.primary.href)} style={[s.btn, s.btnPrimary]}>
                      <Text style={s.btnPrimaryText}>{b.primary.label}</Text>
                    </Pressable>
                  )}
                  {!!b.secondary && (
                    <Pressable onPress={() => router.push(b.secondary.href)} style={[s.btn, s.btnGhost]}>
                      <Text style={s.btnGhostText}>{b.secondary.label}</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          default:
            return null;
        }
      })}
    </View>
  );
}

const colors = {
  border: '#e5e7eb',
  bgCard: '#ffffff',
  ink: '#0f172a',
  body: '#334155',
  brand: '#0b3b79',
  ghostBorder: '#cbd5e1',
};

const s = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, backgroundColor: colors.bgCard },
  h2: { fontSize: 20, fontWeight: '800', color: colors.ink },
  h3: { fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 6 },
  sub: { color: '#64748b', marginTop: 2 },
  lead: { color: colors.body, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  bullet: { color: colors.brand, fontWeight: '800' },
  body: { color: colors.body, lineHeight: 20 },

  cta: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, backgroundColor: colors.bgCard },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnPrimary: { backgroundColor: colors.brand, borderColor: colors.brand },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff', borderColor: colors.ghostBorder },
  btnGhostText: { color: colors.brand, fontWeight: '800' },
});
