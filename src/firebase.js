// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0_AohnquvEAX3vbiOcM5ggoJEaaq2rzA",
  authDomain: "react-aa99c.firebaseapp.com",
  projectId: "react-aa99c",
  storageBucket: "react-aa99c.appspot.com",
  messagingSenderId: "538230715598",
  appId: "1:538230715598:web:31e6f57b45e48dc8bb8c9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
