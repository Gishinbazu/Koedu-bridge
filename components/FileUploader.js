import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FileUploader({ label, file, setFile }) {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.type === 'success') {
        setFile(result);
      }
    } catch (error) {
      console.error('Erreur lors du choix du fichier :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
        <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
        <Text style={styles.uploadText}>Choisir un fichier</Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.preview}>
          {file.mimeType?.includes('image') ? (
            <Image source={{ uri: file.uri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.fileName}>{file.name}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    padding: 10,
    borderRadius: 6,
  },
  uploadText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
  },
  preview: {
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  fileName: {
    fontStyle: 'italic',
    color: '#334155',
  },
});
