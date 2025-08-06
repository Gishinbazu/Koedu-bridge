import { useLocalSearchParams } from 'expo-router';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../../services/firebase';

export default function AdminChatWithStudent() {
  const { id } = useLocalSearchParams(); // uid de l’étudiant
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, 'messages'),
      where('uid', '==', id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        sender: 'Admin',
        uid: id,
        createdAt: serverTimestamp(),
        fromAdmin: true,
      });
      setMessage('');
    } catch (error) {
      console.error('Erreur envoi message admin :', error);
    }
  };

  const renderItem = ({ item }) => {
    const isAdmin = item.fromAdmin;
    return (
      <View style={[styles.messageBubble, isAdmin ? styles.admin : styles.student]}>
        <Text style={styles.sender}>{isAdmin ? 'Admin' : 'Étudiant'}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Réponse de l’admin..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  chatContainer: {
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    maxWidth: '80%',
  },
  admin: {
    backgroundColor: '#003366',
    alignSelf: 'flex-end',
  },
  student: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  text: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#003366',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});
