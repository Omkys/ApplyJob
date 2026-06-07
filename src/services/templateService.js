import api from './api';

export async function fetchTemplates() {
  const { data } = await api.get('/templates');
  return data.data;
}

export async function createTemplate(formData) {
  const { data } = await api.post('/templates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateTemplate(id, formData) {
  const { data } = await api.put(`/templates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteTemplate(id) {
  await api.delete(`/templates/${id}`);
}
