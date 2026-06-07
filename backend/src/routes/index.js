import { Router } from 'express';
import templateRoutes from './templateRoutes.js';
import emailRoutes from './emailRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ApplyFlow API is running' });
});

router.use('/templates', templateRoutes);
router.use('/send-email', emailRoutes);

export default router;
