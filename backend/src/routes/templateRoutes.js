import { Router } from 'express';
import { uploadResume, handleMulterError } from '../middleware/upload.js';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController.js';

const router = Router();

router.get('/', getTemplates);
router.post('/', uploadResume, handleMulterError, createTemplate);
router.put('/:id', uploadResume, handleMulterError, updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
