import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const metaEnv = (import.meta as any).env || {};

// Check if all essential keys exist
const hasFirebaseConfig = !!(
  metaEnv.VITE_FIREBASE_API_KEY &&
  metaEnv.VITE_FIREBASE_PROJECT_ID &&
  metaEnv.VITE_FIREBASE_AUTH_DOMAIN
);

// Fallback dummy values to prevent Firebase SDK from crashing at startup when env variables are not set on hosting platforms like Render
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "dummy-api-key-placeholder-to-prevent-crash",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "dummy-project.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "dummy-project.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

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
