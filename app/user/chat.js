import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../services/firebase';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        sender: user.email,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      setMessage('');
    } catch (error) {
      console.error('Erreur d’envoi:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.uid === user.uid;
    return (
      <View style={[styles.messageBubble, isMe ? styles.me : styles.admin]}>
        <Text style={styles.sender}>{isMe ? 'Moi' : 'Admin'}</Text>
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
          placeholder="Votre message..."
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
  me: {
    backgroundColor: '#003366',
    alignSelf: 'flex-end',
  },
  admin: {
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
