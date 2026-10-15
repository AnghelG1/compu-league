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
    modality VARCHAR(50) NOT NULL, -- '5v5', 'escuadras', 'solitario', 'duos', '1v1', 'agente_libre'
    team_name VARCHAR(100),
    is_free_agent BOOLEAN DEFAULT FALSE,
    captain_name VARCHAR(150) NOT NULL,
    captain_game_id VARCHAR(100) NOT NULL,
    captain_whatsapp VARCHAR(30) NOT NULL,
    captain_email VARCHAR(150),
    captain_discord VARCHAR(100),
    members JSONB DEFAULT '[]'::jsonb, -- Array de objetos: [{name, game_id, whatsapp, is_substitute}]
    amount_due NUMERIC(6, 2) NOT NULL DEFAULT 1.00,
    receipt_url TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    admin_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE
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

-- Permitir a cualquier visitante insertar inscripciones
CREATE POLICY "Permitir inscripcion publica" ON public.registrations
    FOR INSERT WITH CHECK (true);

-- Permitir lectura publica de registros aprobados (solo nombre y equipo, sin datos privados)
CREATE POLICY "Lectura publica de brackets" ON public.tournament_matches
    FOR SELECT USING (true);

CREATE POLICY "Lectura publica de standings BR" ON public.battle_royale_standings
    FOR SELECT USING (true);

CREATE POLICY "Lectura publica de cronograma" ON public.tournament_schedule
    FOR SELECT USING (true);

-- 7. CREACIÓN DEL BUCKET DE ALMACENAMIENTO PARA COMPROBANTES BANCARIOS
-- (Ejecutar en la sección de Storage de Supabase creando el bucket público 'receipts')
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true);
