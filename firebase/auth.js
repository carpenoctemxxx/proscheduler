import { db, auth } from './config.js';
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

let currentUser = null;

export async function loginWithPrivateKey(privateKey) {
  try {
    // In production, call your backend to generate token
    const token = await generateTokenFromPrivateKey(privateKey);
    const userCred = await signInWithCustomToken(auth, token);
    
    // Initialize user data if first login
    await initializeUserData(userCred.user.uid, privateKey);
    
    currentUser = userCred.user;
    setupRealtimeListeners(userCred.user.uid);
    return userCred;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

async function initializeUserData(userId, privateKey) {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    await setDoc(userRef, {
      privateKeyHash: await hashPrivateKey(privateKey),
      createdAt: new Date(),
      settings: {
        workDuration: 25,
        breakDuration: 5,
        dailyHours: 8
      }
    });
  }
}

function setupRealtimeListeners(userId) {
  // Tasks listener
  onSnapshot(doc(db, "users", userId, "data", "tasks"), (doc) => {
    if (doc.exists()) {
      updateTaskListUI(doc.data());
    }
  });

  // Timers listener
  onSnapshot(doc(db, "users", userId, "data", "timers"), (doc) => {
    if (doc.exists()) {
      updateTimersUI(doc.data());
    }
  });
}

// Helper functions
async function generateTokenFromPrivateKey(privateKey) {
  // In production, call your backend endpoint
  const response = await fetch('/api/generate-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ privateKey })
  });
  return (await response.json()).token;
}

async function hashPrivateKey(key) {
  // Use subtle crypto for browser hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
