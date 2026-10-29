import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    referenceCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fundingAmount: {
      type: Number,
      required: [true, 'Funding amount is required'],
      min: [5000, 'Minimum funding amount is £5,000'],
      max: [150000, 'Maximum unsecured funding amount is £150,000'],
      default: 50000,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    crn: {
      type: String,
      required: [true, 'Companies House CRN is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Trading address is required'],
      trim: true,
    },
    postcode: {
      type: String,
      required: [true, 'Postcode is required'],
      trim: true,
      uppercase: true,
    },
    monthlyTurnover: {
      type: Number,
      required: [true, 'Average monthly turnover is required'],
      min: [1000, 'Monthly turnover must be at least £1,000'],
      default: 38500,
    },
    tradingHistory: {
      type: String,
      required: [true, 'Trading history is required'],
      default: '3+ Years Established',
    },
    loanPurpose: {
      type: String,
      required: [true, 'Primary loan purpose is required'],
      enum: [
        'Working Capital',
        'Stock / Inventory',
        'Equipment Asset',
        'HMRC / VAT Bill',
        'Growth / Expansion',
        'Other Refinance',
      ],
      default: 'Working Capital',
    },
    status: {
      type: String,
      enum: ['draft', 'open_banking_pending', 'ekyc_pending', 'approved', 'funded', 'declined'],
      default: 'draft',
    },
    currentStep: {
      type: Number,
      min: 1,
      max: 4,
      default: 1,
    },
    estimate: {
      facilityAmount: Number,
      indicativeTermMonths: { type: Number, default: 24 },
      earlyRepaymentPenalty: { type: String, default: '£0 (Zero Fees)' },
      approvalTimeline: { type: String, default: 'Under 4 Hours' },
      disbursementTarget: { type: String, default: 'Same Working Day' },
      approvalScore: { type: Number, default: 88 },
      approvalBand: { type: String, default: 'High Approval Band' },
    },
    openBanking: {
      connected: { type: Boolean, default: false },
      selectedBank: { type: String, default: '' },
      connectedAt: { type: Date },
    },
    directorCheck: {
      verified: { type: Boolean, default: false },
      directorName: { type: String, default: '' },
      verifiedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model('Application', applicationSchema);

