import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryFilter({ tags = [], selectedTag, onSelect }) {
  return (
    <View style={styles.filterContainer}>
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag}
          onPress={() => onSelect(tag)}
          style={[
            styles.filterButton,
            selectedTag === tag && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              selectedTag === tag && styles.selectedText,
            ]}
          >
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f1f1',
  },
  selectedButton: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
