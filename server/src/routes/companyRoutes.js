import { Router } from 'express';
import { searchCompanies, getCompanyByCrn } from '../controllers/companyController.js';

const router = Router();

router.get('/search', searchCompanies);
router.get('/:crn', getCompanyByCrn);

export default router;

