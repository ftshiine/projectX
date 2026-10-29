import { Router } from 'express';
import {
  createApplication,
  getApplication,
  updateApplicationStep,
  calculateEstimate,
  listApplications,
} from '../controllers/applicationController.js';
import {
  validateApplication,
  validateStepUpdate,
} from '../middleware/validateApplication.js';

const router = Router();

router.get('/estimate', calculateEstimate);
router.get('/', listApplications);
router.post('/', validateApplication, createApplication);
router.get('/:id', getApplication);
router.patch('/:id/step', validateStepUpdate, updateApplicationStep);

export default router;

