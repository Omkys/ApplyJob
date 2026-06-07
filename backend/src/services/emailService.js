import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { downloadResume } from './storageService.js';

function createTransporter() {
  if (!env.smtp.user || !env.smtp.pass) {
    throw new AppError('SMTP credentials not configured', 500);
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export async function sendApplicationEmail({
  recipientEmail,
  subject,
  body,
  resumeUrl,
  resumeName,
}) {
  const transporter = createTransporter();
  const { buffer, fileName } = await downloadResume(resumeUrl, resumeName);

  const info = await transporter.sendMail({
    from: env.smtp.from,
    to: recipientEmail,
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
    attachments: [
      {
        filename: fileName,
        content: buffer,
        contentType: 'application/pdf',
      },
    ],
  });

  return {
    success: true,
    message: `Email sent to ${recipientEmail}`,
    messageId: info.messageId,
  };
}
