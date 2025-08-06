import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TopBar from '../../components/TopBar';
import { db } from '../../services/firebase';

const formatDate = (dateObj) => {
  const d = new Date(dateObj);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function ManagerCalendar() {
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyEvents, setDailyEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter(); // 👈 Ajout du routeur

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'calendarEvents'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const marked = {};
      list.forEach(event => {
        const date = formatDate(event.date);
        marked[date] = {
          marked: true,
          dotColor: event.color || '#00B0FF',
          selected: selectedDate === date,
        };
      });

      setEvents(list);
      setMarkedDates(marked);
    } catch (error) {
      console.error('Erreur lors du chargement des événements :', error);
    }
  };

  const handleDayPress = (day) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    setModalVisible(true);

    const todayEvents = events.filter(
      (event) => formatDate(event.date) === selected
    );
    setDailyEvents(todayEvents);
  };

  return (
    <View style={styles.container}>
        {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      <TopBar title="Calendrier Manager" />

      

      <Calendar
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: '#2196F3',
          },
        }}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#00B0FF',
          arrowColor: '#2196F3',
          selectedDayBackgroundColor: '#2196F3',
        }}
      />

      {/* Modal d’événements */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📅 {selectedDate}</Text>
            <ScrollView>
              {dailyEvents.length > 0 ? (
                dailyEvents.map((event, idx) => (
                  <View key={idx} style={styles.eventCard}>
                    <Text style={styles.eventTitle}>📝 {event.title}</Text>
                    {event.description && (
                      <Text style={styles.eventDesc}>{event.description}</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.noEvents}>Aucun événement pour cette date.</Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  eventCard: {
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 10,
  },
  eventTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  eventDesc: {
    color: '#555',
    marginTop: 4,
  },
  noEvents: {
    fontStyle: 'italic',
    color: '#888',
  },
});
