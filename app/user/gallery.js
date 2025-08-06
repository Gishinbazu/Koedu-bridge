import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import universities from '../../data/universities';

export default function GalleryScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams();

  const handleBack = () => {
    if (from === 'home') {
      router.replace('/user/home');
    } else {
      router.replace('/user/dashboard');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/blog/${item.slug}`)}
    >
      <Image
        source={
          typeof item.images[0] === 'string'
            ? { uri: item.images[0] }
            : item.images[0]
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc} numberOfLines={3}>
          {item.desc}
        </Text>
        <View style={styles.badges}>
          <Text style={styles.topBadge}>TOP</Text>
          <Text style={styles.tag}>{item.region}</Text>
          <Text style={styles.tag}>{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.header}>🎓 Universités recommandées</Text>
      </View>

      <FlatList
        data={universities}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 14,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topBadge: {
    backgroundColor: '#f97316',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
    marginRight: 4,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    color: '#1e3a8a',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginTop: 4,
  },
});
