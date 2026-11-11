// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjd-WZWqSgV4wpmfjTa7R1UE2QoTWma5M",
  authDomain: "remote-tech-jobs-8ed4c.firebaseapp.com",
  projectId: "remote-tech-jobs-8ed4c",
  storageBucket: "remote-tech-jobs-8ed4c.firebasestorage.app",
  messagingSenderId: "559133657605",
  appId: "1:559133657605:web:bbf36ffc8b3639d4f92a6c",
  measurementId: "G-E451JP26YY"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();