// // app/user/map.js
// import { Dimensions, StyleSheet, View } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function UserMapScreen() {
//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"/>
//         <style>
//           body, html, #map { height: 100%; margin: 0; padding: 0; }
//         </style>
//       </head>
//       <body>
//         <div id="map"></div>
//         <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
//         <script>
//           const map = L.map('map').setView([36.5, 127.5], 7);
//           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
//           }).addTo(map);

//           const universities = [
//             { name: 'Sun Moon University', lat: 36.8017, lon: 127.0716 },
//             { name: 'SNU', lat: 37.4599, lon: 126.9519 },
//             { name: 'KAIST', lat: 36.3726, lon: 127.3628 },
//             { name: 'Yonsei', lat: 37.5658, lon: 126.9386 },
//             { name: 'Korea University', lat: 37.5894, lon: 127.0337 },
//             { name: 'POSTECH', lat: 36.0145, lon: 129.3238 },
//             { name: 'Hanyang University', lat: 37.5577, lon: 127.0456 },
//             { name: 'Ewha Womans University', lat: 37.5642, lon: 126.9613 },
//             { name: 'Sungkyunkwan University', lat: 37.5871, lon: 126.9931 },
//             { name: 'Ajou University', lat: 37.2837, lon: 127.0437 },
//           ];

//           universities.forEach(u => {
//             L.marker([u.lat, u.lon]).addTo(map).bindPopup(u.name);
//           });
//         </script>
//       </body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <WebView
//         originWhitelist={['*']}
//         source={{ html }}
//         style={styles.map}
//         javaScriptEnabled
//         domStorageEnabled
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     height: Dimensions.get('window').height,
//     width: Dimensions.get('window').width,
//   },
// });
