// app/logout.js
import { signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

const logoutBtn = document.querySelector('#logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('Sesión cerrada correctamente.');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    });
}
