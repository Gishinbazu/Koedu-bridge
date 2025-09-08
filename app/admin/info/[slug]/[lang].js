// app/admin/info/[slug]/[lang].js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useAuthRole } from '../../../../hooks/useAuthRole';
import { useInfoPage } from '../../../../hooks/useInfoPage';
import { useSaveInfoPage } from '../../../../hooks/useSaveInfoPage';

export default function LocalizedInfoEditor() {
  const router = useRouter();
  const params = useLocalSearchParams();       // { slug, lang }
  const slug = String(params.slug || 'bachelors');
  const lang = String(params.lang || 'en');

  const { user, isEditor, loading: roleLoading } = useAuthRole();
  const { data, loading: pageLoading } = useInfoPage(slug, lang);
  const { savePage, publishPage } = useSaveInfoPage();

  useEffect(() => {
    if (roleLoading) return;
    if (!user) return router.replace('/auth/login');
    if (!isEditor) return router.replace('/'); // or /403
  }, [roleLoading, user, isEditor, router]);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? '');
    setSubtitle(data.subtitle ?? '');
    setBlocks(Array.isArray(data.blocks) ? data.blocks : []);
    setPublished(!!data.published);
  }, [data]);

  const add = (type, text) => setBlocks((b) => [...b, { type, text }]);

  const onSave = async () => {
    try { await savePage({ slug, lang, title, subtitle, blocks, published }); Alert.alert('Saved'); }
    catch (e) { Alert.alert('Error', e.message); }
  };

  const onTogglePublish = async () => {
    try { await publishPage(slug, lang, !published); setPublished((p) => !p); }
    catch (e) { Alert.alert('Error', e.message); }
  };

  if (roleLoading || (!isEditor && user)) {
    return <Centered status="Checking permissions…" />;
  }

  return (
    <ScrollView contentContainerStyle={sx.page}>
      <Stack.Screen options={{ title: `Edit: ${slug} • ${lang.toUpperCase()}` }} />

      <View style={sx.header}>
        <Pressable onPress={() => router.back()} style={sx.backBtn}>
          <Ionicons name="chevron-back" size={18} color="#0b3b79" />
          <Text style={sx.backText}>Back</Text>
        </Pressable>
        <Text style={sx.h1}>Info page editor</Text>
        <View style={{ width: 60 }} />
      </View>

      {pageLoading ? (
        <Centered status="Loading page…" />
      ) : (
        <>
          <Card>
            <Text style={sx.label}>Slug</Text>
            <Text style={sx.readonly}>{slug}</Text>
            <Text style={sx.label}>Language</Text>
            <Text style={sx.readonly}>{lang}</Text>

            <Text style={sx.label}>Title</Text>
            <TextInput style={sx.input} value={title} onChangeText={setTitle} />

            <Text style={sx.label}>Subtitle</Text>
            <TextInput style={sx.input} value={subtitle} onChangeText={setSubtitle} />
          </Card>

          <Card>
            <Text style={sx.h3}>Blocks</Text>
            {blocks.map((b, i) => (
              <View key={i} style={sx.blockRow}>
                <Text style={sx.blockType}>{b.type}</Text>
                <TextInput
                  style={sx.blockInput}
                  multiline
                  value={b.text ?? ''}
                  onChangeText={(t) =>
                    setBlocks((arr) => {
                      const next = [...arr];
                      next[i] = { ...next[i], text: t };
                      return next;
                    })
                  }
                />
                <Pressable onPress={() => setBlocks((arr) => arr.filter((_, k) => k !== i))}>
                  <Text style={{ color: '#a8071a' }}>Remove</Text>
                </Pressable>
              </View>
            ))}

            <View style={sx.row}>
              <Pill onPress={() => add('h3', 'New section')}>Add H3</Pill>
              <Pill onPress={() => add('p', 'New paragraph…')}>Add paragraph</Pill>
              <Pill onPress={() => add('ul', '• First item\n• Second item')}>Add bullet list</Pill>
              <Pill onPress={() => add('note', 'Note…')}>Add note</Pill>
            </View>
          </Card>

          <Card>
            <View style={[sx.row, { justifyContent: 'space-between' }]}>
              <Text style={sx.label}>Published</Text>
              <Switch value={published} onValueChange={onTogglePublish} />
            </View>
          </Card>

          <View style={sx.row}>
            <Pressable onPress={onSave} style={[sx.btn, sx.btnPrimary]}>
              <Text style={sx.btnPrimaryText}>Save</Text>
            </Pressable>
            <Pressable onPress={onTogglePublish} style={[sx.btn, sx.btnGhost]}>
              <Text style={sx.btnGhostText}>{published ? 'Unpublish' : 'Publish'}</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function Centered({ status }) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <ActivityIndicator />
      <Text style={{ marginTop: 8, color: '#64748b' }}>{status}</Text>
    </View>
  );
}
function Card({ children }) { return <View style={sx.card}>{children}</View>; }
function Pill({ children, onPress }) { return <Pressable onPress={onPress} style={sx.pill}><Text>{children}</Text></Pressable>; }

const sx = StyleSheet.create({
  page: { padding: 16, maxWidth: 1000, alignSelf: 'center', width: '100%', paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff' },
  backText: { color: '#0b3b79', fontWeight: '700' },
  h1: { fontSize: 22, fontWeight: '800' },
  h3: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  label: { fontWeight: '700', marginTop: 8 },
  readonly: { paddingVertical: 8, color: '#64748b' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginTop: 4 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, backgroundColor: '#fff', marginBottom: 10 },

  blockRow: { borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 10, padding: 10, marginBottom: 10 },
  blockType: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  blockInput: { minHeight: 60, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 8 },

  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 },
  pill: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },

  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnPrimary: { backgroundColor: '#0b3b79', borderColor: '#0b3b79' },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff', borderColor: '#cbd5e1' },
  btnGhostText: { color: '#0b3b79', fontWeight: '800' },
});
