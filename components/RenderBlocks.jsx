// components/RenderBlocks.jsx
import { StyleSheet, Text, View } from 'react-native';

export function RenderBlocks({ page }) {
  if (!page?.blocks || !Array.isArray(page.blocks)) return null;

  return (
    <View>
      {page.blocks.map((b, i) => {
        switch (b.type) {
          case 'h3':
            return <Text key={i} style={s.h3}>{b.text}</Text>;

          case 'p':
            return <Text key={i} style={s.p}>{b.text}</Text>;

          case 'note':
            return (
              <View key={i} style={s.note}>
                <Text style={s.noteText}>{b.text}</Text>
              </View>
            );

          case 'ul': {
            const lines = String(b.text || '')
              .split('\n')
              .map((t) => t.replace(/^•\s?/, ''))
              .filter(Boolean);
            return (
              <View key={i} style={{ marginBottom: 10 }}>
                {lines.map((line, j) => (
                  <View key={j} style={s.bulletRow}>
                    <Text style={s.dot}>•</Text>
                    <Text style={s.p}>{line}</Text>
                  </View>
                ))}
              </View>
            );
          }

          case 'li':
            return (
              <View key={i} style={s.bulletRow}>
                <Text style={s.dot}>•</Text>
                <Text style={s.p}>{b.text}</Text>
              </View>
            );

          case 'table': {
            const cols = b.columns ?? [];
            const rows = b.rows ?? [];
            return (
              <View key={i} style={s.table}>
                <View style={[s.tr, s.trHead]}>
                  {cols.map((c) => (
                    <View key={c.key} style={s.td}>
                      <Text style={s.th}>{c.label}</Text>
                    </View>
                  ))}
                </View>
                {rows.map((r, rIdx) => (
                  <View key={rIdx} style={s.tr}>
                    {cols.map((c) => (
                      <View key={c.key} style={s.td}>
                        <Text style={s.p}>{r[c.key]}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          default:
            return null;
        }
      })}
    </View>
  );
}

const s = StyleSheet.create({
  h3: { fontSize: 16, fontWeight: '800', marginTop: 10, marginBottom: 6, color: '#0f172a' },
  p: { color: '#334155', lineHeight: 20, marginBottom: 8 },
  note: {
    borderWidth: 1, borderColor: '#fde68a', backgroundColor: '#fffbeb',
    padding: 10, borderRadius: 10, marginBottom: 10,
  },
  noteText: { color: '#854d0e', lineHeight: 20 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 4, alignItems: 'flex-start' },
  dot: { color: '#0b3b79', fontWeight: '800', marginTop: 1 },
  table: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, overflow: 'hidden', marginVertical: 8 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  trHead: { backgroundColor: '#f8fafc' },
  td: { flex: 1, paddingVertical: 10, paddingHorizontal: 12 },
  th: { fontWeight: '800', color: '#0f172a' },
});
