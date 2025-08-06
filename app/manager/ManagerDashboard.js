import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import {
  collection,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { db } from '../../services/firebase';

const screenWidth = Dimensions.get('window').width;

export default function ManagerDashboard() {
  const router = useRouter();
  const [userCount, setUserCount] = useState(0);
  const [formCount, setFormCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, search, statusFilter, sortOrder]);

  const fetchData = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, 'users'));
      const usersOnly = userSnapshot.docs.map(doc => doc.data()).filter(u => u.role === 'user');
      setUserCount(usersOnly.length);

      const formSnapshot = await getDocs(collection(db, 'koreanLangForm'));
      let forms = formSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (search) {
        const s = search.toLowerCase();
        forms = forms.filter(f =>
          f.name?.toLowerCase().includes(s) ||
          f.email?.toLowerCase().includes(s) ||
          f.nationality?.toLowerCase().includes(s)
        );
      }

      if (statusFilter !== 'all') {
        forms = forms.filter(f => f.status === statusFilter);
      }

      const filtered = filterByPeriod(forms, selectedPeriod);

      const sortedForms = [...filtered].sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(0);
        const dateB = b.submittedAt?.toDate?.() || new Date(0);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

      setRecentApplicants(sortedForms);
      setFormCount(sortedForms.length);
      setAcceptedCount(sortedForms.filter(f => f.status === 'accepted').length);
      setPendingCount(sortedForms.filter(f => f.status === 'pending').length);
      setRejectedCount(sortedForms.filter(f => f.status === 'rejected').length);
    } catch (e) {
      console.error('Erreur chargement candidatures', e);
    }
  };

  const filterByPeriod = (forms, period) => {
    const now = new Date();
    let startDate;
    switch (period) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      default:
        return forms;
    }
    return forms.filter(f => f.submittedAt?.toDate?.() >= startDate);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'koreanLangForm', id), { status: newStatus });
      Alert.alert('Succès', `Statut mis à jour : ${newStatus}`);
      fetchData();
    } catch (e) {
      console.error('Erreur mise à jour statut', e);
    }
  };

  const chartData = [
    { name: 'Acceptés', population: acceptedCount, color: '#10b981', legendFontColor: '#374151', legendFontSize: 14 },
    { name: 'En attente', population: pendingCount, color: '#f59e0b', legendFontColor: '#374151', legendFontSize: 14 },
    { name: 'Rejetés', population: rejectedCount, color: '#ef4444', legendFontColor: '#374151', legendFontSize: 14 },
  ];

  return (
    <View style={styles.container}>

      {/* 🔙 Bouton retour */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#e0e7ff',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          marginTop: 16,
          marginLeft: screenWidth > 700 ? 240 : 20,
        }}
      >
        <Text style={{ fontSize: 16, color: '#1d4ed8', fontWeight: 'bold' }}>⬅️ Retour</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📊 Tableau de bord - Manager</Text>

        <View style={styles.filters}>
          <TextInput
            placeholder="🔍 Nom, email, nationalité"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Picker selectedValue={statusFilter} style={styles.picker} onValueChange={setStatusFilter}>
            <Picker.Item label="Tous les statuts" value="all" />
            <Picker.Item label="Acceptés ✅" value="accepted" />
            <Picker.Item label="En attente ⏳" value="pending" />
            <Picker.Item label="Rejetés ❌" value="rejected" />
          </Picker>
          <Picker selectedValue={sortOrder} style={styles.picker} onValueChange={setSortOrder}>
            <Picker.Item label="📅 Du plus récent" value="desc" />
            <Picker.Item label="📅 Du plus ancien" value="asc" />
          </Picker>
        </View>

        <View style={styles.kpiContainer}>
          <View style={styles.card}><Text style={styles.kpiTitle}>👤 Utilisateurs</Text><Text style={styles.kpiValue}>{userCount}</Text></View>
          <View style={styles.card}><Text style={styles.kpiTitle}>📝 Formulaires</Text><Text style={styles.kpiValue}>{formCount}</Text></View>
          <View style={styles.card}><Text style={styles.kpiTitle}>✅ Acceptés</Text><Text style={styles.kpiValue}>{acceptedCount}</Text></View>
          <View style={styles.card}><Text style={styles.kpiTitle}>⏳ En attente</Text><Text style={styles.kpiValue}>{pendingCount}</Text></View>
        </View>

        <Text style={styles.chartTitle}>📈 Répartition des statuts</Text>
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: () => `rgba(0, 0, 0, 0.7)`,
            labelColor: () => '#111827',
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        <Text style={styles.tableTitle}>📋 Toutes les candidatures</Text>
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.tableHeader}>Nom</Text>
            <Text style={styles.tableHeader}>Email</Text>
            <Text style={styles.tableHeader}>Statut</Text>
            <Text style={styles.tableHeader}>Date</Text>
            <Text style={styles.tableHeader}>Action</Text>
          </View>

          {(showAll ? recentApplicants : recentApplicants.slice(0, 10)).map((app, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
              <Text style={styles.tableCell}>{app.name}</Text>
              <Text style={styles.tableCell}>{app.email}</Text>
              <Text style={[styles.tableCell, {
                color: app.status === 'accepted' ? '#10b981' :
                       app.status === 'pending' ? '#f59e0b' : '#ef4444'
              }]}>{app.status}</Text>
              <Text style={styles.tableCell}>{app.submittedAt?.toDate?.().toLocaleDateString('fr-FR') || '-'}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => router.push(`/admin/${app.id}`)}>
                  <Text style={[styles.actionBtn, { color: '#2563eb' }]}>Détails</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => updateStatus(app.id, 'accepted')}>
                  <Text style={[styles.actionBtn, { color: '#10b981' }]}>✔️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => updateStatus(app.id, 'rejected')}>
                  <Text style={[styles.actionBtn, { color: '#ef4444' }]}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={{ color: '#2563eb', fontWeight: 'bold', textAlign: 'center', marginVertical: 12 }}>
              {showAll ? 'Réduire' : 'Voir toutes les candidatures'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { padding: 20, paddingLeft: screenWidth > 700 ? 240 : 20 },
  title: { fontSize: 30, fontWeight: '700', color: '#1f2937', marginBottom: 24 },
  filters: {
    flexDirection: screenWidth > 700 ? 'row' : 'column',
    gap: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 8,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 14,
    width: screenWidth > 700 ? '47%' : '100%',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  kpiTitle: { fontSize: 17, color: '#6b7280', marginBottom: 4 },
  kpiValue: { fontSize: 30, fontWeight: 'bold', color: '#111827' },
  chartTitle: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginVertical: 24 },
  tableTitle: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginVertical: 20 },
  table: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tableRowHeader: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#e2e8f0',
  },
  tableHeader: { flex: 1, fontWeight: '700', color: '#1f2937', fontSize: 15 },
  tableRow: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRowAlt: { backgroundColor: '#ffffff' },
  tableCell: { flex: 1, color: '#374151', fontSize: 15 },
  actionBtn: { marginHorizontal: 6, fontWeight: 'bold', fontSize: 16 },
});
