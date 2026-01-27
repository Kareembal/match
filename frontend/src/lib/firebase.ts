import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, update, query, orderByChild, limitToLast, DataSnapshot } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCYuiEVSDyIpsfu3XyhO9rNIh0rmU_aB_U",
  authDomain: "whispr-9f6f2.firebaseapp.com",
  databaseURL: "https://whispr-9f6f2-default-rtdb.firebaseio.com",
  projectId: "whispr-9f6f2",
  storageBucket: "whispr-9f6f2.firebasestorage.app",
  messagingSenderId: "896571821663",
  appId: "1:896571821663:web:357762cfdb0b7df93795ea",
  measurementId: "G-Q670T9YT5R"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export { ref, push, onValue, update, query, orderByChild, limitToLast };
export type { DataSnapshot };
