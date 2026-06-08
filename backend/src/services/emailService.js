import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { logInfo, logError } from '../utils/logger.js';
import { downloadResume } from './storageService.js';

const STEPS = {
  CREATE_TRANSPORTER: 'create_transporter',
  VERIFY_SMTP: 'verify_smtp',
  SUPABASE_DOWNLOAD: 'supabase_download',
  SEND_EMAIL: 'send_email',
};

function createTransporter() {
  if (!env.smtp.user || !env.smtp.pass) {
    throw new AppError(
      'SMTP credentials not configured. Set SMTP_USER and SMTP_PASS.',
      500,
      STEPS.CREATE_TRANSPORTER
    );
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

export async function verifySmtpConnection() {
  let transporter;

  try {
    logInfo(STEPS.CREATE_TRANSPORTER, 'Creating Nodemailer transporter', {
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      user: env.smtp.user,
    });
    transporter = createTransporter();
  } catch (err) {
    logError(STEPS.CREATE_TRANSPORTER, 'Failed to create transporter', err);
    throw err instanceof AppError
      ? err
      : new AppError(err.message, 500, STEPS.CREATE_TRANSPORTER, err.message);
  }

  try {
    logInfo(STEPS.VERIFY_SMTP, 'Verifying SMTP connection...');
    await transporter.verify();
    logInfo(STEPS.VERIFY_SMTP, 'SMTP verification successful');
    return { success: true, message: 'SMTP connection verified successfully' };
  } catch (err) {
    logError(STEPS.VERIFY_SMTP, 'SMTP verification failed', err);
    throw new AppError(
      `SMTP verification failed: ${err.message}`,
      500,
      STEPS.VERIFY_SMTP,
      err.message
    );
  }
}

export async function sendApplicationEmail({
  recipientEmail,
  subject,
  body,
  resumeUrl,
  resumeName,
}) {
  let transporter;
  let attachment;

  // Step 4–5: Supabase download
  try {
    logInfo(STEPS.SUPABASE_DOWNLOAD, 'Starting Supabase resume download', {
      resumeUrl,
      resumeName: resumeName || '(not provided)',
    });
    attachment = await downloadResume(resumeUrl, resumeName);
    logInfo(STEPS.SUPABASE_DOWNLOAD, 'Supabase download completed', {
      fileName: attachment.fileName,
      sizeBytes: attachment.buffer.length,
    });
  } catch (err) {
    logError(STEPS.SUPABASE_DOWNLOAD, 'Supabase download failed', err);
    throw err instanceof AppError
      ? err
      : new AppError(
          `Resume download failed: ${err.message}`,
          500,
          STEPS.SUPABASE_DOWNLOAD,
          err.message
        );
  }

  // Step 6: Create transporter
  try {
    logInfo(STEPS.CREATE_TRANSPORTER, 'Creating Nodemailer transporter', {
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      user: env.smtp.user,
    });
    transporter = createTransporter();
  } catch (err) {
    logError(STEPS.CREATE_TRANSPORTER, 'Failed to create transporter', err);
    throw err instanceof AppError
      ? err
      : new AppError(err.message, 500, STEPS.CREATE_TRANSPORTER, err.message);
  }

  // Step 7–8: Verify SMTP
  try {
    logInfo(STEPS.VERIFY_SMTP, 'Verifying SMTP connection before send...');
    await transporter.verify();
    logInfo(STEPS.VERIFY_SMTP, 'SMTP verification successful');
  } catch (err) {
    logError(STEPS.VERIFY_SMTP, 'SMTP verification failed', err);
    throw new AppError(
      `SMTP verification failed: ${err.message}`,
      500,
      STEPS.VERIFY_SMTP,
      err.message
    );
  }

  // Step 9–10: Send email
  try {
    logInfo(STEPS.SEND_EMAIL, 'Sending email', {
      from: env.smtp.from,
      to: recipientEmail,
      subject,
      attachment: attachment.fileName,
    });

    const info = await transporter.sendMail({
      from: env.smtp.from,
      to: recipientEmail,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
      attachments: [
        {
          filename: attachment.fileName,
          content: attachment.buffer,
          contentType: 'application/pdf',
        },
      ],
    });

    logInfo(STEPS.SEND_EMAIL, 'Email sent successfully', {
      messageId: info.messageId,
      to: recipientEmail,
    });

    return {
      success: true,
      message: `Email sent to ${recipientEmail}`,
      messageId: info.messageId,
    };
  } catch (err) {
    logError(STEPS.SEND_EMAIL, 'Failed to send email', err);
    throw new AppError(
      `Failed to send email: ${err.message}`,
      500,
      STEPS.SEND_EMAIL,
      err.message
    );
  }
}
