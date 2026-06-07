import { supabase } from '../config/supabase.js';
import { TABLES } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { uploadResume, deleteResume, extractPathFromUrl } from './storageService.js';

export async function getAllTemplates() {
  const { data, error } = await supabase
    .from(TABLES.TEMPLATES)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);
  return data;
}

export async function getTemplateById(id) {
  const { data, error } = await supabase
    .from(TABLES.TEMPLATES)
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new AppError('Template not found', 404);
  return data;
}

export async function createTemplate({ name, subject, body }, file) {
  if (!file) throw new AppError('Resume file is required', 400);

  const tempId = crypto.randomUUID();
  const { resumeUrl, resumePath, resumeName } = await uploadResume(file, tempId);

  const { data, error } = await supabase
    .from(TABLES.TEMPLATES)
    .insert({
      id: tempId,
      name,
      subject,
      body,
      resume_url: resumeUrl,
      resume_name: resumeName,
      resume_path: resumePath,
    })
    .select()
    .single();

  if (error) {
    await deleteResume(resumePath);
    throw new AppError(error.message, 500);
  }

  return data;
}

export async function updateTemplate(id, { name, subject, body }, file) {
  const existing = await getTemplateById(id);
  const updates = { updated_at: new Date().toISOString() };

  if (name !== undefined) updates.name = name;
  if (subject !== undefined) updates.subject = subject;
  if (body !== undefined) updates.body = body;

  if (file) {
    const oldPath = existing.resume_path || extractPathFromUrl(existing.resume_url)?.filePath;
    const { resumeUrl, resumePath, resumeName } = await uploadResume(file, id);
    updates.resume_url = resumeUrl;
    updates.resume_name = resumeName;
    updates.resume_path = resumePath;
    if (oldPath) await deleteResume(oldPath, extractPathFromUrl(existing.resume_url)?.bucket);
  }

  const { data, error } = await supabase
    .from(TABLES.TEMPLATES)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500);
  return data;
}

export async function deleteTemplate(id) {
  const existing = await getTemplateById(id);
  const parsed = extractPathFromUrl(existing.resume_url);
  const resumePath = existing.resume_path || parsed?.filePath;

  const { error } = await supabase.from(TABLES.TEMPLATES).delete().eq('id', id);
  if (error) throw new AppError(error.message, 500);

  if (resumePath) await deleteResume(resumePath, parsed?.bucket);
}
