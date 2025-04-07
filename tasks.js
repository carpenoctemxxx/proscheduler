import { db } from './firebase/config.js';
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";

export async function saveTask(userId, task) {
  const taskRef = doc(db, "users", userId, "data", "tasks", task.id);
  await setDoc(taskRef, {
    ...task,
    lastUpdated: serverTimestamp()
  }, { merge: true });
}

export async function deleteTask(userId, taskId) {
  await deleteDoc(doc(db, "users", userId, "data", "tasks", taskId));
}

export function getTasksCollectionRef(userId) {
  return collection(db, "users", userId, "data", "tasks");
}
