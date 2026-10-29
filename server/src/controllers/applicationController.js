import { ApplicationService } from '../services/applicationService.js';

export const createApplication = async (req, res, next) => {
  try {
    const application = await ApplicationService.createApplication(req.body);
    res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await ApplicationService.getApplication(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found with provided ID or reference code',
      });
    }
    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ApplicationService.updateApplicationStep(id, req.body);
    res.json({
      success: true,
      message: 'Application step updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const calculateEstimate = async (req, res, next) => {
  try {
    const { fundingAmount, monthlyTurnover, tradingHistory } = req.query;
    const estimate = ApplicationService.calculateEstimate(
      fundingAmount,
      monthlyTurnover,
      tradingHistory
    );
    res.json({
      success: true,
      data: estimate,
    });
  } catch (error) {
    next(error);
  }
};

export const listApplications = async (req, res, next) => {
  try {
    const applications = await ApplicationService.listApplications();
    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

