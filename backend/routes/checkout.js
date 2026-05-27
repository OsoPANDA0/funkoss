// backend/routes/checkout.js
import { Router } from 'express';
import Stripe      from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

/**
 * POST /api/checkout
 * Body: { pedido_id, items: [{ nombre, precio_unitario, cantidad }] }
 * Crea una sesión de Stripe Checkout y devuelve la URL de pago.
 */
router.post('/', async (req, res) => {
    const { pedido_id, items } = req.body;

    if (!pedido_id || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Datos de checkout incompletos.' });
    }

    try {
        const lineItems = items.map(item => ({
            price_data: {
                currency:     'mxn',
                product_data: { name: item.nombre },
                // Stripe maneja centavos: $250.00 MXN → 25000
                unit_amount:  Math.round(item.precio_unitario * 100)
            },
            quantity: item.cantidad
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items:           lineItems,
            mode:                 'payment',
            // Redirige al frontend después del pago
            // FRONTEND_URL debe estar en tu .env (p.ej. https://funkoss.vercel.app)
            success_url: `${process.env.FRONTEND_URL}/index.html?pago=exitoso&pedido=${pedido_id}`,
            cancel_url:  `${process.env.FRONTEND_URL}/carrito.html?pago=cancelado`,
            metadata:    { pedido_id: String(pedido_id) }
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error('Error al crear sesión de Stripe:', error.message);
        res.status(500).json({ error: 'No se pudo iniciar el pago.', details: error.message });
    }
});

export default router;
