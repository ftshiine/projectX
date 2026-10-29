import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    crn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    companyStatus: {
      type: String,
      default: 'Active',
    },
    companyType: {
      type: String,
      default: 'ltd',
    },
    address: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
      uppercase: true,
    },
    incorporationDate: {
      type: String,
      default: '2019-04-12',
    },
    directors: [
      {
        name: String,
        role: String,
        appointedOn: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model('Company', companySchema);

