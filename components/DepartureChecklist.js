import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const defaultItems = [
  { id: '1', label: 'Lettre d’admission imprimée', checked: false },
  { id: '2', label: 'Visa coréen collé sur le passeport', checked: false },
  { id: '3', label: 'Billet d’avion réservé', checked: false },
  { id: '4', label: 'Assurance voyage', checked: false },
  { id: '5', label: 'Réservation de logement', checked: false },
  { id: '6', label: 'Carte SIM internationale ou eSIM', checked: false },
  { id: '7', label: 'Documents originaux + copies (diplômes, relevés, etc.)', checked: false },
];

export default function DepartureChecklist() {
  const [items, setItems] = useState(defaultItems);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.checked && styles.itemChecked]}
      onPress={() => toggleItem(item.id)}
    >
      <Ionicons
        name={item.checked ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={item.checked ? '#22c55e' : '#94a3b8'}
        style={{ marginRight: 10 }}
      />
      <Text style={[styles.label, item.checked && styles.labelChecked]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧳 Checklist de départ – Étudier en Corée</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 14,
    color: '#0f172a',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemChecked: {
    backgroundColor: '#ecfdf5',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 14,
    color: '#334155',
  },
  labelChecked: {
    textDecorationLine: 'line-through',
    color: '#16a34a',
  },
});
