import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARcWOOcR7vwgMpVQVjq_viTRjxEmng6MI",
  authDomain: "meetfrends-b25e9.firebaseapp.com",
  projectId: "meetfrends-b25e9",
  storageBucket: "meetfrends-b25e9.appspot.com",
  messagingSenderId: "164639052318",
  appId: "1:164639052318:web:2be1983f1abf861b8c540f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);