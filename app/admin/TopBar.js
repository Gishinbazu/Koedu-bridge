import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { db } from '../../services/firebase';

export default function TopBar({ title = 'KOEDU Bridge Admin' }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), where('read', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.icon}>🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#003366',
    alignItems: 'center',
  },
  left: {
    position: 'relative',
    marginRight: 10,
  },
  icon: {
    fontSize: 22,
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
