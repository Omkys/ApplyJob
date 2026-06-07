import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { createTemplateSchema, updateTemplateSchema } from '../validators/templateValidator.js';
import * as templateService from '../services/templateService.js';

export const getTemplates = asyncHandler(async (_req, res) => {
  const templates = await templateService.getAllTemplates();
  res.json({ success: true, data: templates });
});

export const createTemplate = asyncHandler(async (req, res) => {
  const parsed = createTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }
  if (!req.file) throw new AppError('Resume file is required', 400);

  const template = await templateService.createTemplate(parsed.data, req.file);
  res.status(201).json({ success: true, data: template, message: 'Template created' });
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const parsed = updateTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.errors[0].message, 400);
  }

  const template = await templateService.updateTemplate(
    req.params.id,
    parsed.data,
    req.file || null
  );
  res.json({ success: true, data: template, message: 'Template updated' });
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  await templateService.deleteTemplate(req.params.id);
  res.json({ success: true, message: 'Template deleted' });
});
