import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CookiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);

  const sections = useMemo(() => ([
    { key: 'intro', title: 'What are cookies?' },
    { key: 'types', title: 'Types we use' },
    { key: 'control', title: 'Your choices' },
    { key: 'changes', title: 'Updates' },
    { key: 'contact', title: 'Contact' },
  ]), []);

  const [offsets, setOffsets] = useState(Object.fromEntries(sections.map(s => [s.key, 0])));
  const onLayoutSection = (k, y) => setOffsets(p => ({ ...p, [k]: y }));

  const scrollToKey = (k) => {
    const y = offsets[k] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#section-${k}`);
    }
  };

  useEffect(() => {
    let initial = null;
    if (params?.section && sections.some(s => s.key === params.section)) initial = params.section;
    if (!initial && Platform.OS === 'web' && typeof window !== 'undefined') {
      const m = String(window.location.hash || '').match(/section-([\w-]+)/i);
      const hk = m?.[1]; if (hk && sections.some(s => s.key === hk)) initial = hk;
    }
    if (initial) {
      const t = setTimeout(() => scrollToKey(initial), 120);
      return () => clearTimeout(t);
    }
  }, [params?.section, sections]); // eslint-disable-line

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Cookies Policy' }} />
      <Header title="Cookies Policy" subtitle="How KOEDU Bridge uses cookies and similar technologies." onBack={() => router.back()} />

      <TOC sections={sections} onPress={scrollToKey} />

      <Card onLayout={(e) => onLayoutSection('intro', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>What are cookies?</Text>
        <Text style={s.body}>
          Cookies are small text files stored on your device to help websites function and analyze usage.
        </Text>
        <Meta updated="2025-09-01" />
      </Card>

      <Card onLayout={(e) => onLayoutSection('types', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>Types we use</Text>
        <Bullet text="Strictly necessary (session, security)." />
        <Bullet text="Performance & analytics (aggregated metrics)." />
        <Bullet text="Preferences (language, saved choices)." />
      </Card>

      <Card onLayout={(e) => onLayoutSection('control', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>Your choices</Text>
        <Bullet text="You can manage cookies in your browser settings." />
        <Bullet text="You may opt out of non-essential cookies in our banner when available." />
      </Card>

      <Card onLayout={(e) => onLayoutSection('changes', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>Updates</Text>
        <Text style={s.body}>We may update this policy to reflect technical or legal changes.</Text>
      </Card>

      <Card onLayout={(e) => onLayoutSection('contact', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>Contact</Text>
        <Text style={s.body}>Email: privacy@koedubridge.com</Text>
      </Card>
    </ScrollView>
  );
}

/* Shared bits */
function Header({ title, subtitle, onBack }) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack} style={s.backBtn} accessibilityRole="button" accessibilityLabel="Back">
        <Ionicons name="chevron-back" size={18} color="#0b3b79" />
        <Text style={s.backText}>Back</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={s.h1}>{title}</Text>
        {!!subtitle && <Text style={s.sub}>{subtitle}</Text>}
      </View>
    </View>
  );
}
function TOC({ sections, onPress }) {
  return (
    <View style={s.toc}>
      <Text style={s.tocTitle}>📘 On this page</Text>
      <View style={{ gap: 6 }}>
        {sections.map((sec) => (
          <Pressable key={sec.key} onPress={() => onPress(sec.key)} style={({ pressed }) => [s.tocItem, pressed && s.pressed]}>
            <Text style={s.tocDot}>•</Text>
            <Text style={s.tocText}>{sec.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
function Card({ children, onLayout }) { return <View style={s.card} onLayout={onLayout}>{children}</View>; }
function Bullet({ text }) { return <View style={s.bulletRow}><Text style={s.bullet}>•</Text><Text style={s.body}>{text}</Text></View>; }
function Meta({ updated }) { return <Text style={s.meta}>Last updated: {updated}</Text>; }

const s = StyleSheet.create({
  page:{ padding:16, maxWidth:1100, alignSelf:'center', width:'100%', paddingBottom:40 },
  header:{ flexDirection:'row', alignItems:'flex-start', gap:12, marginBottom:10 },
  backBtn:{ flexDirection:'row', alignItems:'center', gap:4, paddingVertical:6, paddingHorizontal:8, borderRadius:8, borderWidth:1, borderColor:'#cbd5e1', backgroundColor:'#fff' },
  backText:{ color:'#0b3b79', fontWeight:'700' },
  h1:{ fontSize:26, fontWeight:'800', color:'#0f172a' },
  h3:{ fontSize:16, fontWeight:'800', color:'#0f172a', marginBottom:6 },
  sub:{ color:'#64748b', marginTop:2 },
  body:{ color:'#334155', lineHeight:20 },
  card:{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:12, padding:14, backgroundColor:'#fff', marginBottom:10 },
  bulletRow:{ flexDirection:'row', gap:8, marginTop:4, alignItems:'flex-start' },
  bullet:{ color:'#0b3b79', fontWeight:'800', marginTop:1 },
  meta:{ color:'#64748b', marginTop:4, fontSize:12 },

  toc:{ backgroundColor:'#f1f5f9', padding:14, borderRadius:12, marginBottom:12,
        ...(Platform.OS==='web'?{ position:'sticky', top:0, zIndex:5, borderWidth:1, borderColor:'#e2e8f0', backdropFilter:'saturate(1.1) blur(4px)' }:null) },
  tocTitle:{ fontSize:16, fontWeight:'800', color:'#0b3b79', marginBottom:6 },
  tocItem:{ flexDirection:'row', alignItems:'center', gap:6, paddingVertical:6, paddingHorizontal:10, borderRadius:6 },
  tocDot:{ color:'#0b3b79', fontWeight:'800' },
  tocText:{ fontSize:14, color:'#0b3b79' },
  pressed:{ backgroundColor:'#e6effa' },
});
