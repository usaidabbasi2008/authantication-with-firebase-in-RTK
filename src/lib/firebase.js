import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDz2wZRZJOb0xHkjK7729vAl--X5Zk8-58",
  authDomain: "aunthantication-with-rtk.firebaseapp.com",
  databaseURL: "https://aunthantication-with-rtk-default-rtdb.firebaseio.com",
  projectId: "aunthantication-with-rtk",
  storageBucket: "aunthantication-with-rtk.firebasestorage.app",
  messagingSenderId: "992896128861",
  appId: "1:992896128861:web:fe7e5565c6b85748c4fab4",
  measurementId: "G-ES5FS9BG5P",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// analytics sirf browser mein chalta hai
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  });
}