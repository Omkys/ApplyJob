import { Router } from 'express';
import templateRoutes from './templateRoutes.js';
import emailRoutes from './emailRoutes.js';
import { smtpTest } from '../controllers/emailController.js';
import { networkTest } from '../controllers/networkController.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ApplyFlow API is running' });
});

router.get('/smtp-test', smtpTest);
router.get('/network-test', networkTest);

router.use('/templates', templateRoutes);
router.use('/send-email', emailRoutes);

export default router;
