import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const sendUserNotification = async (userId, message) => {
  await addDoc(collection(db, 'notifications'), {
    userId,
    message,
    timestamp: new Date(),
    read: false,
  });
};
