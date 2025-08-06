import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../../services/firebase';

export default function NewsIndex() {
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const q = query(collection(db, 'news'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const uniqueCategories = ['All', ...new Set(data.map(n => n.category || 'Uncategorized'))];

      setNewsList(data);
      setFilteredNews(data);
      setCategories(uniqueCategories);
      setLoading(false);
    };

    fetchNews();
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setFilteredNews(newsList);
    } else {
      setFilteredNews(newsList.filter(n => n.category === cat));
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/news/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textWrapper}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>KOEDU News & Announcements</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categorySelected,
            ]}
            onPress={() => handleCategorySelect(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredNews}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.newsList}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#003366',
    padding: 20,
    textAlign: 'center',
  },
  categoryBar: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  categorySelected: {
    backgroundColor: '#003366',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  newsList: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  textWrapper: {
    padding: 12,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 18,
    color: '#003366',
    fontWeight: '600',
    marginTop: 4,
  },
  category: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f3c76b',
  },
});
