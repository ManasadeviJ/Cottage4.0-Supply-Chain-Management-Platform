// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";    // ✅ Add this
import { getStorage } from "firebase/storage";  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHf_T8FjhWe5GWLxOktSIHQ0bm6A1UX9Q",
  authDomain: "cottage-4-0.firebaseapp.com",
  projectId: "cottage-4-0",
  storageBucket: "cottage-4-0.firebasestorage.app",
  messagingSenderId: "316288167059",
  appId: "1:316288167059:web:886cec19dd9a2a3ae0b166",
  measurementId: "G-CN26J0QS8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Auth module
const auth = getAuth(app);
export const db = getFirestore(app);       // ✅ Firestore export
export const storage = getStorage(app); 

// ✅ Correct export
export { auth };