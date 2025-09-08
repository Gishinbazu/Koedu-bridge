// app/admin/info/_Editor.js
import { Stack, useRouter } from 'expo-router';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator, Alert, Platform,
    Pressable,
    ScrollView, StyleSheet,
    Switch, Text, TextInput, View
} from 'react-native';
import { auth, db } from '../../services/firebase';

const ROLES_OK = ['manager', 'admin', 'superadmin'];

export default function AdminInfoEditor({ slug, defaultLang = 'en', title }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [guarded, setGuarded] = useState(true);

  // document id: ex => infoPages/bachelors_en
  const docId = `${slug}_${defaultLang}`;

  const [form, setForm] = useState({
    slug,
    lang: defaultLang,
    title: '',
    subtitle: '',
    blocks: [], // array of {type:'p'|'h3'|'ul'|'li'|'note'|'table', text?: string, rows?: string[][]}
    published: false,
    updatedAt: null,
  });

  // ---- Guard: only manager/admin/superadmin
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = auth.currentUser;
        if (!u) { router.replace('/auth/login'); return; }
        const userRef = doc(db, 'users', u.uid);
        const snap = await getDoc(userRef);
        const role = String(snap.data()?.role || '').toLowerCase();
        const ok = ROLES_OK.includes(role);
        if (alive) setGuarded(!ok);
        if (!ok) {
          router.replace('/not-authorized');
          return;
        }
        // load page
        const pageRef = doc(db, 'infoPages', docId);
        const page = await getDoc(pageRef);
        if (page.exists()) {
          if (alive) setForm({ ...form, ...page.data() });
        } else {
          // seed minimal form
          if (alive) setForm((f) => ({
            ...f,
            title: title ?? `${slug} (en)`,
            subtitle: '',
            blocks: [
              { type: 'p', text: 'Start writing content…' },
            ],
          }));
        }
      } catch (e) {
        console.warn('Editor load failed:', e);
        Alert.alert('Error', 'Failed to load editor.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, defaultLang]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const prettyBlocks = useMemo(() => {
    try { return JSON.stringify(form.blocks ?? [], null, 2); }
    catch { return '[]'; }
  }, [form.blocks]);

  const onSave = async () => {
    try {
      setLoading(true);
      const ref = doc(db, 'infoPages', docId);
      await setDoc(ref, {
        slug: form.slug || slug,
        lang: form.lang || defaultLang,
        title: form.title || '',
        subtitle: form.subtitle || '',
        blocks: Array.isArray(form.blocks) ? form.blocks : [],
        published: !!form.published,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      Alert.alert('Saved', 'Page saved successfully.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save the page.');
    } finally {
      setLoading(false);
    }
  };

  const onParseBlocks = () => {
    try {
      const parsed = JSON.parse(prettyBlocks);
      if (!Array.isArray(parsed)) throw new Error('Blocks must be an array');
      set('blocks', parsed);
      Alert.alert('OK', 'Blocks JSON parsed.');
    } catch (e) {
      Alert.alert('Invalid JSON', String(e?.message || e));
    }
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#0b3b79" />
        <Text style={{ color: '#64748b', marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  if (guarded) return null;

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: title ?? `Edit ${slug}` }} />

      <Text style={s.h1}>{title ?? `Edit ${slug}`}</Text>
      <Text style={s.sub}>Document: <Text style={{ fontWeight: '800' }}>infoPages/{docId}</Text></Text>

      <View style={s.card}>
        <Text style={s.label}>Title</Text>
        <TextInput
          style={s.input}
          value={form.title}
          onChangeText={(t) => set('title', t)}
          placeholder="Page title"
        />

        <Text style={[s.label, { marginTop: 12 }]}>Subtitle</Text>
        <TextInput
          style={[s.input, { minHeight: 44 }]}
          value={form.subtitle}
          onChangeText={(t) => set('subtitle', t)}
          placeholder="Optional subtitle"
        />

        <Text style={[s.label, { marginTop: 12 }]}>Published</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Switch value={!!form.published} onValueChange={(v) => set('published', v)} />
          <Text>{form.published ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.h2}>Blocks (JSON)</Text>
        <Text style={s.help}>
          Provide an array of blocks. Example:
          {`\n`}[
          {`{ "type":"h3","text":"Section" }, { "type":"p","text":"Paragraph…" }`}
          ]{'\n'}
          Allowed types: <Text style={{ fontWeight: '800' }}>p, h3, ul, li, note, table</Text>
        </Text>
        <TextInput
          style={[s.input, s.code]}
          value={prettyBlocks}
          onChangeText={(t) => {
            // keep text in a shadow string so typing is smooth
            // we reuse prettyBlocks as source of truth before parsing
            try {
              // light validation as user types; don’t crash
              JSON.parse(t);
            } catch { /* ignore */ }
            // store string in a hidden field
            set('_blocksDraft', t);
          }}
          multiline
          autoCorrect={false}
          autoCapitalize="none"
          placeholder='[ { "type":"p", "text":"..." } ]'
        />
        <Pressable onPress={onParseBlocks} style={[s.btn, s.btnGhost]}>
          <Text style={s.btnGhostText}>Parse JSON → Blocks</Text>
        </Pressable>
      </View>

      <View style={{ height: 8 }} />

      <Pressable onPress={onSave} style={[s.btn, s.btnPrimary]}>
        <Text style={s.btnPrimaryText}>Save page</Text>
      </Pressable>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const C = { border: '#e5e7eb', ink: '#0f172a', body: '#334155', brand: '#0b3b79' };

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  page: { padding: 16, maxWidth: 1000, alignSelf: 'center', width: '100%', paddingBottom: 40 },
  h1: { fontSize: 24, fontWeight: '900', color: C.ink },
  h2: { fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 6 },
  sub: { color: '#64748b', marginBottom: 10 },
  label: { color: C.ink, fontWeight: '800' },
  card: {
    borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14,
    backgroundColor: '#fff', marginBottom: 12,
    ...Platform.select({ ios:{ shadowColor:'#000', shadowOpacity:0.06, shadowRadius:6, shadowOffset:{width:0,height:3}}, android:{ elevation:2 }})
  },
  input: {
    borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, color: C.ink, backgroundColor: '#fff',
  },
  code: { minHeight: 180, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  help: { color: '#64748b', marginBottom: 8 },

  btn: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, alignItems: 'center' },
  btnPrimary: { backgroundColor: C.brand, borderColor: C.brand },
  btnPrimaryText: { color: '#fff', fontWeight: '900' },
  btnGhost: { backgroundColor: '#fff', borderColor: C.border, marginTop: 10 },
  btnGhostText: { color: C.brand, fontWeight: '900' },
});
