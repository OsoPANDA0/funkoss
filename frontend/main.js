// main.js — punto de entrada principal (cargado como módulo en todos los .html)
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth }              from "./app/firebase.js";
import { loginCheck }        from "./app/loginCheck.js";

import "./app/singupForm.js";
import "./app/singinform.js";
import "./app/logout.js";
import "./app/googleLogin.js";
import "./app/facebookLogin.js";
import "./app/githubLogin.js";
import "./js/efectos.js";
import "./js/agregar.js";

// Cargamos carrito.js solo en la página del carrito
if (window.location.pathname.includes("carrito.html")) {
    import("./js/carrito.js");
}

onAuthStateChanged(auth, (user) => {
    loginCheck(user);
});
