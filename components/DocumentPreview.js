import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DocumentPreview({ name, uri }) {
  const isImage = uri?.match(/\.(jpeg|jpg|png|gif)$/i);

  const handleOpen = () => {
    if (uri) {
      Linking.openURL(uri);
    }
  };

  return (
    <TouchableOpacity onPress={handleOpen} style={styles.container}>
      {isImage ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.pdfContainer}>
          <Ionicons name="document-text-outline" size={28} color="#4f46e5" />
          <Text style={styles.fileName}>{name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f1f5f9',
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    marginLeft: 10,
    fontSize: 14,
    color: '#334155',
    flexShrink: 1,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 6,
  },
});
