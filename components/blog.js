import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

export default function Blog() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['All', 'Admissions', 'Student Life', 'Scholarships', 'Rankings'];

  const articles = [
    {
      slug: 'sunmoon',
      date: 'July 25, 2025',
      title: 'Welcome to Sun Moon University',
      category: 'Admissions',
      images: [
        require('../assets/images/image 02.jpg'),
        require('../assets/images/image 03.jpg'),
        require('../assets/images/image 04.jpg'),
      ],
      desc: "One of Korea's top and best universities known for excellence in education, research, and innovation.",
      video: 'https://youtu.be/jkm98mmNFyw',
    },
    {
      slug: 'snu',
      date: 'July 25, 2025',
      title: 'Exploring Seoul National University',
      category: 'Rankings',
      images: [
        { uri: 'https://cdn.stmarytx.edu/wp-content/uploads/2021/10/st-louis-hall.jpg' },
        { uri: 'https://en.snu.ac.kr/webdata/uploads/eng/image/2020/02/index-campas-img01.jpg' },
        { uri: 'https://thongtinduhoc.org/uploads/129/5e28447f70b26.jpg' },
      ],
      desc: 'SNU is renowned for its academic prestige and research leadership.',
      video: 'https://youtu.be/8Rgn-TskeQI',
    },
    {
      slug: 'kaist',
      date: 'July 20, 2025',
      title: 'A Visit to KAIST',
      category: 'Student Life',
      images: [
        { uri: 'https://smapse.com/storage/2018/09/converted/825_585_south-korea-kaist-building.jpg' },
        { uri: 'https://beasiswakorea.com/wp-content/uploads/2022/08/Fisika-Sumber-studyoverseas.soton_.ac_.uk--768x480.png' },
      ],
      desc: 'KAIST is a leader in science and technology. Discover its innovative environment.',
      video: 'https://youtu.be/UEYCIqrlayc',
    },
    {
      slug: 'yonsei',
      date: 'July 18, 2025',
      title: 'Inside Yonsei University',
      category: 'Scholarships',
      images: [
        { uri: 'https://collegetimes.co/wp-content/uploads/yonsei-university-seoul-1.jpg' },
        { uri: 'https://res.cloudinary.com/dxnp17qbz/image/upload/v1681353163/Yonsei_University_Has_14_Fields_Ranked_in_World_Top_50_1_sgzfgx.jpg' },
      ],
      desc: 'Yonsei blends academic prestige with vibrant student life and culture.',
      video: 'https://youtu.be/4CZ5p4RZZ0A',
    },
  ];

  const filteredArticles = selectedCategory && selectedCategory !== 'All'
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.blogTitle}>Universities</Text>
      <Text style={styles.subtitle}>Explore top universities in South Korea.</Text>

      <View style={styles.categoryBar}>
        {categories.map((cat, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.catButton, selectedCategory === cat && styles.catSelected]}
            onPress={() => setSelectedCategory(cat === 'All' ? null : cat)}
          >
            <Text style={selectedCategory === cat ? styles.catTextActive : styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredArticles.map((article, index) => (
        <Animated.View key={index} entering={FadeIn} style={styles.card}>
          <Carousel
            width={370}
            height={250}
            data={article.images}
            loop
            autoPlay
            scrollAnimationDuration={1500}
            renderItem={({ item }) => (
              <Image source={item} style={styles.image} />
            )}
          />
          <Text style={styles.date}>{article.date}</Text>
          <Text style={styles.cardTitle}>{article.title}</Text>
          <Text style={styles.cardDesc}>{article.desc}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.videoButton}
              onPress={() => Linking.openURL(article.video)}
            >
              <Text style={styles.videoButtonText}>🎬 Watch Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => router.push(`/blog/${article.slug}`)}
            >
              <Text style={styles.readMoreText}>Read More →</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  blogTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  categoryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
    justifyContent: 'center',
  },
  catButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  catSelected: {
    backgroundColor: '#003366',
  },
  catText: {
    color: '#333',
  },
  catTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#003366',
  },
  cardDesc: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  videoButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  videoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  readMoreButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  readMoreText: {
    color: '#003366',
    fontWeight: 'bold',
  },
});
