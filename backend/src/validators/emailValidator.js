import { z } from 'zod';

export const sendEmailSchema = z.object({
  recipientEmail: z.string().email('Valid recipient email is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  resumeUrl: z.string().min(1, 'Resume URL is required'),
  resumeName: z.string().optional(),
});
