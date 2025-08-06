import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { auth, db } from '../../services/firebase';

export default function AddNewsAdmin() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');

  // 🔒 Protection admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace('/auth/login');
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();

      if (data?.role === 'admin') {
        setUser(currentUser);
        setAuthorized(true);
      } else {
        router.replace('/unauthorized');
      }
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async () => {
    if (!title || !category || !date || !image || !content) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'news'), {
        title,
        category,
        date,
        image,
        content,
        createdAt: Timestamp.now(),
      });
      Alert.alert('✅ News article added successfully!');
      router.push('/news');
    } catch (error) {
      console.error('Error adding news:', error);
      Alert.alert('❌ Failed to add news.');
    }
  };

  if (!authorized) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📢 Add News (Admin Panel)</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Article title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Scholarship, Partnership"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2025-08-05"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://yourcdn.com/news-img.jpg"
        value={image}
        onChangeText={setImage}
      />

      <Text style={styles.label}>HTML Content</Text>
      <TextInput
        style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
        multiline
        placeholder="<p>Write your article here...</p>"
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Publish Article</Text>
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
    fontSize: 26,
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
