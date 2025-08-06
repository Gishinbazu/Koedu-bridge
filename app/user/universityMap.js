import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Footer from '../../components/Footer'; // ✅ import du Footer

export default function UniversityMap() {
  const router = useRouter();

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"/>
        <style>
          html, body, #map {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            font-family: sans-serif;
          }
          .popup-content {
            font-size: 14px;
            line-height: 1.4;
          }
          .popup-btn {
            margin-top: 6px;
            display: inline-block;
            background: #0077cc;
            color: white;
            padding: 5px 10px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([36.5, 127.8], 7);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          }).addTo(map);

          const universities = [
            {
              name: 'Sun Moon University',
              lat: 36.8017,
              lon: 127.0716,
              desc: 'Université chrétienne réputée située à Asan.',
              link: 'https://koedubridge.com/blog/sunmoon'
            },
            {
              name: 'Seoul National University',
              lat: 37.4599,
              lon: 126.9519,
              desc: 'Université nationale la plus prestigieuse de Corée.',
              link: 'https://koedubridge.com/blog/seoul-national'
            },
            {
              name: 'KAIST',
              lat: 36.3726,
              lon: 127.3628,
              desc: 'Institut de recherche en sciences et ingénierie.',
              link: 'https://koedubridge.com/blog/kaist'
            },
            {
              name: 'Yonsei University',
              lat: 37.5658,
              lon: 126.9386,
              desc: 'Université privée renommée à Séoul.',
              link: 'https://koedubridge.com/blog/yonsei'
            }
          ];

          universities.forEach(u => {
            const popupContent = \`
              <div class="popup-content">
                <strong>\${u.name}</strong><br/>
                \${u.desc}<br/>
                <a class="popup-btn" target="_blank" href="\${u.link}">En savoir plus</a>
              </div>
            \`;
            L.marker([u.lat, u.lon]).addTo(map).bindPopup(popupContent);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* ✅ Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity
        onPress={() => {
            if (router.canGoBack?.()) {
            router.back();
            } else {
            router.push('/dashboard'); // page par défaut si pas d'historique
            }
        }}
        style={styles.backButton}
        >
        <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerText}>📍 Localisation des Universités</Text>
          <Text style={styles.subHeader}>
            Explorez les principales universités de Corée du Sud sur la carte interactive.
          </Text>
        </View>
      </View>

      {/* ✅ Carte Web (iframe) ou Mobile (WebView) */}
      {Platform.OS === 'web' ? (
        <iframe
          title="Carte Universités"
          src="https://www.google.com/maps/d/u/0/embed?mid=1ejXmps-jwqImXC6FSdfHXUFNv_mbXz4&ehbc=2E312F"
          width="100%"
          height="600"
          style={styles.iframe}
          loading="lazy"
        />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: leafletHTML }}
          style={styles.map}
          javaScriptEnabled
          domStorageEnabled
        />
      )}

      {/* ✅ Footer avec marge */}
      <View style={{ marginTop: 40, width: '100%' }}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  header: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  iframe: {
    border: 'none',
    width: '100%',
    height: 600,
  },
  map: {
    width: '100%',
    height: 600,
  },
});
