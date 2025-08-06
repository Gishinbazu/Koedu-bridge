// 🚀 Script temporaire pour créer un compte admin dans Firebase
// ✅ À exécuter UNE FOIS depuis une page sécurisée ou en local
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

// Fonction de création de compte admin
export const promoteToAdmin = async (email, password) => {
  try {
    // Étape 1 : Créer le compte dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Étape 2 : Ajouter le rôle 'admin' dans Firestore
    await setDoc(doc(db, 'users', uid), {
      role: 'admin',
      email,
      createdAt: new Date(),
    });

    console.log(`✅ Compte admin créé pour ${email}`);
  } catch (error) {
    console.error('❌ Erreur lors de la promotion :', error.message);
  }
};

// Exemple d’appel à exécuter une fois
// promoteToAdmin('admin@koedu.com', 'MotDePasseUltraSecurise123');
