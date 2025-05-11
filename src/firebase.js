// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Optional: import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClqO0xgUOtbtCiVj7SXXuAr_SVaV0Jsw0",
  authDomain: "sproutsy-3a939.firebaseapp.com",
  projectId: "sproutsy-3a939",
  storageBucket: "sproutsy-3a939.appspot.com", // <-- fix here
  messagingSenderId: "94178720013",
  appId: "1:94178720013:web:bab5e4d1c50ecc4abbd844",
  measurementId: "G-WHL2QLTMSK"
};

const app = initializeApp(firebaseConfig);

// Optional analytics (you can skip if not using it)
/// const analytics = getAnalytics(app);

// ✅ These are required for auth + image uploads
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);