import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Replace with your Firebase config
// Get these values from your Firebase Console: Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_KEY",
  authDomain: "career-predictor.firebaseapp.com",
  databaseURL: "https://career-predictor-default-rtdb.firebaseio.com/",
  projectId: "career-predictor",
  storageBucket: "career-predictor.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_FIREBASE_KEY" && 
                              firebaseConfig.databaseURL !== "https://career-predictor-default-rtdb.firebaseio.com/";

let app, db;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase not configured. Feedback will not be saved. Please update firebase.js with your Firebase config.");
}

export function saveToFirebase(data) {
  if (!isFirebaseConfigured || !db) {
    return Promise.reject(new Error("Firebase is not configured. Please update firebase.js with your Firebase configuration."));
  }
  
  const timestamp = Date.now();
  const userKey = `user_${timestamp}`;
  return set(ref(db, `career_predictions/${userKey}`), data)
    .then(() => {
      console.log("Data saved successfully to Firebase");
      return { success: true };
    })
    .catch((error) => {
      console.error("Error saving data to Firebase:", error);
      throw error;
    });
}

export { db };

