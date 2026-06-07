import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { sendEmailSchema } from '../validators/emailValidator.js';
import * as emailService from '../services/emailService.js';

export const sendEmail = asyncHandler(async (req, res) => {
  const parsed = sendEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }

  const result = await emailService.sendApplicationEmail(parsed.data);
  res.json(result);
});
