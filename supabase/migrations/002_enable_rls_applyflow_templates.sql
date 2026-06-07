-- =============================================================================
-- ApplyFlow RLS Migration
-- Enables Row Level Security on applyflow_templates.
--
-- Access model (verified from codebase):
--   • Express backend → SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
--   • React frontend  → Axios → Express API only (no direct Supabase access)
--   • No anon/authenticated client queries this table
--
-- Result: RLS blocks direct PostgREST access via anon/authenticated keys.
--         Backend continues to work unchanged via service role.
-- =============================================================================

ALTER TABLE applyflow_templates ENABLE ROW LEVEL SECURITY;

-- Explicit deny-all for client-facing roles (defense in depth).
-- Service role is NOT subject to RLS and is unaffected by these policies.

DROP POLICY IF EXISTS "applyflow_templates_deny_anon" ON applyflow_templates;
CREATE POLICY "applyflow_templates_deny_anon"
  ON applyflow_templates
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "applyflow_templates_deny_authenticated" ON applyflow_templates;
CREATE POLICY "applyflow_templates_deny_authenticated"
  ON applyflow_templates
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- =============================================================================
-- No service_role policy is needed — service role bypasses RLS automatically.
-- =============================================================================
