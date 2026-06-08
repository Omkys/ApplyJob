import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { logInfo, logError } from '../utils/logger.js';
import { sendEmailSchema } from '../validators/emailValidator.js';
import * as emailService from '../services/emailService.js';

const STEPS = {
  REQUEST_RECEIVED: 'request_received',
  VALIDATION: 'validation',
  TEMPLATE_LOADED: 'template_loaded',
  RESUME_URL: 'resume_url',
};

export const sendEmail = asyncHandler(async (req, res) => {
  try {
    logInfo(STEPS.REQUEST_RECEIVED, 'POST /api/send-email — request received', {
      body: {
        recipientEmail: req.body?.recipientEmail,
        subject: req.body?.subject,
        resumeUrl: req.body?.resumeUrl,
        resumeName: req.body?.resumeName,
        bodyLength: req.body?.body?.length ?? 0,
      },
    });
  } catch (err) {
    logError(STEPS.REQUEST_RECEIVED, 'Failed to log request', err);
  }

  let parsed;
  try {
    parsed = sendEmailSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.errors[0].message;
      logError(STEPS.VALIDATION, `Validation failed: ${message}`);
      throw new AppError(message, 400, STEPS.VALIDATION, parsed.error.errors);
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    logError(STEPS.VALIDATION, 'Validation error', err);
    throw new AppError(err.message, 400, STEPS.VALIDATION, err.message);
  }

  const { recipientEmail, subject, body, resumeUrl, resumeName } = parsed.data;

  try {
    logInfo(STEPS.TEMPLATE_LOADED, 'Template data loaded', {
      recipientEmail,
      subject,
      resumeName: resumeName || '(not provided)',
      bodyLength: body.length,
    });
  } catch (err) {
    logError(STEPS.TEMPLATE_LOADED, 'Failed to log template data', err);
  }

  try {
    logInfo(STEPS.RESUME_URL, 'Resume URL received', { resumeUrl });
  } catch (err) {
    logError(STEPS.RESUME_URL, 'Failed to log resume URL', err);
  }

  try {
    const result = await emailService.sendApplicationEmail(parsed.data);
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) throw err;
    logError('send_email_controller', 'Unexpected error in send flow', err);
    throw new AppError(err.message, 500, 'send_email', err.message);
  }
});

export const smtpTest = asyncHandler(async (_req, res) => {
  try {
    logInfo('smtp_test', 'GET /api/smtp-test — starting SMTP test');
    const result = await emailService.verifySmtpConnection();
    res.json({
      ...result,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    logError('smtp_test', 'SMTP test failed', err);
    throw new AppError(
      `SMTP test failed: ${err.message}`,
      500,
      'smtp_test',
      err.message
    );
  }
});
