// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{ getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7U4QRsrMlchmxhndxgdskQBye6zoWu5s",
  authDomain: "speakwell-d0a11.firebaseapp.com",
  projectId: "speakwell-d0a11",
  storageBucket: "speakwell-d0a11.firebasestorage.app",
  messagingSenderId: "704072269489",
  appId: "1:704072269489:web:cd4fce652561674e096c90",
  measurementId: "G-BQZJZMCN19"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
