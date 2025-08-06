// departure.js – structure de base pour KOEDU BRIDGE

import { ScrollView } from 'react-native';
import DepartureChecklist from '../../components/DepartureChecklist';

export default function DepartureScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <DepartureChecklist />
    </ScrollView>
  );
}
