import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKdcqPvtZiMLjQXLDwVydCkv7GpoPKmNI",
  authDomain: "pankajnew1-3aa10.firebaseapp.com",
  databaseURL: "https://pankajnew1-3aa10-default-rtdb.firebaseio.com",
  projectId: "pankajnew1-3aa10",
  storageBucket: "pankajnew1-3aa10.firebasestorage.app",
  messagingSenderId: "788643844128",
  appId: "1:788643844128:web:e3638d65067f5194bbec45",
  measurementId: "G-BLVVPWZ926"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const firestore = getDatabase(app);

// export { firestore };
// export { database, firebase };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // Initialize Firebase Authentication

export { database, auth, firebaseConfig };
