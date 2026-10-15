-- ==============================================================================
-- COMPU LEAGUE E-SPORTS 2026 - ESQUEMA DE BASE DE DATOS SUPABASE
-- Carrera de Computación
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE REGISTROS / INSCRIPCIONES
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    game VARCHAR(50) NOT NULL, -- 'valorant', 'free_fire', 'fortnite', 'clash_royale'
    game_name VARCHAR(100),
    modality VARCHAR(50) NOT NULL, -- '5v5', 'escuadras', 'solitario', 'duos', '1v1', 'individual'
    ff_modality VARCHAR(50), -- 'escuadras', 'solitario' para Free Fire
    team_name VARCHAR(100),
    is_free_agent BOOLEAN DEFAULT FALSE,
    captain_name VARCHAR(150) NOT NULL,
    captain_game_id VARCHAR(100) NOT NULL,
    captain_whatsapp VARCHAR(30) NOT NULL,
    captain_email VARCHAR(150),
    captain_discord VARCHAR(100),
    members JSONB DEFAULT '[]'::jsonb, -- Array de objetos: [{name, game_id, whatsapp, is_substitute}]
    amount_due NUMERIC(6, 2) NOT NULL DEFAULT 1.00,
    total_amount NUMERIC(6, 2) DEFAULT 1.00,
    receipt_url TEXT,
    receipt_image TEXT,
    payment_status VARCHAR(30) DEFAULT 'unpaid', -- 'unpaid', 'paid'
    status VARCHAR(30) DEFAULT 'pending', -- 'payment_pending', 'pending', 'approved', 'rejected'
    admin_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE PARTIDOS Y BRACKETS (VALORANT & CLASH ROYALE)
CREATE TABLE IF NOT EXISTS public.tournament_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game VARCHAR(50) NOT NULL,
    bracket_type VARCHAR(20) DEFAULT 'upper', -- 'upper', 'lower', 'grand_final', 'single'
    round_name VARCHAR(50) NOT NULL, -- 'Octavos', 'Cuartos', 'Semifinal', 'Final', etc.
    match_index INT NOT NULL,
    team_a_name VARCHAR(100),
    team_b_name VARCHAR(100),
    team_a_score INT DEFAULT 0,
    team_b_score INT DEFAULT 0,
    winner_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed'
    scheduled_time VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE RESULTADOS BATTLE ROYALE (FREE FIRE Y FORTNITE)
CREATE TABLE IF NOT EXISTS public.battle_royale_standings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game VARCHAR(50) NOT NULL, -- 'free_fire', 'fortnite'
    modality VARCHAR(50) NOT NULL, -- 'escuadras', 'solitario', 'duos'
    team_name VARCHAR(100) NOT NULL,
    captain_name VARCHAR(150),
    placement INT DEFAULT 0, -- 1 para el último en pie (ganador)
    kills INT DEFAULT 0,
    is_alive BOOLEAN DEFAULT TRUE,
    total_score INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);

-- 5. TABLA DE CRONOGRAMA DE PARTIDAS (4, 5 Y 6 DE NOVIEMBRE)
CREATE TABLE IF NOT EXISTS public.tournament_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_label VARCHAR(50) NOT NULL, -- 'Miércoles 4 de Noviembre', etc.
    time_label VARCHAR(30) NOT NULL, -- '19:00 - 21:00'
    game VARCHAR(50) NOT NULL,
    stage_title VARCHAR(150) NOT NULL,
    stream_url TEXT,
    room_code VARCHAR(100),
    display_order INT DEFAULT 0
);

-- 6. POLÍTICAS DE ACCESO PÚBLICO Y SEGURIDAD (ROW LEVEL SECURITY)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_royale_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_schedule ENABLE ROW LEVEL SECURITY;

-- REGISTRATIONS
DROP POLICY IF EXISTS "Permitir inscripcion publica" ON public.registrations;
CREATE POLICY "Permitir inscripcion publica" ON public.registrations
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura publica de registros" ON public.registrations;
CREATE POLICY "Permitir lectura publica de registros" ON public.registrations
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir actualizar comprobante por UUID" ON public.registrations;
CREATE POLICY "Permitir actualizar comprobante por UUID" ON public.registrations
    FOR UPDATE USING (true) WITH CHECK (true);

-- TOURNAMENT MATCHES
DROP POLICY IF EXISTS "Lectura publica de brackets" ON public.tournament_matches;
CREATE POLICY "Lectura publica de brackets" ON public.tournament_matches
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full matches" ON public.tournament_matches;
CREATE POLICY "Admin full matches" ON public.tournament_matches
    FOR ALL USING (true) WITH CHECK (true);

-- BATTLE ROYALE STANDINGS
DROP POLICY IF EXISTS "Lectura publica de standings BR" ON public.battle_royale_standings;
CREATE POLICY "Lectura publica de standings BR" ON public.battle_royale_standings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full standings" ON public.battle_royale_standings;
CREATE POLICY "Admin full standings" ON public.battle_royale_standings
    FOR ALL USING (true) WITH CHECK (true);

-- TOURNAMENT SCHEDULE
DROP POLICY IF EXISTS "Lectura publica de cronograma" ON public.tournament_schedule;
CREATE POLICY "Lectura publica de cronograma" ON public.tournament_schedule
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full schedule" ON public.tournament_schedule;
CREATE POLICY "Admin full schedule" ON public.tournament_schedule
    FOR ALL USING (true) WITH CHECK (true);

-- 7. STORAGE BUCKET PARA COMPROBANTES DE PAGO ('receipts')
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Permitir subida publica de comprobantes" ON storage.objects;
CREATE POLICY "Permitir subida publica de comprobantes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "Permitir lectura publica de comprobantes" ON storage.objects;
CREATE POLICY "Permitir lectura publica de comprobantes" ON storage.objects
    FOR SELECT USING (bucket_id = 'receipts');
