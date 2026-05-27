// app/firebase.js
// Las claves reales se leen desde el archivo .env (NO subas .env a GitHub)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
// Configura las mismas variables en Vercel → Settings → Environment Variables
const firebaseConfig = {
  apiKey: "AIzaSyDS905O9aUaqIxF_LYi7lZosxKRLH4PJQg",
  authDomain: "k026-ad7ed.firebaseapp.com",
  projectId: "k026-ad7ed",
  storageBucket: "k026-ad7ed.firebasestorage.app",
  messagingSenderId: "7511837794",
  appId: "1:7511837794:web:e7c3431b3d9efdcded153b"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
