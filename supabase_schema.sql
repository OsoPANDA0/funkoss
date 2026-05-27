-- supabase_schema.sql
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase

-- Tabla de funkos (productos)
CREATE TABLE IF NOT EXISTS funkos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      TEXT NOT NULL,
    precio      NUMERIC(10,2) NOT NULL,
    imagen_url  TEXT,
    categoria   TEXT,
    stock       INTEGER DEFAULT 0,
    creado_en   TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  TEXT NOT NULL,        -- UID de Firebase
    total       NUMERIC(10,2) NOT NULL,
    estado      TEXT DEFAULT 'pendiente', -- pendiente | pagado | cancelado
    creado_en   TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de items por pedido
CREATE TABLE IF NOT EXISTS pedido_items (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id        UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    funko_id         TEXT NOT NULL,   -- ID del funko (puede ser texto si no tienes tabla funkos aún)
    cantidad         INTEGER NOT NULL,
    precio_unitario  NUMERIC(10,2) NOT NULL
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario   ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_items_pedido      ON pedido_items(pedido_id);
