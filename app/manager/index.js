// app/manager/index.js
import { Audio, Video } from 'expo-av';
import { Redirect, useRootNavigationState, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Dimensions, Image, Platform,
  Pressable, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Animated, {
  FadeInDown, SlideInLeft, SlideOutLeft,
  useAnimatedStyle, useSharedValue, withSpring,
} from 'react-native-reanimated';
import { auth, db } from '../../services/firebase';
import RightBarMenu from './RightBarMenu';

const screenWidth = Dimensions.get('window').width;

/* ───────────────── Main feature cards ───────────────── */
const FEATURES = [
  { label: '🏠 Dashboard', desc: 'Aperçu des candidatures.', bg: '#1e3a8a', path: '/manager/ManagerDashboard' },
  { label: '📊 Statistics', desc: 'Voir les performances.',  bg: '#065f46', path: '/manager/statistics' },
  { label: '👤 Gestion des utilisateurs', desc: 'Gérer les comptes.', bg: '#b45309', path: '/manager/manage-users' },
  { label: '📅 Calendar', desc: 'Voir les événements.',     bg: '#0e7490', path: '/manager/calendar' },
  { label: '💬 Team Chat', desc: 'Discuter avec l’équipe.',  bg: '#6d28d9', path: '/manager/chat' },
  { label: '👥 Team', desc: 'Voir les membres.',            bg: '#991b1b', path: '/manager/team' },
];

/* ──────────────── Editor shortcuts (pills) ───────────── */
const EDITOR_SHORTCUTS = [
  { label: '✏️ Edit Bachelor',                path: '/admin/info/bachelors' },
  { label: '✏️ Edit Master',                  path: '/admin/info/masters' },
  { label: '✏️ Edit Dates & deadlines',       path: '/admin/info/deadlines' },
  { label: '✏️ Edit Korean Language (KLI)',   path: '/admin/info/kli' },
  { label: '🧩 Manage Programs/Courses',      path: '/manager/programs' },
];

/* Small card component (safe to use hooks inside) */
function FeatureCard({ item, index, onPress }) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const handle = () => {
    scale.value = withSpring(0.96, { damping: 12, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
    onPress?.(item.path);
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 110).duration(550)}
      style={[styles.card, { backgroundColor: item.bg }, aStyle]}
    >
      <Pressable onPress={handle} style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel={item.label}>
        <Text style={styles.cardTitle}>{item.label}</Text>
        <Text style={styles.cardDesc}>{item.desc}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ManagerHome() {
  const router = useRouter();
  const rootState = useRootNavigationState(); // null until Root Layout is ready
  const videoRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [clickSound, setClickSound] = useState(null);
  const [allow, setAllow] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

  /* ── Guard: load user & decide access (no imperative navigation here) ── */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = auth.currentUser;
        if (!user) { setRedirectTo('/auth/login'); return; }

        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!mounted) return;

        if (!snap.exists()) { setRedirectTo('/not-authorized'); return; }

        const data = snap.data();
        setUserData(data);
        const role = String(data?.role || '').toLowerCase();
        if (['manager', 'admin', 'superadmin'].includes(role)) {
          setAllow(true);
        } else {
          setRedirectTo('/not-authorized');
        }
      } catch {
        setRedirectTo('/not-authorized');
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ── Sound preload ── */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/sound/click.mp3'));
        if (mounted) setClickSound(sound);
      } catch {/* ignore */ }
    })();
    return () => { clickSound?.unloadAsync()?.catch(()=>{}); };
  }, []);

  const onCardPress = async (path) => {
    try { await clickSound?.replayAsync(); } catch {/* ignore */ }
    router.push(path);
  };

  const handleLogout = async () => {
    Alert.alert('Déconnexion','Souhaitez-vous vraiment vous déconnecter ?',[
      { text:'Annuler', style:'cancel' },
      { text:'Confirmer', style:'destructive', onPress: async () => {
        try { await signOut(auth); router.replace('/auth/login'); } catch {/* ignore */ }
      }}
    ]);
  };

  // Pause video on unmount
  useEffect(() => () => { videoRef.current?.pauseAsync?.().catch(()=>{}); }, []);

  /* ── WAIT for Root Layout, then do safe redirects via <Redirect /> ── */
  if (!rootState?.key) return null;              // Root not mounted yet
  if (redirectTo) return <Redirect href={redirectTo} />;

  if (loadingUser) {
    return (
      <View style={[styles.center, { backgroundColor: '#fff' }]}>
        <ActivityIndicator size="large" color="#0b3b79" />
        <Text style={{ marginTop: 8, color: '#64748b' }}>Chargement…</Text>
      </View>
    );
  }

  // If not allowed and no redirect decided above, block (defensive)
  if (!allow) return <Redirect href="/not-authorized" />;

  /* ── Normal page render ── */
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top bar */}
      <View style={styles.logoStickyBar}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/images/koedu.png')}
            style={styles.logo}
            resizeMode="contain"
            accessible accessibilityLabel="KOEDU Bridge"
          />
          <View style={styles.menuActions}>
            <TouchableOpacity onPress={() => router.push('/manager/profile')}>
              <Text style={styles.menuText}>👤 Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/manager/settings')}>
              <Text style={styles.menuText}>⚙️ Paramètres</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.menuText, { color: '#dc2626' }]}>🚪 Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <RightBarMenu />

      <Animated.ScrollView
        entering={SlideInLeft.duration(450)}
        exiting={SlideOutLeft.duration(380)}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Video
            ref={videoRef}
            source={{ uri: 'https://lily.sunmoon.ac.kr/images/main/main_20250723_pc.mp4' }}
            rate={1.0}
            volume={1.0}
            isMuted
            resizeMode="cover"
            shouldPlay
            isLooping
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay}>
            <Animated.Text entering={FadeInDown.duration(750)} style={styles.welcomeText}>
              🎓 Bienvenue sur <Text style={styles.highlight}>KOEDU Bridge</Text>
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(250).duration(900)} style={styles.subText}>
              Votre portail tout-en-un pour les admissions, les statistiques, et la collaboration en équipe.
            </Animated.Text>
          </View>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {FEATURES.map((item, i) => (
            <FeatureCard key={item.path} item={item} index={i} onPress={onCardPress} />
          ))}
        </View>

        {/* Editor shortcuts */}
        <View style={{ marginTop: 22 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#0f172a', marginBottom: 10 }}>
            Quick editor actions
          </Text>
          <ScrollView horizontal contentContainerStyle={{ gap: 12 }} showsHorizontalScrollIndicator={false}>
            {EDITOR_SHORTCUTS.map((b) => (
              <Pressable key={b.path} onPress={() => onCardPress(b.path)} style={styles.quickBtn}>
                <Text style={styles.quickBtnText}>{b.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Badge */}
        {!!userData && (
          <View style={styles.badgeWrap}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                Connecté en tant que <Text style={{ fontWeight: '800' }}>{userData.name ?? 'Utilisateur'}</Text>
                {' '}— rôle: {String(userData.role || 'inconnu')}
              </Text>
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

/* ─────────────── Styles ─────────────── */
const styles = StyleSheet.create({
  center:{ flex:1, alignItems:'center', justifyContent:'center' },

  logoStickyBar:{ position:'absolute', top:0, left:0, width:'100%', zIndex:20,
    backgroundColor:'#fff', paddingHorizontal:16, paddingVertical:10, borderBottomWidth:1, borderColor:'#e5e7eb' },
  logoRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  logo:{ width:140, height:50 },
  menuActions:{ flexDirection:'row', gap:16 },
  menuText:{ fontSize:14, color:'#1e40af', fontWeight:'700' },

  mainContent:{ paddingTop:80, paddingHorizontal:20, paddingBottom:24 },

  hero:{ height:380, borderRadius:14, overflow:'hidden', marginBottom:28,
    justifyContent:'center', alignItems:'center', backgroundColor:'#000' },
  overlay:{ ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.45)',
    justifyContent:'center', alignItems:'center', padding:20 },
  welcomeText:{ fontSize:30, fontWeight: Platform.OS==='ios' ? '900':'800', color:'#fff', textAlign:'center',
    textShadowColor:'rgba(0,0,0,0.6)', textShadowOffset:{ width:0, height:1 }, textShadowRadius:3, marginBottom:8 },
  highlight:{ color:'#facc15' },
  subText:{ fontSize:16, color:'#e5e7eb', textAlign:'center', lineHeight:24, paddingHorizontal:10 },

  grid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', rowGap:18 },
  card:{ width: screenWidth > 700 ? '31.7%' : '47%', minHeight:168, borderRadius:14, padding:16, justifyContent:'center',
    shadowColor:'#000', shadowOpacity:0.15, shadowRadius:8, shadowOffset:{ width:0, height:4 }, elevation:5 },
  cardTitle:{ fontSize:20, fontWeight:'800', color:'#fff', marginBottom:8 },
  cardDesc:{ fontSize:15, color:'rgba(255,255,255,0.9)', lineHeight:22 },

  quickBtn:{ backgroundColor:'#0b3b79', borderRadius:999, paddingVertical:14, paddingHorizontal:20 },
  quickBtnText:{ color:'#fff', fontWeight:'900' },

  badgeWrap:{ marginTop:18, alignItems:'center' },
  badge:{ backgroundColor:'#f1f5f9', borderWidth:1, borderColor:'#e2e8f0',
    paddingHorizontal:12, paddingVertical:8, borderRadius:999 },
  badgeText:{ color:'#0f172a' },
});
