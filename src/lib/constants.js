// Local dev:  VITE_API_URL=/api          (proxied to localhost:5000 by Vite)
// Production: VITE_API_URL=https://applyjob-ix89.onrender.com/api
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
