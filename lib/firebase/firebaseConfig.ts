import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// copy your app config from the firebase
const firebaseConfig = {
  apiKey: "AIzaSyAdHmUQ5kOWgoI1_5A2vxIm2L6AZBESMiE",
  authDomain: "test-e836d.firebaseapp.com",
  projectId: "test-e836d",
  storageBucket: "test-e836d.appspot.com",
  messagingSenderId: "936666167102",
  appId: "1:936666167102:web:228198986c177e5ade5e6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
