import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../../services/firebase';

export default function CalendarScreen() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyEvents, setDailyEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'calendarEvents'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(list);
    } catch (error) {
      console.error('Erreur chargement événements :', error);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const filtered = events.filter(e => e.date === day.dateString);
    setDailyEvents(filtered);
  };

  const openEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'vacances': return '🏖️';
      case 'anniversaire': return '🎂';
      case 'evenement': return '📅';
      default: return '📌';
    }
  };

  const getMarkedDates = () => {
    const marks = {};
    events.forEach(event => {
      marks[event.date] = {
        marked: true,
        dotColor: event.color || '#3b82f6',
        selected: selectedDate === event.date,
        selectedColor: selectedDate === event.date ? '#2563eb' : undefined,
      };
    });
    return marks;
  };

  const renderAgenda = () => (
    <View style={styles.agendaPanel}>
      <Text style={styles.agendaTitle}>📆 {selectedDate || 'Sélectionnez une date'}</Text>
      {dailyEvents.length === 0 ? (
        <Text style={styles.noEvent}>Aucun événement</Text>
      ) : (
        dailyEvents.map((event, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.eventItem, { borderLeftColor: event.color || '#3b82f6' }]}
            onPress={() => openEvent(event)}
          >
            <Text style={styles.eventHour}>🕒 {event.hour || '10:00'}</Text>
            <Text style={styles.eventTitle}>{getIcon(event.type)} {event.title}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Calendrier des événements</Text>
      </View>

      <View style={styles.content}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          theme={{
            selectedDayBackgroundColor: '#2563eb',
            todayTextColor: '#dc2626',
            arrowColor: '#1e40af',
            textSectionTitleColor: '#475569',
          }}
        />
        {renderAgenda()}
      </View>

      {/* Modal de détail */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* ✅ Image affichée si présente */}
            {selectedEvent?.imageUrl && (
              <Image
                source={{ uri: selectedEvent.imageUrl }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.modalDate}>📅 {selectedEvent?.date}</Text>
            <Text style={styles.modalDesc}>{selectedEvent?.description}</Text>

            {selectedEvent?.link && (
              <Text style={styles.link}>🔗 {selectedEvent.link}</Text>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flex: 1,
    padding: 10,
    gap: 10,
  },
  agendaPanel: {
    width: Platform.OS === 'web' ? '40%' : '100%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  agendaTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#334155',
  },
  noEvent: { color: '#94a3b8', fontStyle: 'italic' },
  eventItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
  },
  eventHour: { fontSize: 12, color: '#64748b' },
  eventTitle: { fontWeight: 'bold', color: '#1e293b' },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1e3a8a',
  },
  modalDate: {
    color: '#475569',
    marginBottom: 8,
  },
  modalDesc: {
    color: '#334155',
    marginBottom: 12,
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
