import { Router } from 'express';
import {
  calculateCommission,
  registerPartner,
  listPartners,
} from '../controllers/partnerController.js';
import { validatePartner } from '../middleware/validatePartner.js';

const router = Router();

router.get('/calculator', calculateCommission);
router.get('/', listPartners);
router.post('/', validatePartner, registerPartner);

export default router;

