import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import * as Papa from 'papaparse';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import WorldMap from '../../components/WorldMap';
import { auth, db } from '../../services/firebase';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreenTabs() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});
  const [statusCounts, setStatusCounts] = useState({ accepted: 0, rejected: 0, pending: 0 });
  const [activeTab, setActiveTab] = useState('stats');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await getDocs(collection(db, 'users'));
      const me = snap.docs.find((d) => d.id === user.uid);
      if (me?.data()?.role !== 'manager') return;
      fetchApplications();
    });
    return unsubscribe;
  }, []);

  const fetchApplications = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'applications'));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplications(list);
      computeStats(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (list) => {
    const monthly = {};
    const statuses = { accepted: 0, rejected: 0, pending: 0 };

    list.forEach((app) => {
      const date = app.createdAt?.toDate?.();
      if (!date) return;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (!monthly[year]) monthly[year] = {};
      if (!monthly[year][month]) monthly[year][month] = 0;
      monthly[year][month]++;

      if (app.status === 'accepté') statuses.accepted++;
      else if (app.status === 'rejeté') statuses.rejected++;
      else statuses.pending++;
    });

    setMonthlyStats(monthly);
    setStatusCounts(statuses);
  };

  const exportExcel = async () => {
    const csv = Papa.unparse(applications);
    const fileUri = FileSystem.documentDirectory + 'koedu_stats.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(fileUri);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 12, color: '#333' }}>Chargement des statistiques...</Text>
      </View>
    );
  }

  const availableYears = Object.keys(monthlyStats).sort().reverse();

  const renderTabContent = () => (
    <Animated.View
      key={activeTab}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.tabContent}
    >
      {activeTab === 'stats' && (
        <View>
          <Text style={styles.title}>📊 Statistiques Manager</Text>
          <View style={styles.cardContainer}>
            <StatCard label="👥 Étudiants inscrits" value={applications.length} color="#2196f3" />
            <StatCard label="✅ Acceptés" value={statusCounts.accepted} color="#4caf50" />
            <StatCard label="❌ Rejetés" value={statusCounts.rejected} color="#f44336" />
            <StatCard label="🕒 En attente" value={statusCounts.pending} color="#ff9800" />
          </View>
          <TouchableOpacity style={styles.exportBtn} onPress={exportExcel}>
            <Text style={styles.exportText}>📥 Exporter Excel</Text>
          </TouchableOpacity>
        </View>
      )}
      {activeTab === 'charts' && (
        <View>
          <Text style={styles.sectionTitle}>📅 Sélectionner l'année</Text>
          <View style={styles.filterBox}>
            {availableYears.map((year) => (
              <TouchableOpacity
                key={year}
                style={[styles.yearBtn, selectedYear == year && styles.yearBtnActive]}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={[styles.yearText, selectedYear == year && styles.yearTextActive]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionTitle}>📈 Répartition</Text>
          <PieChart
            data={[
              { name: 'Acceptés', population: statusCounts.accepted, color: '#4caf50', legendFontColor: '#333', legendFontSize: 14 },
              { name: 'Rejetés', population: statusCounts.rejected, color: '#f44336', legendFontColor: '#333', legendFontSize: 14 },
              { name: 'En attente', population: statusCounts.pending, color: '#ff9800', legendFontColor: '#333', legendFontSize: 14 },
            ]}
            width={screenWidth - 40}
            height={240}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>📊 Tendances mensuelles</Text>
          <BarChart
            data={{
              labels: Object.keys(monthlyStats[selectedYear] || {}),
              datasets: [{ data: Object.values(monthlyStats[selectedYear] || {}) }],
            }}
            width={screenWidth - 40}
            height={260}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={{ borderRadius: 12 }}
          />
        </View>
      )}
      {activeTab === 'map' && (
        <View>
          <Text style={styles.sectionTitle}>🌍 Origine des candidatures</Text>
          <View style={{ height: 320 }}>
            <WorldMap />
          </View>
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.fixedHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AntDesign name="arrowleft" size={22} color="#007AFF" />
          <Text style={{ color: '#007AFF', fontSize: 16, marginLeft: 5 }}>Retour</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.tabBar}>
          <TabButton title="🧮 Stats" active={activeTab === 'stats'} onPress={() => setActiveTab('stats')} />
          <TabButton title="📊 Graphiques" active={activeTab === 'charts'} onPress={() => setActiveTab('charts')} />
          <TabButton title="🌍 Carte" active={activeTab === 'map'} onPress={() => setActiveTab('map')} />
        </View>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{title}</Text>
  </TouchableOpacity>
);

const StatCard = ({ label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
  labelColor: () => '#555',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafc',
    paddingHorizontal: 20,
  },
  fixedHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginVertical: 24,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    elevation: 2,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#0066cc',
  },
  tabText: {
    fontWeight: '600',
    color: '#555',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabContent: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  exportBtn: {
    marginTop: 20,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  exportText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafc',
  },
  filterBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  yearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  yearBtnActive: {
    backgroundColor: '#0066cc',
  },
  yearText: {
    fontSize: 14,
    color: '#333',
  },
  yearTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
