/**
 * API URL strategy:
 *   Local:      baseURL = ''           + path /api/templates  → /api/templates (Vite proxy)
 *   Production: baseURL = backend host + path /api/templates  → https://host/api/templates
 */
function getApiBaseUrl() {
  const url = import.meta.env.VITE_API_URL?.trim();

  // Local dev — paths are relative, Vite proxies /api → localhost:5000
  if (!url || url === '/api') {
    return '';
  }

  // Production — use backend host only; paths always include /api/...
  return url.replace(/\/+$/, '').replace(/\/api$/, '');
}

export const API_BASE_URL = getApiBaseUrl();

/** All paths include the /api prefix explicitly */
export const API_PATHS = {
  templates: '/api/templates',
  sendEmail: '/api/send-email',
  health: '/api/health',
};

export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
