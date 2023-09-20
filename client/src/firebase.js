
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC1HA_8Bt8UqlBmCt3TJn1BDdBBDSxklYE",
  authDomain: "video-b6bdb.firebaseapp.com",
  projectId: "video-b6bdb",
  storageBucket: "video-b6bdb.appspot.com",
  messagingSenderId: "800388385217",
  appId: "1:800388385217:web:b7aa3c1f0c7f76f4b9c740"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;