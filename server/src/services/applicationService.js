import { Application } from '../models/Application.js';
import crypto from 'crypto';

export class ApplicationService {
  /**
   * Calculate underwriting estimate metrics and health score
   */
  static calculateEstimate(fundingAmount, monthlyTurnover, tradingHistory) {
    const amount = Number(fundingAmount) || 50000;
    const turnover = Number(monthlyTurnover) || 38500;

    // Financial leverage ratio: (requested / (monthlyTurnover * 3))
    const leverageRatio = amount / (turnover * 3);

    let score = 90;
    if (leverageRatio > 0.8) score -= 8;
    else if (leverageRatio > 0.5) score -= 3;
    else score += 2;

    if (tradingHistory && tradingHistory.includes('3+')) {
      score += 3;
    } else if (tradingHistory && tradingHistory.includes('1-2')) {
      score -= 2;
    }

    score = Math.max(65, Math.min(96, Math.round(score)));

    let approvalBand = 'High Approval Band';
    if (score < 75) approvalBand = 'Moderate Review Band';
    else if (score >= 85) approvalBand = 'Tier-1 High Approval Band';

    let indicativeTermMonths = 24;
    if (amount <= 25000) indicativeTermMonths = 12;
    else if (amount >= 100000) indicativeTermMonths = 36;

    return {
      facilityAmount: amount,
      indicativeTermMonths,
      earlyRepaymentPenalty: '£0 (Zero Fees)',
      approvalTimeline: 'Under 4 Hours',
      disbursementTarget: 'Same Working Day',
      approvalScore: score,
      approvalBand,
    };
  }

  /**
   * Create a new loan application
   */
  static async createApplication(data) {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const referenceCode = `SIG-${new Date().getFullYear()}-${randomHex}`;

    const estimate = this.calculateEstimate(
      data.fundingAmount,
      data.monthlyTurnover,
      data.tradingHistory
    );

    const application = new Application({
      ...data,
      referenceCode,
      estimate,
      currentStep: 1,
      status: 'draft',
    });

    return await application.save();
  }

  /**
   * Get an application by ID or reference code
   */
  static async getApplication(idOrCode) {
    const isObjectId = idOrCode.match(/^[0-9a-fA-F]{24}$/);
    if (isObjectId) {
      return await Application.findById(idOrCode);
    }
    return await Application.findOne({ referenceCode: idOrCode.toUpperCase() });
  }

  /**
   * Advance or update application progress through the 4 steps
   */
  static async updateApplicationStep(id, { step, bankName, directorName, status }) {
    const application = await Application.findById(id);
    if (!application) {
      throw new Error('Application not found');
    }

    if (step) {
      application.currentStep = step;
    }

    if (bankName) {
      application.openBanking.connected = true;
      application.openBanking.selectedBank = bankName;
      application.openBanking.connectedAt = new Date();
      application.status = 'ekyc_pending';
      application.currentStep = Math.max(application.currentStep, 3);
    }

    if (directorName) {
      application.directorCheck.verified = true;
      application.directorCheck.directorName = directorName;
      application.directorCheck.verifiedAt = new Date();
      application.status = 'approved';
      application.currentStep = Math.max(application.currentStep, 4);
    }

    if (status) {
      application.status = status;
    }

    return await application.save();
  }

  /**
   * List recent applications
   */
  static async listApplications(limit = 20) {
    return await Application.find().sort({ createdAt: -1 }).limit(limit);
  }
}

