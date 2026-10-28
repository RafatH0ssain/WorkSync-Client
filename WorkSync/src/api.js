// Single source for the API origin and the shared admin token.
// The server is the authorization boundary. Nothing in this file grants
// access: it only routes requests and attaches the header the API requires
// on its protected routes.

const RAW_BASE =
    import.meta.env.VITE_API_BASE_URL || 'https://work-sync-server-eight.vercel.app';

// Strip trailing slashes so `${API_BASE}${path}` never produces a double slash.
export const API_BASE = RAW_BASE.replace(/\/+$/, '');

// Shared deployment secret the API expects in `x-admin-token`. This is not a
// user credential: the same value ships in every browser bundle, so it proves
// only that a call comes from the deployed client. Real authorization (who the
// caller is, which role they have) must be enforced by the server.
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || '';

// Mirrors the server's requireAdmin route list exactly. Open routes are
// absent on purpose so the header is never sent where the API does not expect
// it: the single-record reads (GET /users/:uid, /worksheet/:email,
// /payment-historya/:email, /employee-owed/:email, /check-pending-payment/:email,
// /check-user-status/:uid), the public signup (POST /users) and the public
// contact form (POST /submit-query).
const PROTECTED_ROUTES = [
    ['GET', /^\/users$/],
    ['GET', /^\/queries$/],
    ['POST', /^\/fire\/[^/]+$/],
    ['POST', /^\/make-hr\/[^/]+$/],
    ['POST', /^\/adjust-salary\/[^/]+$/],
    ['POST', /^\/toggle-verification\/[^/]+$/],
    ['GET', /^\/salary-history\/[^/]+$/],
    ['GET', /^\/worksheet$/],
    ['POST', /^\/worksheet$/],
    ['PUT', /^\/worksheet\/[^/]+$/],
    ['DELETE', /^\/worksheet\/[^/]+$/],
    ['GET', /^\/payment-history$/],
    ['POST', /^\/process-payment$/],
    ['PUT', /^\/approve-payment\/[^/]+$/],
];

export function needsAdminToken(method, path) {
    return PROTECTED_ROUTES.some(([m, re]) => m === method.toUpperCase() && re.test(path));
}

let warnedMissingToken = false;

// fetch() wrapper: resolves `path` against API_BASE and attaches x-admin-token
// only on the protected routes above. Returns the raw Response so callers keep
// their own response.ok handling.
export function apiFetch(path, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const headers = { ...options.headers };
    if (needsAdminToken(method, path)) {
        if (ADMIN_TOKEN) {
            headers['x-admin-token'] = ADMIN_TOKEN;
        } else if (!warnedMissingToken) {
            warnedMissingToken = true;
            console.warn(
                'VITE_ADMIN_TOKEN is not set; protected API calls will be rejected with 401. See .env.example.'
            );
        }
    }
    return fetch(`${API_BASE}${path}`, { ...options, headers });
}
