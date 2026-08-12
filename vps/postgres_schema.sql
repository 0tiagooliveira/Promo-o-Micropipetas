-- ============================================================
-- BANCO DE DADOS POSTGRESQL - IONLAB PROMO & TRACKING DASHBOARD
-- ============================================================

-- Extensões para UUID e Busca Textual
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PRODUTOS & PREÇOS (PV NORMAL / PROMO)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    category_label VARCHAR(100) NOT NULL,
    price_normal NUMERIC(10, 2) NOT NULL,
    price_promo NUMERIC(10, 2) NOT NULL,
    discount_percent INT NOT NULL,
    volume_range VARCHAR(50) NOT NULL,
    autoclavable BOOLEAN DEFAULT TRUE,
    in_stock BOOLEAN DEFAULT TRUE,
    description_short TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE REGRAS DE ROTEAMENTO DE VENDEDORES POR DDD
CREATE TABLE IF NOT EXISTS seller_routing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_name VARCHAR(150) NOT NULL,
    seller_email VARCHAR(150) NOT NULL,
    ddds TEXT[] NOT NULL, -- Ex: ARRAY['11', '12', '13']
    region_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE COTAÇÕES (LEADS ENVIADOS VIA WHATSAPP)
CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(50) PRIMARY KEY, -- Ex: COT-8921
    buyer_name VARCHAR(150),
    buyer_phone VARCHAR(50) NOT NULL,
    buyer_email VARCHAR(150),
    buyer_city VARCHAR(100),
    buyer_state VARCHAR(10),
    ddd VARCHAR(5) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    assigned_seller_name VARCHAR(150) NOT NULL,
    assigned_seller_email VARCHAR(150) NOT NULL,
    is_test_mode BOOLEAN DEFAULT FALSE,
    utm_source VARCHAR(100),
    utm_campaign VARCHAR(100),
    device_type VARCHAR(20) DEFAULT 'Desktop',
    status VARCHAR(30) DEFAULT 'Pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ITENS DA COTAÇÃO
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id VARCHAR(50) REFERENCES quotes(id) ON DELETE CASCADE,
    sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- 5. TABELA DE EVENTOS DE TRACKING EM TEMPO REAL
CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL, -- 'visit', 'product_view', 'modal_open', 'whatsapp_click'
    sku VARCHAR(50),
    product_name VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(10),
    device VARCHAR(20),
    utm_source VARCHAR(100),
    utm_campaign VARCHAR(100),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES DE DESEMPENHO PARA CONSULTAS RÁPIDAS NO DASHBOARD
CREATE INDEX IF NOT EXISTS idx_tracking_event_type ON tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_sku ON tracking_events(sku);
CREATE INDEX IF NOT EXISTS idx_tracking_created_at ON tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_ddd ON quotes(ddd);

-- SEED INICIAL DE PRODUTOS
INSERT INTO products (sku, name, category, category_label, price_normal, price_promo, discount_percent, volume_range, description_short)
VALUES 
('ION-P002', 'Micropipeta Monocanal Volume Variável 0,2 - 2 µL Autoclavável Ionlab', 'monocanal-var', 'Monocanal Variável', 420.00, 289.00, 31, '0,2 - 2 µL', 'Precisão extrema para Biologia Molecular e PCR.'),
('ION-P010', 'Micropipeta Monocanal Volume Variável 1 - 10 µL Autoclavável Ionlab', 'monocanal-var', 'Monocanal Variável', 420.00, 289.00, 31, '1 - 10 µL', 'Ideal para micropipetagens analíticas.'),
('ION-P200', 'Micropipeta Monocanal Volume Variável 20 - 200 µL Autoclavável Ionlab', 'monocanal-var', 'Monocanal Variável', 420.00, 289.00, 31, '20 - 200 µL', 'Desenhada para pipetagem contínua.'),
('ION-P1000', 'Micropipeta Monocanal Volume Variável 100 - 1000 µL Autoclavável Ionlab', 'monocanal-var', 'Monocanal Variável', 450.00, 299.00, 34, '100 - 1000 µL', 'Essencial para amostragem de 1mL.'),
('ION-M8-300', 'Micropipeta Multicanal 8 Canais Volume 30 - 300 µL Ionlab Pro Autoclavável', 'multicanal', 'Multicanal 8 Canais', 1850.00, 1290.00, 30, '30 - 300 µL (8 canais)', 'Agilidade em placas de 96 poços.')
ON CONFLICT (sku) DO NOTHING;
