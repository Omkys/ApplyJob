/**
 * ApplyFlow Supabase namespace constants.
 * Isolated from other apps (e.g. Mess Management System) in the same project.
 */
export const TABLES = {
  TEMPLATES: 'applyflow_templates',
};

export const STORAGE_BUCKETS = {
  RESUMES: 'applyflow-resumes',
  /** Legacy bucket — used when reading pre-migration resume URLs */
  RESUMES_LEGACY: 'resumes',
};
