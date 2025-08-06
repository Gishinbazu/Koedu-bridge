// import { useRouter } from 'expo-router';
// import { onAuthStateChanged } from 'firebase/auth';
// import { collection, getDocs } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { auth, db } from '../../services/firebase';
// import { checkAdminAccess } from '../../utils/AuthGuard';

// export default function AdminApplicationsScreen() {
//   const router = useRouter();
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         const allowed = await checkAdminAccess(firebaseUser.uid);
//         if (!allowed) {
//           Alert.alert("Accès refusé", "Seuls les administrateurs peuvent voir les candidatures.");
//           router.replace('/dashboard');
//         } else {
//           setAuthorized(true);
//           fetchApplications();
//         }
//       } else {
//         router.replace('/login');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchApplications = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'applications'));
//       const data = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setApplications(data);
//     } catch (error) {
//       console.error('Erreur de chargement des candidatures :', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => router.push(`/admin/${item.id}`)}
//     >
//       <Text style={styles.name}>{item.fullName}</Text>
//       <Text style={styles.detail}>📧 {item.email}</Text>
//       <Text style={styles.detail}>🎓 {item.education}</Text>
//       <Text style={styles.status}>Statut : {item.status || 'en attente'}</Text>
//     </TouchableOpacity>
//   );

//   if (loading || !authorized) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#003366" />
//         <Text>Chargement des candidatures...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📋 Candidatures reçues</Text>
//       {applications.length === 0 ? (
//         <Text style={styles.empty}>Aucune candidature pour le moment.</Text>
//       ) : (
//         <FlatList
//           data={applications}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.list}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: '#003366',
//   },
//   empty: {
//     textAlign: 'center',
//     color: '#999',
//     fontSize: 16,
//     marginTop: 20,
//   },
//   list: {
//     paddingBottom: 40,
//   },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 16,
//     borderRadius: 10,
//     marginBottom: 14,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   detail: {
//     fontSize: 15,
//     color: '#444',
//     marginTop: 4,
//   },
//   status: {
//     marginTop: 10,
//     fontWeight: '600',
//     color: '#003366',
//   },
// });
