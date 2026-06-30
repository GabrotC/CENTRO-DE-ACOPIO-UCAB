// ============================================================
// CONFIG.JS — Configuración centralizada del Centro de Acopio
// ============================================================

const CONFIG = {
    SUPABASE_URL: "https://sjvpcgjazubguzoxzwxl.supabase.co",
    SUPABASE_KEY: "sb_publishable_dR9ot8lbyJHZTxupgdeJRg_WmqYWFk8",
    APP_NAME: "Centro de Acopio SOS UCAB",
    VERSION: "2.0"
};

// --- Helper: Headers para fetch a Supabase ---
function supabaseHeaders(extra = {}) {
    return {
        "apikey": CONFIG.SUPABASE_KEY,
        "Authorization": `Bearer ${CONFIG.SUPABASE_KEY}`,
        ...extra
    };
}

function supabasePostHeaders() {
    return supabaseHeaders({
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    });
}

// --- Helper: Fetch simplificado ---
async function supabaseGet(table, query = '') {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${table}?${query}`, {
        headers: supabaseHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status} al leer ${table}`);
    return res.json();
}

async function supabaseInsert(table, data) {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${table}`, {
        method: "POST",
        headers: supabasePostHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Error ${res.status} al insertar en ${table}`);
    return res;
}

async function supabaseDelete(table, filters) {
    const params = Object.entries(filters).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${table}?${params}`, {
        method: "DELETE",
        headers: supabaseHeaders()
    });
    if (!res.ok) throw new Error(`Error ${res.status} al eliminar de ${table}`);
    return res;
}

// --- Helper: Crear cliente Supabase Realtime ---
function crearClienteSupabase() {
    if (!window.supabase) return null;
    return window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
}

// --- Tema oscuro global ---
function initTheme(toggleBtnId = 'themeToggle') {
    const btn = document.getElementById(toggleBtnId);
    if (!btn) return;
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        btn.innerText = '☀️';
    }
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        btn.innerText = isDark ? '☀️' : '🌙';
    });
}

// --- Verificación de acceso por rol ---
function verificarAcceso(rolRequerido) {
    const rolActual = sessionStorage.getItem('userRole');
    if (rolActual !== rolRequerido) {
        alert('Acceso restringido. Redirigiendo al inicio.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// --- Fecha de hoy en formato YYYY-MM-DD ---
function fechaHoy() {
    return new Date().toISOString().split('T')[0];
}

function horaActual() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
