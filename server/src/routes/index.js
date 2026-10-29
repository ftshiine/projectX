import { Router } from 'express';
import applicationRoutes from './applicationRoutes.js';
import companyRoutes from './companyRoutes.js';
import partnerRoutes from './partnerRoutes.js';

const router = Router();

router.use('/applications', applicationRoutes);
router.use('/companies', companyRoutes);
router.use('/partners', partnerRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sigma Lending Commercial API',
    timestamp: new Date().toISOString(),
  });
});

export default router;

