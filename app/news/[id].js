import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { db } from '../../services/firebase';

const screenWidth = Dimensions.get('window').width;

export default function NewsDetail() {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle(docSnap.data());
      }
    };
    fetchNews();
  }, [id]);

  if (!article) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: article.image }} style={styles.image} />
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.date}>{article.date}</Text>

      {/* ✅ HTML content displayed here */}
      <View style={{ height: 400 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: article.content }}
          style={{ flex: 1 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  image: {
    width: screenWidth - 32,
    height: 220,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
});
