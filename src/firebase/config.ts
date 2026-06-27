import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: metaEnv.VITE_FIREBASE_APP_ID,
};

// Check if all essential keys exist
const hasFirebaseConfig = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain
);

if (!hasFirebaseConfig) {
  console.warn(
    "Firebase configuration environment variables are missing! Authentication will operate in standalone simulation mode if keys are unavailable."
  );
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const dbId = metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID;
const db = getFirestore(app, dbId && dbId !== "(default)" ? dbId : undefined);
const auth = getAuth(app);

export { app, auth, db, hasFirebaseConfig };
