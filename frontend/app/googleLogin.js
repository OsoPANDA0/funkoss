// app/googleLogin.js
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

const googleButton = document.querySelector('#google-login');
if (googleButton) {
    googleButton.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const credentials = await signInWithPopup(auth, provider);
            const modalEl = document.querySelector('#singin-modal');
            if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
            console.log("Sesión iniciada con Google:", credentials.user.displayName);
        } catch (error) {
            console.error("Error en Google Login:", error.code);
            alert('No se pudo iniciar sesión con Google. Intenta de nuevo.');
        }
    });
}
