import { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import BlogCard from '../../components/BlogCard';
import CategoryFilter from '../../components/CategoryFilter';
import universities from '../../data/universities';

// Génère dynamiquement tous les tags
const allTags = [
  'All',
  ...Array.from(new Set(universities.flatMap((uni) => uni.tags || []))),
];

export default function BlogIndex() {
  const [selectedTag, setSelectedTag] = useState('All');
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 768;

  const filteredUniversities =
    selectedTag === 'All'
      ? universities
      : universities.filter((uni) => (uni.tags || []).includes(selectedTag));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎓 Explore Korean Universities</Text>
      <Text style={styles.subtitle}>Discover top universities in South Korea</Text>

      <CategoryFilter
        tags={allTags}
        selectedTag={selectedTag}
        onSelect={setSelectedTag}
      />

      <View style={[styles.list, isWideScreen && styles.grid]}>
        {filteredUniversities.length === 0 ? (
          <Text style={styles.noResult}>No universities match this category.</Text>
        ) : (
          filteredUniversities.map((uni, index) => (
            <Animated.View
              key={uni.slug}
              entering={FadeIn.delay(index * 100)}
              style={isWideScreen ? styles.cardWrapper : null}
            >
              <BlogCard university={uni} />
            </Animated.View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  list: {
    gap: 20,
    flexDirection: 'column',
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  noResult: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
});
