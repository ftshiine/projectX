import { PartnerService } from '../services/partnerService.js';

export const calculateCommission = async (req, res, next) => {
  try {
    const { dealAmount, monthlyDeals } = req.query;
    const result = PartnerService.calculateCommission(dealAmount, monthlyDeals);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const registerPartner = async (req, res, next) => {
  try {
    const partner = await PartnerService.registerPartner(req.body);
    res.status(201).json({
      success: true,
      message: 'Broker registered successfully in Sigma Introducer Network',
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

export const listPartners = async (req, res, next) => {
  try {
    const partners = await PartnerService.listPartners();
    res.json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (error) {
    next(error);
  }
};

