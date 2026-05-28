// js/agregar-carrito.js
// Maneja los botones "Agregar al carrito" en todas las páginas de productos
// Guarda el carrito en Firestore bajo la colección "carritos/{uid}"

import { auth, db } from "../app/firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/**
 * Agrega o incrementa un producto en el carrito del usuario en Firestore.
 * Si el usuario no está logueado, abre el modal de inicio de sesión.
 */
async function agregarAlCarrito(btn) {
  const user = auth.currentUser;

  if (!user) {
    // Abrir modal de login si no hay sesión
    const modal = document.getElementById("singin-modal");
    if (modal && window.bootstrap) {
      new bootstrap.Modal(modal).show();
    } else {
      alert("Inicia sesión para agregar productos al carrito.");
    }
    return;
  }

  const id      = btn.dataset.id;
  const nombre  = btn.dataset.nombre;
  const precio  = parseFloat(btn.dataset.precio);
  const imagen  = btn.dataset.imagen || "";

  if (!id || !nombre || isNaN(precio)) {
    console.error("Botón sin datos completos:", btn.dataset);
    return;
  }

  // Estado visual mientras se procesa
  const textoOriginal = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Agregando...`;

  try {
    const carritoRef  = doc(db, "carritos", user.uid);
    const carritoSnap = await getDoc(carritoRef);

    let productos = carritoSnap.exists() ? (carritoSnap.data().productos || []) : [];

    // ¿Ya existe el producto? → incrementar cantidad
    const idx = productos.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      productos[idx].cantidad += 1;
    } else {
      productos.push({ id, nombre, precio, imagen_url: imagen, cantidad: 1 });
    }

    await setDoc(carritoRef, { productos });

    // Feedback visual de éxito
    btn.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ¡Agregado!`;
    btn.classList.remove("btn-dark");
    btn.classList.add("btn-success");

    // Actualizar el contador del ícono del carrito en el navbar
    actualizarContadorCarrito(productos);

    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.classList.remove("btn-success");
      btn.classList.add("btn-dark");
      btn.disabled = false;
    }, 1800);

  } catch (err) {
    console.error("Error al agregar al carrito:", err);
    btn.innerHTML = `<i class="bi bi-x-circle me-2"></i> Error`;
    btn.classList.add("btn-danger");
    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.classList.remove("btn-danger");
      btn.classList.add("btn-dark");
      btn.disabled = false;
    }, 2000);
  }
}

/**
 * Muestra un badge con la cantidad total de items en el ícono del carrito del navbar.
 */
function actualizarContadorCarrito(productos) {
  const totalItems = productos.reduce((sum, p) => sum + p.cantidad, 0);
  let badge = document.getElementById("cart-badge");

  const carritoLink = document.querySelector('a[href="carrito.html"] .bi-cart3');
  if (!carritoLink) return;

  const contenedor = carritoLink.closest("a");
  if (!badge) {
    badge = document.createElement("span");
    badge.id = "cart-badge";
    badge.className = "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";
    badge.style.fontSize = "0.6rem";
    contenedor.style.position = "relative";
    contenedor.appendChild(badge);
  }

  if (totalItems > 0) {
    badge.textContent = totalItems > 99 ? "99+" : totalItems;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

/**
 * Carga el conteo actual del carrito al entrar a la página.
 */
async function cargarContadorInicial(uid) {
  try {
    const snap = await getDoc(doc(db, "carritos", uid));
    if (snap.exists()) {
      actualizarContadorCarrito(snap.data().productos || []);
    }
  } catch (e) {
    // silencioso — no crítico
  }
}

// ── Inicialización ────────────────────────────────────────────────────────────

// Escuchar cambios de sesión para cargar el contador
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
onAuthStateChanged(auth, (user) => {
  if (user) cargarContadorInicial(user.uid);
});

// Delegar el evento click en todos los botones .btn-agregar-carrito
// (funciona aunque los botones estén dentro de modales de Bootstrap)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-agregar-carrito");
  if (btn) {
    e.preventDefault();
    agregarAlCarrito(btn);
  }
});
