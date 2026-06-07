export function buildTemplateFormData({ name, subject, body, resume }) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('subject', subject);
  formData.append('body', body);
  if (resume) formData.append('resume', resume);
  return formData;
}

export function validateResumeFile(file) {
  if (!file) return 'Resume is required';
  if (file.type !== 'application/pdf') return 'Only PDF files are allowed';
  if (file.size > 5 * 1024 * 1024) return 'Resume must be under 5MB';
  return null;
}
