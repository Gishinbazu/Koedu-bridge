// components/RegionTypeFilter.js
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegionTypeFilter({ regions, types, selectedRegion, selectedType, onSelectRegion, onSelectType }) {
  return (
    <View>
      <Text style={styles.label}>📍 Région</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['All', ...regions].map((region) => (
          <TouchableOpacity
            key={region}
            style={[styles.button, selectedRegion === region && styles.active]}
            onPress={() => onSelectRegion(region)}
          >
            <Text style={styles.text}>{region}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>🏛️ Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['All', ...types].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.button, selectedType === type && styles.active]}
            onPress={() => onSelectType(type)}
          >
            <Text style={styles.text}>{type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#003366',
    fontSize: 14,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e6f0ff',
    borderRadius: 20,
    marginRight: 8,
    marginTop: 6,
  },
  active: {
    backgroundColor: '#003366',
  },
  text: {
    color: '#003366',
    fontWeight: '500',
  },
});
