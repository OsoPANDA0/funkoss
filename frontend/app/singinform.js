// app/singinform.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

const signinForm = document.querySelector('#login-form');
if (!signinForm) throw new Error("No se encontró #login-form en esta página.");

signinForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = signinForm['login-email'].value.trim();
    const password = signinForm['login-password'].value;

    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const modalEl = document.querySelector('#singin-modal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
        console.log("Sesión iniciada:", credentials.user.email);
    } catch (error) {
        console.error("Error al iniciar sesión:", error.code);
        const msgs = {
            'auth/user-not-found':  'No existe una cuenta con ese correo.',
            'auth/wrong-password':  'Contraseña incorrecta.',
            'auth/invalid-email':   'Correo no válido.',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.'
        };
        alert(msgs[error.code] || 'Error al iniciar sesión. Intenta de nuevo.');
    }
});
