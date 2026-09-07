import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase is now used ONLY for Authentication. All content (Firestore) and
// media (Storage) moved to MariaDB + /public/image. Auth will move to its own
// system later; until then this stays.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBzkHbuf8vVmkI9ZGXV31VJmGvKqY4Q6FY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "krsbrno.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "krsbrno",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "681469037767",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:681469037767:web:16573d418720b3f52d42e2",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
