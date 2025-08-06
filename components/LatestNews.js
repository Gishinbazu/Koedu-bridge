import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { db } from '../services/firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SCREEN_WIDTH * 0.85;

export default function LatestNews() {
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    const fetchNews = async () => {
      const q = query(collection(db, 'news'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(data);
    };

    fetchNews();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>News from KOEDU & Partner Universities</Text>

      <Carousel
        data={newsList}
        width={ITEM_WIDTH}
        height={320}
        autoPlay
        loop
        scrollAnimationDuration={1000}
        onProgressChange={(offsetProgress) => {
          'worklet';
          progressValue.value = offsetProgress;
        }}
        style={{ alignSelf: 'center' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/news/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.dotsContainer}>
        {newsList.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: progressValue.value.toFixed(0) == index ? 1 : 0.3,
                transform: [
                  {
                    scale: progressValue.value.toFixed(0) == index ? 1.2 : 1,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 12,
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#003366',
    borderRadius: 5,
  },
});
