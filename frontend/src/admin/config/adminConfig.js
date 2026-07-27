/**
 * adminConfig.js
 *
 * Per the frozen backend contract: admin API calls target
 * `${VITE_API_URL}/admin/...`. VITE_API_URL is expected to be a full
 * backend origin (e.g. https://home-backend-sjuu.onrender.com/api),
 * distinct from the user app's relative '/api' base in
 * utils/constants.js — the admin backend contract explicitly requires
 * this env var. Falls back to '/api' only if the env var is unset, so
 * local dev without a .env entry doesn't hard-crash (though it likely
 * won't reach a real backend either).
 *
 * ACTION NEEDED: confirm VITE_API_URL is set in your .env file. Not
 * created here — this file only reads it, never assumes or fabricates
 * a value.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || '/api';

export const ADMIN_API_BASE = `${RAW_API_URL.replace(/\/$/, '')}/admin`;