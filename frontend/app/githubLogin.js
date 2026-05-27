// app/githubLogin.js
import { GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

const githubButton = document.querySelector('#github-login');
if (githubButton) {
    githubButton.addEventListener('click', async e => {
        e.preventDefault();
        const provider = new GithubAuthProvider();
        try {
            const credentials = await signInWithPopup(auth, provider);
            const modalEl = document.querySelector('#singin-modal');
            if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
            console.log("Sesión iniciada con GitHub:", credentials.user.displayName);
        } catch (error) {
            console.error("Error en GitHub Login:", error.code);
            alert('No se pudo iniciar sesión con GitHub. Intenta de nuevo.');
        }
    });
}
