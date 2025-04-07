import { db } from './firebase/config.js';
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

let pomodoroInterval;
let dailyTimerInterval;

export function startPomodoro(userId) {
  clearInterval(pomodoroInterval);
  
  const timerRef = doc(db, "users", userId, "data", "timers");
  
  pomodoroInterval = setInterval(async () => {
    const timerSnap = await getDoc(timerRef);
    if (!timerSnap.exists()) return;
    
    const { pomodoroMode, pomodoroTimeLeft, workDuration, breakDuration } = timerSnap.data();
    
    if (pomodoroTimeLeft <= 0) {
      const newMode = pomodoroMode === 'work' ? 'break' : 'work';
      const newDuration = (newMode === 'work' ? workDuration : breakDuration) * 60;
      
      await updateDoc(timerRef, {
        pomodoroMode: newMode,
        pomodoroTimeLeft: newDuration,
        lastUpdated: serverTimestamp()
      });
      return;
    }
    
    await updateDoc(timerRef, {
      pomodoroTimeLeft: pomodoroTimeLeft - 1,
      lastUpdated: serverTimestamp()
    });
  }, 1000);
}

export function startDailyTimer(userId) {
  clearInterval(dailyTimerInterval);
  
  const timerRef = doc(db, "users", userId, "data", "timers");
  
  dailyTimerInterval = setInterval(async () => {
    const timerSnap = await getDoc(timerRef);
    if (!timerSnap.exists()) return;
    
    const { dailyTimeLeft } = timerSnap.data();
    
    if (dailyTimeLeft <= 0) {
      clearInterval(dailyTimerInterval);
      return;
    }
    
    await updateDoc(timerRef, {
      dailyTimeLeft: dailyTimeLeft - 1,
      lastUpdated: serverTimestamp()
    });
  }, 1000);
}
