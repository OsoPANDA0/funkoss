// js/carrito.js
import { auth, db } from "../app/firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { onAuthStateChanged }  from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// URL del backend: en local usa localhost, en producción usa la URL de Render
// Configura VITE_API_URL (o equivalente) en Vercel si usas bundler,
// o simplemente reemplaza el valor por la URL de tu backend en Render.
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://funkoss-backend.onrender.com'; // ← reemplaza con tu URL de Render

const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalEl        = document.getElementById('cart-total');
const btnComprar         = document.getElementById('btn-comprar');
const statusMsg          = document.getElementById('status-message');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        await cargarCarritoFirestore(user.uid);
    } else {
        mostrarEstadoVacio();
    }
});

async function cargarCarritoFirestore(uid) {
    if (!cartItemsContainer) return;
    try {
        const carritoRef  = doc(db, "carritos", uid);
        const carritoSnap = await getDoc(carritoRef);

        if (!carritoSnap.exists() || carritoSnap.data().productos.length === 0) {
            mostrarEstadoVacio();
            return;
        }

        const productos = carritoSnap.data().productos;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        productos.forEach((item, i) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            cartItemsContainer.innerHTML += `
                <div class="cart-item" style="animation: fadeIn 0.3s ease forwards; animation-delay: ${i * 60}ms">
                    <div class="item-details">
                        <div class="item-image-placeholder">
                            <img src="${item.imagen_url || './img/funko-placeholder.png'}"
                                 alt="${item.nombre}" style="max-width:100%;max-height:100%;object-fit:contain;">
                        </div>
                        <div class="item-info">
                            <h3>${item.nombre}</h3>
                            <p class="text-muted small">Cantidad: <span class="badge bg-dark rounded-pill px-2">${item.cantidad}</span></p>
                        </div>
                    </div>
                    <div class="item-qty-price">$${subtotal.toFixed(2)} MXN</div>
                </div>
            `;
        });

        if (cartTotalEl) cartTotalEl.innerText = `$${total.toFixed(2)} MXN`;
        const subtotalEl = document.getElementById('cart-subtotal');
        if (subtotalEl) subtotalEl.innerText = `$${total.toFixed(2)}`;
        if (btnComprar)  btnComprar.disabled = false;

    } catch (error) {
        console.error("Error al recuperar el carrito:", error);
    }
}

function mostrarEstadoVacio() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="fs-1 text-muted mb-3"><i class="bi bi-bag-x"></i></div>
            <h4 class="fw-bold">Tu bolsa está vacía</h4>
            <p class="text-muted small mb-4">Inicia sesión o añade funkos a tu colección.</p>
            <a href="galeria.html" class="btn btn-dark rounded-pill px-4 py-2 text-uppercase small fw-bold text-decoration-none">
                <i class="bi bi-grid-3x3-gap-fill me-2"></i> Explorar galería
            </a>
        </div>
    `;
    if (cartTotalEl) cartTotalEl.innerText = '$0.00 MXN';
    if (btnComprar)  btnComprar.disabled = true;
}

if (btnComprar) {
    btnComprar.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Debes iniciar sesión para comprar.');
            return;
        }

        try {
            const carritoRef  = doc(db, "carritos", user.uid);
            const carritoSnap = await getDoc(carritoRef);
            if (!carritoSnap.exists()) return;

            const productos   = carritoSnap.data().productos;
            const totalCompra = productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

            btnComprar.disabled = true;
            statusMsg.style.display = 'block';
            statusMsg.className = "alert alert-info mt-3 small fw-medium d-flex align-items-center justify-content-center";
            statusMsg.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> 1/2: Registrando pedido...`;

            // 1) Crear pedido en Supabase (vía backend)
            const datosCompra = {
                usuario_id: user.uid,
                total: totalCompra,
                items: productos.map(p => ({
                    funko_id:        p.id,
                    cantidad:        p.cantidad,
                    precio_unitario: p.precio
                }))
            };

            const respuestaPedido = await fetch(`${API_URL}/api/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosCompra)
            });

            const resultadoPedido = await respuestaPedido.json();
            if (!respuestaPedido.ok) throw new Error(resultadoPedido.details || 'Error al crear pedido.');

            statusMsg.className = "alert alert-warning mt-3 small fw-medium d-flex align-items-center justify-content-center";
            statusMsg.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> 2/2: Conectando pasarela de pago...`;

            // 2) Crear sesión de Stripe Checkout (vía backend)
            const datosStripe = {
                pedido_id: resultadoPedido.pedido_id,
                items: productos.map(p => ({
                    nombre:          p.nombre,
                    precio_unitario: p.precio,
                    cantidad:        p.cantidad
                }))
            };

            const respuestaStripe = await fetch(`${API_URL}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosStripe)
            });

            const resultadoStripe = await respuestaStripe.json();

            if (resultadoStripe.url) {
                statusMsg.className = "alert alert-success mt-3 small fw-medium text-center";
                statusMsg.innerText = 'Redirigiendo a Stripe...';
                await setDoc(carritoRef, { productos: [] });
                window.location.href = resultadoStripe.url;
            } else {
                throw new Error('No se pudo generar la pasarela de pago.');
            }

        } catch (error) {
            console.error(error);
            statusMsg.className = "alert alert-danger mt-3 small fw-medium text-center";
            statusMsg.innerText = `Error: ${error.message}`;
            btnComprar.disabled = false;
        }
    });
}
