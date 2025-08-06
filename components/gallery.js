import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RegionTypeFilter from '../components/RegionTypeFilter';
import universities from '../data/universities';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 60) / numColumns;

export default function Gallery() {
  const router = useRouter();

  // Extraire régions et types uniques
  const regions = Array.from(new Set(universities.map((u) => u.region)));
  const types = Array.from(new Set(universities.map((u) => u.type)));

  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filtrage combiné
  const filteredUniversities = universities.filter((u) => {
    const regionMatch = selectedRegion === 'All' || u.region === selectedRegion;
    const typeMatch = selectedType === 'All' || u.type === selectedType;
    return regionMatch && typeMatch;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/blog/${item.slug}`)}>
      <Image
        source={
          typeof item.images[0] === 'number'
            ? item.images[0]
            : { uri: item.images[0]?.uri || item.images[0] }
        }
        style={styles.image}
        resizeMode="contain" // dézoom automatique
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.cardDesc}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏫 Galerie des Universités</Text>

      <RegionTypeFilter
        regions={regions}
        types={types}
        selectedRegion={selectedRegion}
        selectedType={selectedType}
        onSelectRegion={setSelectedRegion}
        onSelectType={setSelectedType}
      />

      <FlatList
        data={filteredUniversities}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  card: {
    width: itemWidth,
    backgroundColor: '#f1f9ff',
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#eee',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#444',
  },
});
