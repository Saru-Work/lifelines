import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCn9ZG1nMqE_sI7K6hNiXp_5F_Z0rjFSgA",
  authDomain: "ritehere-493fe.firebaseapp.com",
  projectId: "ritehere-493fe",
  storageBucket: "ritehere-493fe.firebasestorage.app",
  messagingSenderId: "792327450172",
  appId: "1:792327450172:web:ba88f1d360833f47cf1d39",
  measurementId: "G-K1BP93J2WB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
