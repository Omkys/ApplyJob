/**
 * Normalizes the API base URL so requests always hit /api/* routes.
 *
 * Examples:
 *   /api                                    → /api
 *   https://applyjob-ix89.onrender.com      → https://applyjob-ix89.onrender.com/api
 *   https://applyjob-ix89.onrender.com/api  → https://applyjob-ix89.onrender.com/api
 */
function normalizeApiBaseUrl(url) {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed || trimmed === '/api') return '/api';
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
}

const rawUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = rawUrl ? normalizeApiBaseUrl(rawUrl) : '/api';

/** Relative paths — combined with API_BASE_URL which already includes /api */
export const API_PATHS = {
  templates: '/templates',
  sendEmail: '/send-email',
  health: '/health',
};

export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
