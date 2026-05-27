// app/singupForm.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

const singupForm = document.querySelector('#singup-form');
if (!singupForm) throw new Error("No se encontró #singup-form en esta página.");

singupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = singupForm['signup-email'].value.trim();
    const password = singupForm['signup-password'].value;

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const modalEl = document.querySelector('#signup-modal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
        console.log("Usuario registrado:", userCredentials.user.email);
    } catch (error) {
        console.error("Error al registrarse:", error.code);
        const msgs = {
            'auth/email-already-in-use': 'Ese correo ya está registrado.',
            'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
            'auth/invalid-email':        'Correo no válido.'
        };
        alert(msgs[error.code] || 'Algo salió mal. Intenta de nuevo.');
    }
});
