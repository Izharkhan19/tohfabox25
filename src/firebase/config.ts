import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-project.firebaseapp.com",
//   // ... other config from Firebase console
// };
const firebaseConfig = {
  apiKey: "AIzaSyDdep9N0yVeAW6eBtxkfeyTR87Ciiyvifk",
  authDomain: "tohfabox25-3358f.firebaseapp.com",
  projectId: "tohfabox25-3358f",
  storageBucket: "tohfabox25-3358f.firebasestorage.app",
  messagingSenderId: "847216842173",
  appId: "1:847216842173:web:9d644c76e1235ca654eed4",
  measurementId: "G-M2FLN559D6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);