// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeEkh5BBAzCjFmuGFBCOf57MratlTFMl0",
  authDomain: "ai-translate-webapp.firebaseapp.com",
  projectId: "ai-translate-webapp",
  storageBucket: "ai-translate-webapp.firebasestorage.app",
  messagingSenderId: "68147529393",
  appId: "1:68147529393:web:75335ff666b04498e9c490",
  measurementId: "G-5PHSDYZ712"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore
const db = getFirestore(app);
const auth = getAuth(app);

// Export the db instance
export { db, auth };
