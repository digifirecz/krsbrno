import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBzkHbuf8vVmkI9ZGXV31VJmGvKqY4Q6FY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "krsbrno.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "krsbrno",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "krsbrno.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "681469037767",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:681469037767:web:16573d418720b3f52d42e2",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-7WRQ23LXK1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
// ignoreUndefinedProperties lets block editors leave optional fields empty
// (React state uses `undefined` for "not set") without setDoc() rejecting the write.
// initializeFirestore throws if called twice on the same app (e.g. dev hot-reload),
// so fall back to the already-configured instance in that case.
// "krsbrno" is a named Firestore database in europe-west3 (Frankfurt) — created to replace
// the original "(default)" database, which was provisioned in a US multi-region and added
// unnecessary latency for this Central European audience.
const FIRESTORE_DATABASE_ID = 'krsbrno';
let db: Firestore;
try {
  db = initializeFirestore(app, { ignoreUndefinedProperties: true }, FIRESTORE_DATABASE_ID);
} catch {
  db = getFirestore(app, FIRESTORE_DATABASE_ID);
}
const storage = getStorage(app);

export { app, auth, db, storage };
