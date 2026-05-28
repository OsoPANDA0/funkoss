// js/agregar.js
// Maneja el botón "Agregar al carrito" en TODAS las páginas de categorías
// Lee el nombre, precio e imagen directamente del modal, sin necesitar data-* en el botón

import { auth, db } from "../app/firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Escucha cualquier clic en botones de agregar al carrito
document.addEventListener('click', async (e) => {
    // Soporta dos estilos de botón:
    // 1. Botones con clase btn-agregar-carrito y data-* (galeria.html)
    // 2. Botones dentro de modales sin data-* (disney, halloween, anime, marvel)
    const btn = e.target.closest('.btn-agregar-carrito, .modal .btn.btn-dark');
    if (!btn) return;

    // Verificar que el usuario esté logueado
    const user = auth.currentUser;
    if (!user) {
        alert('Debes iniciar sesión para agregar productos al carrito.');
        // Abrir modal de login
        const modalLogin = document.querySelector('#singin-modal');
        if (modalLogin) {
            const modal = new bootstrap.Modal(modalLogin);
            modal.show();
        }
        return;
    }

    // Obtener datos del producto
    let nombre, precio, imagen, id;

    // Caso 1: botón con data-* attributes (galeria.html)
    if (btn.dataset.nombre) {
        nombre = btn.dataset.nombre;
        precio = parseFloat(btn.dataset.precio);
        imagen = btn.dataset.imagen;
        id     = btn.dataset.id;
    } else {
        // Caso 2: botón dentro de un modal, leer del contenido del modal
        const modal = btn.closest('.modal');
        if (!modal) return;

        const tituloEl  = modal.querySelector('.modal-title');
        const precioEl  = modal.querySelector('h3');
        const imagenEl  = modal.querySelector('img');

        if (!tituloEl || !precioEl) return;

        nombre = tituloEl.innerText.trim();
        // El precio está como "MEX $379.00" o "$379.00" — extraemos el número
        precio = parseFloat(precioEl.innerText.replace(/[^0-9.]/g, ''));
        imagen = imagenEl ? imagenEl.getAttribute('src') : '';
        id     = modal.id; // usamos el id del modal como identificador único
    }

    if (!nombre || isNaN(precio)) return;

    // Feedback visual al botón
    const textoOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Agregando...';

    try {
        const carritoRef  = doc(db, "carritos", user.uid);
        const carritoSnap = await getDoc(carritoRef);
        const productos   = carritoSnap.exists() ? carritoSnap.data().productos : [];

        // Si ya existe el producto, aumentar cantidad
        const idx = productos.findIndex(p => p.id === id);
        if (idx >= 0) {
            productos[idx].cantidad += 1;
        } else {
            productos.push({ id, nombre, precio, imagen_url: imagen, cantidad: 1 });
        }

        await setDoc(carritoRef, { productos });

        // Feedback de éxito
        btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>¡Agregado!';
        btn.classList.remove('btn-dark');
        btn.classList.add('btn-success');

        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-dark');
            btn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
        alert('No se pudo agregar al carrito. Intenta de nuevo.');
    }
});
