import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeY51wxzGoGOUw6UZFU6NPE4jtvZzgJqs",
  authDomain: "moodify-2f839.firebaseapp.com",
  projectId: "moodify-2f839",
  storageBucket: "moodify-2f839.firebasestorage.app",
  messagingSenderId: "1059974782195",
  appId: "1:1059974782195:web:a001f96ecf586140b36b86",
  measurementId: "G-MMJTNKW19M",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};