// arrival.js – structure de base pour KOEDU BRIDGE

import { ScrollView } from 'react-native';
import ArrivalGuide from '../../components/ArrivalGuide';

export default function ArrivalScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <ArrivalGuide />
    </ScrollView>
  );
}
