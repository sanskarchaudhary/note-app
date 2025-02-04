import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtpgWb8i5-56hMJ7u48m1T4cduYi6lwiI",
  authDomain: "whatsapp-chat-app-id-67e4f.firebaseapp.com",
  projectId: "whatsapp-chat-app-id-67e4f",
  storageBucket: "whatsapp-chat-app-id-67e4f.firebasestorage.app",
  messagingSenderId: "1097618710390",
  appId: "1:1097618710390:web:6893b88fc008bcaaff6457",
  measurementId: "G-W63GS1JDT1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
