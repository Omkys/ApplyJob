import api from './api';

export async function sendEmail({ recipientEmail, subject, body, resumeUrl, resumeName }) {
  const { data } = await api.post('/send-email', {
    recipientEmail,
    subject,
    body,
    resumeUrl,
    resumeName,
  });
  return data;
}
