import { CompanyService } from '../services/companyService.js';

export const searchCompanies = async (req, res, next) => {
  try {
    const { q } = req.query;
    const companies = await CompanyService.searchCompanies(q);
    res.json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyByCrn = async (req, res, next) => {
  try {
    const { crn } = req.params;
    const company = await CompanyService.getCompanyByCrn(crn);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `Company with CRN ${crn} not found`,
      });
    }
    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

