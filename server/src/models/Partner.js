import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    brokerName: {
      type: String,
      required: [true, 'Broker name is required'],
      trim: true,
    },
    firmName: {
      type: String,
      required: [true, 'Firm name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    fcaNumber: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      enum: ['Associate Introducer', 'Principal Broker', 'Strategic Partner'],
      default: 'Associate Introducer',
    },
    baseCommissionRate: {
      type: Number,
      default: 2.5,
    },
    monthlyDealVolume: {
      type: Number,
      default: 2,
    },
    status: {
      type: String,
      enum: ['pending_review', 'active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Partner = mongoose.model('Partner', partnerSchema);

