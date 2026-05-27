// app/facebookLogin.js
import { FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

const facebookButton = document.querySelector('#facebook-login');
if (facebookButton) {
    facebookButton.addEventListener('click', async e => {
        e.preventDefault();
        const provider = new FacebookAuthProvider();
        try {
            const credentials = await signInWithPopup(auth, provider);
            const modalEl = document.querySelector('#singin-modal');
            if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
            console.log("Sesión iniciada con Facebook:", credentials.user.displayName);
        } catch (error) {
            console.error("Error en Facebook Login:", error.code);
            alert('No se pudo iniciar sesión con Facebook. Intenta de nuevo.');
        }
    });
}
