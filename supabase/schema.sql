-- =============================================================================
-- ApplyFlow — Fresh Install Schema
-- Safe to run alongside Mess Management System in the same Supabase project.
-- =============================================================================

-- Table: applyflow_templates
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

-- Index
CREATE INDEX IF NOT EXISTS idx_applyflow_templates_created_at
  ON applyflow_templates (created_at DESC);

-- updated_at automation
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

-- Row Level Security (backend uses service_role — bypasses RLS)
ALTER TABLE applyflow_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applyflow_templates_deny_anon" ON applyflow_templates;
CREATE POLICY "applyflow_templates_deny_anon"
  ON applyflow_templates FOR ALL TO anon
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "applyflow_templates_deny_authenticated" ON applyflow_templates;
CREATE POLICY "applyflow_templates_deny_authenticated"
  ON applyflow_templates FOR ALL TO authenticated
  USING (false) WITH CHECK (false);

-- =============================================================================
-- MANUAL: Create storage bucket in Supabase Dashboard
--   Name:   applyflow-resumes
--   Public: true
-- =============================================================================
