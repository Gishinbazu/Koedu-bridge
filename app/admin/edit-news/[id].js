import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { db } from '../../../services/firebase';

export default function EditNews() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle({ id, ...docSnap.data() });
      } else {
        Alert.alert('Article not found');
        router.replace('/news');
      }
    };

    fetchNews();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'news', article.id);
      await updateDoc(docRef, {
        title: article.title,
        date: article.date,
        image: article.image,
        content: article.content,
        category: article.category,
      });
      Alert.alert('✅ Article updated');
      router.push('/news');
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('❌ Update failed');
    }
  };

  if (!article) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>✏️ Edit News Article</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={article.title}
        onChangeText={(text) => setArticle({ ...article, title: text })}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={article.category}
        onChangeText={(text) => setArticle({ ...article, category: text })}
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={article.date}
        onChangeText={(text) => setArticle({ ...article, date: text })}
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={article.image}
        onChangeText={(text) => setArticle({ ...article, image: text })}
      />

      <Text style={styles.label}>HTML Content</Text>
      <TextInput
        style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
        multiline
        value={article.content}
        onChangeText={(text) => setArticle({ ...article, content: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#003366',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#003366',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
