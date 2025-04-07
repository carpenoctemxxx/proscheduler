import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBMXhznm_6NTbNM7OyB1NLmPWYkyORdixI",
  authDomain: "timeblockx.firebaseapp.com",
  projectId: "timeblockx",
  storageBucket: "timeblockx.firebasestorage.app",
  messagingSenderId: "969558636093",
  appId: "1:969558636093:web:5d83ef135cbe7cbcca5c54",
  measurementId: "G-J317R7NGXE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Only initialize analytics in the browser (client-side)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };
