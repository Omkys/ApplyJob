import dotenv from 'dotenv';

dotenv.config();

const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
];

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(`[env] Missing variables: ${missing.join(', ')}`);
    console.warn('[env] Copy backend/.env.example to backend/.env and fill in values.');
  }
}

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'https://applyjob-for-omkii.onrender.com',
];

export const env = {
  port: Number(process.env.PORT) || 5000,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  storageBucket: process.env.STORAGE_BUCKET || 'applyflow-resumes',
  maxFileSize: 5 * 1024 * 1024,
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [
        ...DEFAULT_CORS_ORIGINS,
        ...(process.env.FRONTEND_URL &&
        !DEFAULT_CORS_ORIGINS.includes(process.env.FRONTEND_URL)
          ? [process.env.FRONTEND_URL]
          : []),
      ],
};
