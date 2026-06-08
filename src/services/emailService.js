import api from './api';
import { API_PATHS } from '../lib/constants';

export async function sendEmail({ recipientEmail, subject, body, resumeUrl, resumeName }) {
  const { data } = await api.post(API_PATHS.sendEmail, {
    recipientEmail,
    subject,
    body,
    resumeUrl,
    resumeName,
  });
  return data;
}
