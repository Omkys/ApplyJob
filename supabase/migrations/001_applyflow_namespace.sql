-- =============================================================================
-- ApplyFlow Namespace Migration
-- Migrates: templates → applyflow_templates (if old table exists)
-- Safe to re-run (idempotent). Works on fresh projects with no templates table.
-- =============================================================================

-- 1. Create namespaced table
CREATE TABLE IF NOT EXISTS applyflow_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  body        TEXT NOT NULL,
  resume_url  TEXT NOT NULL,
  resume_name TEXT,
  resume_path TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Copy data from old table only if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'templates'
  ) THEN
    INSERT INTO applyflow_templates (
      id, name, subject, body, resume_url, resume_name, resume_path, created_at, updated_at
    )
    SELECT
      id, name, subject, body, resume_url, resume_name, resume_path, created_at, updated_at
    FROM templates
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Copied data from templates → applyflow_templates';
  ELSE
    RAISE NOTICE 'No templates table found — skipping data copy (fresh install)';
  END IF;
END $$;

-- 3. Index
CREATE INDEX IF NOT EXISTS idx_applyflow_templates_created_at
  ON applyflow_templates (created_at DESC);

-- 4. updated_at trigger
CREATE OR REPLACE FUNCTION applyflow_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS applyflow_templates_updated_at ON applyflow_templates;
CREATE TRIGGER applyflow_templates_updated_at
  BEFORE UPDATE ON applyflow_templates
  FOR EACH ROW EXECUTE FUNCTION applyflow_update_updated_at();

-- 5. Update resume URLs (only if any rows reference the old bucket)
UPDATE applyflow_templates
SET resume_url = REPLACE(resume_url, '/object/public/resumes/', '/object/public/applyflow-resumes/')
WHERE resume_url LIKE '%/object/public/resumes/%';

-- =============================================================================
-- MANUAL STEPS (Supabase Dashboard):
-- 1. Storage → Create bucket "applyflow-resumes" (Public: true)
-- 2. If migrating storage: copy files from "resumes" → "applyflow-resumes"
-- 3. Set STORAGE_BUCKET=applyflow-resumes in backend/.env
-- =============================================================================
