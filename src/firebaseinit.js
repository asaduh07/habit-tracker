// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAspJN7cqB7vORPuU-a_0rS7cXAsMSVdR4",
  authDomain: "habit-tracker-89fa6.firebaseapp.com",
  projectId: "habit-tracker-89fa6",
  storageBucket: "habit-tracker-89fa6.appspot.com",
  messagingSenderId: "738491037524",
  appId: "1:738491037524:web:65c2c0f2f43520b88f3ac1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
 