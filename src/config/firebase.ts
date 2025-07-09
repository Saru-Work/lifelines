// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJufzDx6uksCIwZZ1t9PlimO3kdzZ0Aj8",
  authDomain: "life-lines-48ce1.firebaseapp.com",
  projectId: "life-lines-48ce1",
  storageBucket: "life-lines-48ce1.firebasestorage.app",
  messagingSenderId: "348162954204",
  appId: "1:348162954204:web:36f0dbfab2c183bf24f519",
  measurementId: "G-JY46947F99",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
