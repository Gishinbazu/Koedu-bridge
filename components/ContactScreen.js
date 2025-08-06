import { useState } from 'react';
import {
  Alert,
  CheckBox,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [newsletter, setNewsletter] = useState('');

  const handleSend = () => {
    if (!agree) {
      Alert.alert('Please accept the privacy policy');
      return;
    }
    if (!name || !email || !subject || !message) {
      Alert.alert('Please fill all fields');
      return;
    }
    Alert.alert('Message Sent!', 'We will contact you soon.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contact</Text>

      <View style={styles.contactWrapper}>
        {/* Left Column */}
        <View style={styles.notesBox}>
          <Text style={styles.description}>Need to get in touch? No problem! You can use our contact form to send us a message.</Text>
          <Text style={styles.bullet}>• Need a support? Check our available <Text style={styles.link}>support options</Text></Text>
          <Text style={styles.bullet}>• Want to remove the back links to BootstrapMade? Check our available <Text style={styles.link}>licensing options</Text></Text>
        </View>

        {/* Right Column - Form */}
        <View style={styles.formBox}>
          <View style={styles.row}>
            <TextInput
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
              style={styles.inputHalf}
            />
            <TextInput
              placeholder="Your Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.inputHalf}
            />
          </View>
          <TextInput
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
          />
          <TextInput
            placeholder="Your Message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          />

          <View style={styles.checkboxRow}>
            <CheckBox value={agree} onValueChange={setAgree} />
            <Text style={styles.policy}>I've read and accept the <Text style={styles.link}>privacy policy</Text>.</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Newsletter Section */}
      <View style={styles.newsletterSection}>
        <Text style={styles.newsTitle}>Join Our Newsletter</Text>
        <Text style={styles.newsDesc}>
          Subscribe to our newsletter to receive emails about new template releases and updates
        </Text>
        <View style={styles.row}>
          <TextInput
            placeholder="Enter your Email address"
            value={newsletter}
            onChangeText={setNewsletter}
            style={styles.newsInput}
          />
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#003366',
  },
  contactWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  notesBox: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#fdf7e4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  description: {
    marginBottom: 10,
    fontSize: 14,
  },
  bullet: {
    fontSize: 14,
    marginBottom: 6,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  formBox: {
    flex: 1,
    minWidth: 300,
    paddingLeft: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  policy: {
    marginLeft: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  newsletterSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#f1f7fd',
    borderRadius: 10,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    color: '#003366',
  },
  newsDesc: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 14,
  },
  newsInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  subscribeBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  subscribeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
