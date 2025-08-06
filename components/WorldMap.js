// // components/WorldMap.js
// import { collection, getDocs } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   ZoomableGroup
// } from 'react-simple-maps';
// import { db } from '../services/firebase';

// const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// export default function WorldMap() {
//   const [countryCounts, setCountryCounts] = useState({});
//   const [tooltip, setTooltip] = useState('');
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     const fetchData = async () => {
//       const snapshot = await getDocs(collection(db, 'applications'));
//       const counts = {};

//       snapshot.docs.forEach((doc) => {
//         const { nationalite, status } = doc.data();
//         if (nationalite) {
//           if (!counts[nationalite]) {
//             counts[nationalite] = { total: 0, accepted: 0, pending: 0, rejected: 0 };
//           }
//           counts[nationalite].total += 1;
//           if (status === 'accepté') counts[nationalite].accepted += 1;
//           else if (status === 'rejeté') counts[nationalite].rejected += 1;
//           else counts[nationalite].pending += 1;
//         }
//       });

//       setCountryCounts(counts);
//     };

//     fetchData();
//   }, []);

//   const getColor = (country) => {
//     const data = countryCounts[country];
//     if (!data) return '#e0e0e0';

//     if (filter === 'accepted') return data.accepted > 0 ? '#4caf50' : '#eee';
//     if (filter === 'pending') return data.pending > 0 ? '#ffc107' : '#eee';
//     if (filter === 'rejected') return data.rejected > 0 ? '#f44336' : '#eee';

//     if (data.accepted > 0) return '#4caf50';
//     if (data.pending > 0) return '#ffc107';
//     if (data.rejected > 0) return '#f44336';
//     return '#e0e0e0';
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🌍 Répartition géographique des candidats</Text>

//       {/* Filtres */}
//       <View style={styles.filters}>
//         {[
//           { key: 'all', label: '🌐 Tous' },
//           { key: 'accepted', label: '🟢 Acceptés' },
//           { key: 'pending', label: '🟠 En attente' },
//           { key: 'rejected', label: '🔴 Rejetés' },
//         ].map(({ key, label }) => (
//           <TouchableOpacity
//             key={key}
//             onPress={() => setFilter(key)}
//             style={[styles.filterButton, filter === key && styles.activeFilter]}
//           >
//             <Text style={styles.filterText}>{label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Carte */}
//       <View style={styles.mapWrapper}>
//         <ComposableMap projection="geoEqualEarth" width={800} height={350}>
//           <ZoomableGroup>
//             <Geographies geography={geoUrl}>
//               {({ geographies }) =>
//                 geographies.map((geo) => {
//                   const countryName = geo.properties.NAME;
//                   const data = countryCounts[countryName];

//                   return (
//                     <Geography
//                       key={geo.rsmKey}
//                       geography={geo}
//                       fill={getColor(countryName)}
//                       stroke="#ccc"
//                       onMouseEnter={() => {
//                         if (data) {
//                           setTooltip(
//                             `${countryName}\n\ud83d\udc65 Total: ${data.total}\n\ud83d\udfe2 Acceptés: ${data.accepted}\n\ud83d\udfe0 En attente: ${data.pending}\n\ud83d\udd34 Rejetés: ${data.rejected}`
//                           );
//                         } else {
//                           setTooltip(`${countryName}\nAucune candidature`);
//                         }
//                       }}
//                       onMouseLeave={() => setTooltip('')}
//                       style={{
//                         default: { outline: 'none' },
//                         hover: { fill: '#2196f3', outline: 'none' },
//                         pressed: { fill: '#2196f3', outline: 'none' },
//                       }}
//                     />
//                   );
//                 })
//               }
//             </Geographies>
//           </ZoomableGroup>
//         </ComposableMap>
//       </View>

//       {/* Tooltip affiché */}
//       {tooltip && (
//         <View style={styles.tooltipBox}>
//           {tooltip.split('\n').map((line, index) => (
//             <Text key={index} style={styles.tooltipText}>{line}</Text>
//           ))}
//         </View>
//       )}

//       {/* Légende */}
//       <View style={styles.legend}>
//         <Text>🟢 Acceptés</Text>
//         <Text>🟠 En attente</Text>
//         <Text>🔴 Rejetés</Text>
//         <Text>⬜ Aucun</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     margin: 20,
//     borderRadius: 12,
//     padding: 16,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   filters: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   filterButton: {
//     backgroundColor: '#eee',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     margin: 4,
//   },
//   activeFilter: {
//     backgroundColor: '#2196f3',
//   },
//   filterText: {
//     color: '#333',
//     fontWeight: '600',
//   },
//   mapWrapper: {
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   tooltipBox: {
//     backgroundColor: '#333',
//     padding: 10,
//     marginTop: 10,
//     borderRadius: 8,
//     alignSelf: 'center',
//   },
//   tooltipText: {
//     color: '#fff',
//     fontSize: 13,
//     lineHeight: 18,
//     textAlign: 'center',
//   },
//   legend: {
//     marginTop: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
// });
