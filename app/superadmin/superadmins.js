import { StyleSheet, View } from 'react-native';
import OnlySuperAdmin from '../../components/OnlySuperAdmin';
import SuperadminList from '../../components/SuperadminList';

export default function SuperadminsPage() {
  return (
    <OnlySuperAdmin>
      <View style={styles.container}>
        <SuperadminList />
      </View>
    </OnlySuperAdmin>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
