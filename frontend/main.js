// main.js — punto de entrada principal (cargado como módulo en todos los .html)
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { auth }              from "./app/firebase.js";
import { loginCheck }        from "./app/loginCheck.js";

import "./app/singupForm.js";
import "./app/singinform.js";
import "./app/logout.js";
import "./app/googleLogin.js";
import "./app/facebookLogin.js";
import "./js/efectos.js";

// Cargamos carrito.js solo en la página del carrito
if (window.location.pathname.includes("carrito.html")) {
    import("./js/carrito.js");
}

// Cargamos el módulo de agregar al carrito en páginas con productos
const paginasConProductos = ["galeria.html", "disney.html", "halloween.html", "Anime.html", "anime.html", "marvel.html", "index.html"];
const pathActual = window.location.pathname;
const esProductos = paginasConProductos.some(p => pathActual.includes(p)) || pathActual === "/" || pathActual.endsWith("/");

if (esProductos) {
    import("./js/agregar-carrito.js");
}

onAuthStateChanged(auth, (user) => {
    loginCheck(user);
});
