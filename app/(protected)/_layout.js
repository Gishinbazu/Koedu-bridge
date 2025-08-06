// // app/(protected)/_layout.js
// import { Slot } from 'expo-router';
// import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
// import Footer from '../../components/Footer';

// export default function ProtectedLayout() {
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.body}>
//           <Slot />
//         </View>
//         <Footer />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flexGrow: 1,
//     justifyContent: 'space-between',
//     paddingBottom: 20,
//   },
//   body: {
//     flex: 1,
//     padding: 16,
//   },
// });
