import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MessageBox({ messages, onSend }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    onSend(newMessage);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.from === 'admin' ? styles.admin : styles.user]}>
            <Text style={styles.sender}>{item.from === 'admin' ? 'Admin' : 'Vous'}</Text>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.date}>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Écrire un message..."
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  admin: {
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-start',
  },
  user: {
    backgroundColor: '#dcfce7',
    alignSelf: 'flex-end',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
  },
  date: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
