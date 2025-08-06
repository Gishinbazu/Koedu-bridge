// import { useRouter } from 'expo-router';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { auth, db } from '../../services/firebase';
// import { checkAuth, checkSuperAdmin } from '../../utils/AuthGuard';

// export default function CreateAdmin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [authorized, setAuthorized] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const verify = async () => {
//       const user = await checkAuth();
//       if (!user) return router.replace('/login');
//       const isSuper = await checkSuperAdmin(user.uid);
//       if (!isSuper) return router.replace('/');

//       setAuthorized(true);
//     };
//     verify();
//   }, []);

//   const handleCreate = async () => {
//     if (!email || !password) {
//       Alert.alert('Erreur', 'Veuillez remplir tous les champs');
//       return;
//     }

//     setLoading(true);
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const uid = userCredential.user.uid;

//       await setDoc(doc(db, 'users', uid), {
//         email,
//         role: 'admin',
//         createdAt: new Date(),
//       });

//       Alert.alert('Succès', 'Compte administrateur créé');
//       setEmail('');
//       setPassword('');
//     } catch (err) {
//       Alert.alert('Erreur', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authorized === null) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text>Vérification des droits…</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🧑‍💻 Créer un compte Admin</Text>
//       <TextInput
//         placeholder="Email de l’admin"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         placeholder="Mot de passe"
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
//         <Text style={styles.buttonText}>{loading ? 'Création…' : 'Créer le compte'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: '#003366' },
//   input: { backgroundColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 14 },
//   button: { backgroundColor: '#003366', padding: 14, borderRadius: 8 },
//   buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
// });
