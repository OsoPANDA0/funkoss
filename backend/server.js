// backend/server.js
import 'dotenv/config';
import express from 'express';
import cors    from 'cors';

import pedidosRouter  from './routes/pedidos.js';
import checkoutRouter from './routes/checkout.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS: permite peticiones desde tu dominio de Vercel ──────────────────────
const allowedOrigins = [
    'http://localhost:5500',          // Live Server local
    'http://127.0.0.1:5500',
    process.env.FRONTEND_URL          // p.ej. https://funkoss.vercel.app
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Permite Postman / curl sin origin
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS bloqueado para el origen: ${origin}`));
    }
}));

app.use(express.json());

// ── Health-check (Render lo usa para detectar que el servicio está vivo) ─────
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'Funkoss API' }));

// ── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api/pedidos',  pedidosRouter);
app.use('/api/checkout', checkoutRouter);

// ── Manejo de errores global ──────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('Error no controlado:', err.message);
    res.status(500).json({ error: err.message });
});

app.listen(PORT, () => console.log(`✅  Servidor escuchando en el puerto ${PORT}`));
