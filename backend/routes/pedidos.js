// backend/routes/pedidos.js
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

/**
 * POST /api/pedidos
 * Body: { usuario_id, total, items: [{ funko_id, cantidad, precio_unitario }] }
 * Crea un pedido en Supabase y devuelve su ID.
 */
router.post('/', async (req, res) => {
    const { usuario_id, total, items } = req.body;

    if (!usuario_id || !total || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Datos del pedido incompletos.' });
    }

    try {
        // 1) Insertar el pedido principal
        const { data: pedido, error: errorPedido } = await supabase
            .from('pedidos')
            .insert({ usuario_id, total, estado: 'pendiente' })
            .select()
            .single();

        if (errorPedido) throw errorPedido;

        // 2) Insertar los items del pedido
        const itemsConId = items.map(item => ({
            pedido_id:       pedido.id,
            funko_id:        item.funko_id,
            cantidad:        item.cantidad,
            precio_unitario: item.precio_unitario
        }));

        const { error: errorItems } = await supabase
            .from('pedido_items')
            .insert(itemsConId);

        if (errorItems) throw errorItems;

        res.status(201).json({ pedido_id: pedido.id });

    } catch (error) {
        console.error('Error al crear pedido:', error.message);
        res.status(500).json({ error: 'No se pudo crear el pedido.', details: error.message });
    }
});

export default router;
