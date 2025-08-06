import { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    question: "What if I’m on the waiting list?",
    answer: "If you’re placed on a waiting list, you may be offered admission if someone else declines their offer.",
  },
  {
    question: "How do I pay tuition fees?",
    answer: "You’ll receive instructions on how and when to pay after you’re admitted. Payments are usually made by bank transfer.",
  },
  {
    question: "What does ‘Unqualified’ mean?",
    answer: "It means that you didn’t meet the basic requirements for the program, such as GPA, documents, or deadlines.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❓ Frequently Asked Questions</Text>
      {faqData.map((item, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity onPress={() => toggleItem(index)}>
            <Text style={styles.question}>{item.question}</Text>
          </TouchableOpacity>
          {openIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fbff',
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003366',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#003366',
  },
  answer: {
    marginTop: 10,
    color: '#444',
    fontSize: 14,
    lineHeight: 20,
  },
});
