import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFLvkZAEmCihm-la7fB2iT15x7Xt_x5CU",
  authDomain: "delekat-d14d8.firebaseapp.com",
  databaseURL: "https://delekat-d14d8-default-rtdb.firebaseio.com",
  projectId: "delekat-d14d8",
  storageBucket: "delekat-d14d8.firebasestorage.app",
  messagingSenderId: "426686699390",
  appId: "1:426686699390:web:b74b1c7008cea6ea3dc52f",
  measurementId: "G-0VTX5CTTV4"
};

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth();