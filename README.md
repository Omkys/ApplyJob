# ApplyFlow

Full-stack job application automation tool. Save reusable email templates with resumes in Supabase, then send applications via your own Gmail SMTP.

Designed to coexist with other apps (e.g. Mess Management System) in the same Supabase project using namespaced resources.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Vite, Tailwind, React Router, React Hook Form, Zod, Axios |
| Backend | Node.js, Express |
| Database | Supabase Postgres |
| Storage | Supabase Storage |
| Email | Nodemailer (Gmail SMTP) |

## ApplyFlow Namespace

| Resource | Old Name | New Name |
|----------|----------|----------|
| Table | `templates` | `applyflow_templates` |
| Storage | `resumes` | `applyflow-resumes` |

## Project Structure

```
applyflow/
├── src/                                        # Frontend
├── backend/src/                                # Backend API
└── supabase/
    ├── schema.sql                              # Fresh install
    └── migrations/001_applyflow_namespace.sql  # Migrate existing data
```

## Local Setup

### 1. Supabase (shared project)

**New ApplyFlow install:**
```bash
# Run in Supabase SQL Editor
supabase/schema.sql
```

**Existing ApplyFlow data to migrate:**
```bash
# Run in Supabase SQL Editor
supabase/migrations/001_applyflow_namespace.sql
```

**Dashboard steps:**
1. Storage → Create bucket `applyflow-resumes` (Public: **true**)
2. If migrating: copy all files from `resumes` → `applyflow-resumes` (same paths)
3. Copy **Project URL** + **service_role key** (Settings → API)

### 2. Environment Variables

**`backend/.env`:**

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
STORAGE_BUCKET=applyflow-resumes
```

**`.env`** (frontend):

```env
VITE_API_URL=/api
```

### 3. Run

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

## Security (RLS)

ApplyFlow accesses Supabase **only through the Express backend** using `SUPABASE_SERVICE_ROLE_KEY`. The React frontend never connects to Supabase directly.

`applyflow_templates` has RLS enabled with deny-all policies for `anon` and `authenticated` roles. The service role bypasses RLS, so the app continues to work normally.

Run `supabase/migrations/002_enable_rls_applyflow_templates.sql` if upgrading an existing project.

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/templates` | List all templates |
| POST | `/api/templates` | Create template |
| PUT | `/api/templates/:id` | Update template |
| DELETE | `/api/templates/:id` | Delete template |
| POST | `/api/send-email` | Send email with resume |

## Deploy to Render

**Backend** — Web Service, root `backend`, start `npm start`

**Frontend** — Static Site, build `npm run build`, publish `dist`

Set `VITE_API_URL=https://your-backend.onrender.com/api` on frontend.

Set `STORAGE_BUCKET=applyflow-resumes` on backend.
