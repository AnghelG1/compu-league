# 🎮 COMPU LEAGUE E-SPORTS 2026
### Plataforma Web Oficial - Carrera de Computación

Plataforma integral para promoción, registro inteligente con validación de pagos bancarios y publicación de brackets/resultados en tiempo real del torneo universitario **Compu League E-Sports 2026**.

---

## 🚀 Características Principales

1. **Identidad Visual Oficial:**
   - Mascota oficial del **Búho Gamer** extraída con fondo transparente de alta fidelidad.
   - Logo oficial circular de la **Carrera de Computación**.
   - Tema gamer cyberpunk con circuitos oscuros, luces cian neón y acentos dorados.

2. **Hero & Cuenta Regresiva:**
   - Temporizador en vivo con cuenta regresiva hacia el **1 de Noviembre de 2026** (Cierre de inscripciones).
   - Botones de acción rápida: *"¡Inscribirme ($1 USD)!"*, *"Ver Brackets en Vivo"*, *"Discord"*.

3. **Las 4 Disciplinas & Promociones:**
   - **Valorant:** 5v5 (5 titulares + 1 suplente opcional por el mismo valor de \$5). Formato Doble Eliminación con Upper y Loser Bracket.
   - **Free Fire:** Super Promo 2x1 ($1 USD por persona con acceso a Escuadras y Solitario). Modo Battle Royale última escuadra/jugador sobreviviente.
   - **Fortnite:** Dúos ($2 USD por equipo). Batalla campal de supervivencia en pareja.
   - **Clash Royale:** Torneo 1v1 ($1 USD). Duelos Bo3.

4. **Sistema Inteligente de Inscripciones:**
   - Selector dinámico de equipo o **Agente Libre**.
   - Formulario adaptable: solicita campos de compañeros según la modalidad (Nombre, ID de juego y WhatsApp de cada uno).
   - **Caja bancaria destacada de Banco Pichincha:**
     - Cuenta de Ahorros: `2206402368`
     - Titular: Cristopher Lomas
     - Botón de 1 clic para copiar número de cuenta y correo.
   - Subida de captura de transferencia bancaria con previsualización en tiempo real.
   - Animación de confeti y feedback de recepción.

5. **Brackets & Resultados en Tiempo Real:**
   - **Valorant:** Visualizador interactivo de **Upper Bracket**, **Loser Bracket (Repechaje)** y **Gran Final Bo3**.
   - **Clash Royale:** Llave de torneo con Cuartos, Semifinales y Gran Final.
   - **Free Fire & Fortnite:** Tablas en vivo estilo Battle Royale con puestos, bajas (kills) y estatus de último sobreviviente.

6. **Panel de Administración Staff (Clave: `compu2026`):**
   - **Revisión de Pagos:** Visor con zoom de comprobantes bancarios para verificar depósitos. Botones de 1 clic para Aprobar o Rechazar.
   - **Super Botón WhatsApp:** Copia todos los números de teléfono de los inscritos aprobados para armar grupos de WhatsApp sin esfuerzo.
   - **Módulo de Agentes Libres:** Listado para emparejar jugadores sin escuadra.
   - **Gestor de Marcadores en Vivo:** Modifica puntos y ganadores sin tocar código.
   - **Conector Supabase:** Permite enlazar tu base de datos en la nube pegando tus claves directamente en la interfaz.

---

## 🛠️ Cómo Ejecutar Localmente

```bash
# Entrar a la carpeta del proyecto
cd compu-league-web

# Instalar dependencias (ya instaladas)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:5173/`.

---

## ☁️ Conexión con Supabase (Paso a Paso)

1. Ingresa a [supabase.com](https://supabase.com) y crea un proyecto gratuito.
2. Ve al apartado **SQL Editor**, abre una nueva consulta y pega todo el contenido de [`src/supabase_schema.sql`](src/supabase_schema.sql). Haz clic en **Run**.
3. En Supabase ve a **Project Settings > API** y copia tu:
   - `Project URL`
   - `anon public key`
4. Puedes ingresarlas directamente en el **Panel de Administración Staff** de la web (pestaña *Conexión Supabase*) o colocarlas en un archivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

---

## 🌐 Publicar en Internet con Dominio Propio

Para publicarla con Vercel o Netlify de forma gratuita:
1. Sube este repositorio a GitHub.
2. Conecta tu repositorio en [Vercel](https://vercel.com) o [Netlify](https://netlify.com).
3. En la configuración de dominio de Vercel/Netlify, agrega tu dominio personalizado (por ejemplo `compuleague2026.com` o el que compres).
