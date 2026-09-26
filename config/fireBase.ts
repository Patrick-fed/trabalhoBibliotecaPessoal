import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBmw6Szs_2XgE2-IjWJIHfxFFgMD3he1c",
  authDomain: "trabalhofinal-24ebd.firebaseapp.com",
  projectId: "trabalhofinal-24ebd",
  storageBucket: "trabalhofinal-24ebd.firebasestorage.app",
  messagingSenderId: "1092213937201",
  appId: "1:1092213937201:web:848344e6f2b988a30f7110"
};

const app = initializeApp(firebaseConfig);

// Exporte a auth e o banco de dados (db) para usar no resto do app
export const auth = getAuth(app);
export const db = getFirestore(app);