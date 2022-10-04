// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-tdI-F6z_yd2WHrgOB8iHhmOyeScNA9Q",
  authDomain: "cryptorabic-app.firebaseapp.com",
  projectId: "cryptorabic-app",
  storageBucket: "cryptorabic-app.appspot.com",
  messagingSenderId: "566512872666",
  appId: "1:566512872666:web:166b6b60002de9470d09e3",
  measurementId: "G-3R90RR0HZ3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
