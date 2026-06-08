import api from './api';
import { API_PATHS } from '../lib/constants';

export async function fetchTemplates() {
  const { data } = await api.get(API_PATHS.templates);
  return data.data;
}

export async function createTemplate(formData) {
  const { data } = await api.post(API_PATHS.templates, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateTemplate(id, formData) {
  const { data } = await api.put(`${API_PATHS.templates}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteTemplate(id) {
  await api.delete(`${API_PATHS.templates}/${id}`);
}
