import { Partner } from '../models/Partner.js';

export class PartnerService {
  /**
   * Calculate tiered broker commission
   */
  static calculateCommission(dealAmount, monthlyDeals = 2) {
    const amount = Number(dealAmount) || 50000;
    const deals = Number(monthlyDeals) || 2;

    let tier = 'Associate Introducer';
    let baseRate = 2.5;

    if (deals >= 10) {
      tier = 'Strategic Partner';
      baseRate = 4.5;
    } else if (deals >= 4) {
      tier = 'Principal Broker';
      baseRate = 3.5;
    }

    const estimatedCommission = (amount * baseRate) / 100;
    const annualProjectedVolume = amount * deals * 12;
    const annualProjectedCommission = estimatedCommission * deals * 12;

    return {
      dealAmount: amount,
      monthlyDeals: deals,
      tier,
      baseRate,
      estimatedCommission,
      annualProjectedVolume,
      annualProjectedCommission,
    };
  }

  /**
   * Register a new partner/broker
   */
  static async registerPartner(data) {
    const partner = new Partner(data);
    return await partner.save();
  }

  /**
   * List registered partners
   */
  static async listPartners() {
    return await Partner.find().sort({ createdAt: -1 });
  }
}

