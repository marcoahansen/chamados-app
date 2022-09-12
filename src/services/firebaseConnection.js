import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDmYC03Rv32LVIOoOZNmXXpSudsKc9SEsM",
  authDomain: "chamados-3c90b.firebaseapp.com",
  projectId: "chamados-3c90b",
  storageBucket: "chamados-3c90b.appspot.com",
  messagingSenderId: "884577288919",
  appId: "1:884577288919:web:da083be8f9eaddadb6a692",
  measurementId: "G-3GN2N0DSMN"
};

const firebase = initializeApp(firebaseConfig);

export default firebase;