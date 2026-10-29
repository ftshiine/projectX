import { Company } from '../models/Company.js';

const INITIAL_COMPANIES = [
  {
    crn: '12948102',
    companyName: 'Apex Green Logistics Ltd',
    companyStatus: 'Active',
    companyType: 'ltd',
    address: 'Units 4-6, Thames Gateway Industrial Park',
    postcode: 'RM13 8GQ',
    incorporationDate: '2020-10-14',
    directors: [
      { name: 'Marcus Vance', role: 'Managing Director', appointedOn: '2020-10-14' },
      { name: 'Elena Rostova', role: 'Operations Director', appointedOn: '2021-03-01' },
    ],
  },
  {
    crn: '09847113',
    companyName: 'Flour & Hearth Ltd',
    companyStatus: 'Active',
    companyType: 'ltd',
    address: '14 Whiteladies Road, Clifton',
    postcode: 'BS8 2LG',
    incorporationDate: '2015-11-03',
    directors: [
      { name: 'Sarah Jenkins', role: 'Founder & Director', appointedOn: '2015-11-03' },
    ],
  },
  {
    crn: '11429817',
    companyName: 'Nexus Cloud Solutions UK Ltd',
    companyStatus: 'Active',
    companyType: 'ltd',
    address: '88 St John Street, Clerkenwell',
    postcode: 'EC1M 4EH',
    incorporationDate: '2018-06-22',
    directors: [
      { name: 'David Thorne', role: 'Chief Executive Officer', appointedOn: '2018-06-22' },
      { name: 'Priya Patel', role: 'Chief Technology Officer', appointedOn: '2019-01-15' },
    ],
  },
  {
    crn: '13098421',
    companyName: 'Vanguard Retail Systems Ltd',
    companyStatus: 'Active',
    companyType: 'ltd',
    address: 'Building 3, Manchester Science Park',
    postcode: 'M15 6JJ',
    incorporationDate: '2020-12-21',
    directors: [
      { name: 'Alastair Campbell', role: 'Director', appointedOn: '2020-12-21' },
    ],
  },
];

export class CompanyService {
  /**
   * Ensure standard mock Companies House companies are seeded
   */
  static async seedIfEmpty() {
    const count = await Company.countDocuments();
    if (count === 0) {
      await Company.insertMany(INITIAL_COMPANIES);
      console.log('[CompanyService] Seeded default Companies House mock records');
    }
  }

  /**
   * Search Companies House live registry by keyword (Name or CRN)
   */
  static async searchCompanies(query) {
    await this.seedIfEmpty();

    if (!query || query.trim().length === 0) {
      return await Company.find().limit(5);
    }

    const cleanQuery = query.trim();
    const regex = new RegExp(cleanQuery, 'i');

    return await Company.find({
      $or: [{ companyName: regex }, { crn: regex }],
    }).limit(10);
  }

  /**
   * Lookup exact company by CRN
   */
  static async getCompanyByCrn(crn) {
    await this.seedIfEmpty();
    return await Company.findOne({ crn: crn.trim() });
  }
}

