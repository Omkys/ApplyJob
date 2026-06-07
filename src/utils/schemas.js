import { z } from 'zod';

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
});

export const sendEmailSchema = z.object({
  recipientEmail: z
    .string()
    .min(1, 'Recipient email is required')
    .email('Enter a valid email'),
});
