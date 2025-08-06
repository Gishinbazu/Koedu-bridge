// components/MapWebView.js
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapWebView() {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
      <style>
        #map { height: 100vh; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([37.5665, 126.9780], 7); // Seoul
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        const universities = [
          { name: 'Sun Moon University', lat: 36.8017, lon: 127.0716 },
          { name: 'SNU', lat: 37.4599, lon: 126.9519 },
          { name: 'KAIST', lat: 36.3726, lon: 127.3628 },
          { name: 'Yonsei', lat: 37.5658, lon: 126.9386 },
          { name: 'KU', lat: 37.5894, lon: 127.0337 },
          { name: 'POSTECH', lat: 36.0145, lon: 129.3238 },
          { name: 'Hanyang', lat: 37.5577, lon: 127.0456 },
          { name: 'Ewha', lat: 37.5642, lon: 126.9613 },
          { name: 'SKKU', lat: 37.5871, lon: 126.9931 },
          { name: 'Ajou', lat: 37.2837, lon: 127.0437 },
        ];

        universities.forEach(u => {
          L.marker([u.lat, u.lon]).addTo(map).bindPopup(u.name);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={{ height: Dimensions.get('window').height }}
    />
  );
}
