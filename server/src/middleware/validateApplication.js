const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
const UK_CRN_REGEX = /^(?:[A-Z]{2}[0-9]{6}|[0-9]{8}|PENDING)$/i;

const VALID_TRADING_HISTORIES = [
  '6-12 Months Established',
  '1-2 Years Established',
  '3+ Years Established',
];

const VALID_LOAN_PURPOSES = [
  'Working Capital',
  'Stock / Inventory',
  'Equipment Asset',
  'HMRC / VAT Bill',
  'Growth / Expansion',
  'Other Refinance',
];

/**
 * Middleware to validate new commercial loan application payloads
 */
export const validateApplication = (req, res, next) => {
  const errors = {};
  const {
    fundingAmount,
    companyName,
    crn,
    address,
    postcode,
    monthlyTurnover,
    tradingHistory,
    loanPurpose,
  } = req.body;

  // 1. Funding Amount
  const numFunding = Number(fundingAmount);
  if (fundingAmount === undefined || fundingAmount === null || isNaN(numFunding)) {
    errors.fundingAmount = 'Funding amount is required and must be a valid number';
  } else if (numFunding < 5000 || numFunding > 150000) {
    errors.fundingAmount = 'Funding amount must be between £5,000 and £150,000';
  } else {
    req.body.fundingAmount = numFunding;
  }

  // 2. Company Name
  if (!companyName || typeof companyName !== 'string' || companyName.trim().length === 0) {
    errors.companyName = 'UK Registered Company name is required';
  } else if (companyName.trim().length < 2) {
    errors.companyName = 'Company name must be at least 2 characters';
  } else if (companyName.trim().length > 150) {
    errors.companyName = 'Company name cannot exceed 150 characters';
  } else {
    req.body.companyName = companyName.trim();
  }

  // 3. Companies House CRN
  if (crn && typeof crn === 'string') {
    const cleanCrn = crn.trim().toUpperCase();
    if (cleanCrn !== 'PENDING' && !UK_CRN_REGEX.test(cleanCrn)) {
      errors.crn = 'CRN must be a valid 8-character Companies House number (e.g. 12948102 or SC123456)';
    } else {
      req.body.crn = cleanCrn;
    }
  } else {
    req.body.crn = 'PENDING';
  }

  // 4. Primary UK Trading Address
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    errors.address = 'Primary trading address is required';
  } else if (address.trim().length < 5) {
    errors.address = 'Trading address must be at least 5 characters';
  } else {
    req.body.address = address.trim();
  }

  // 5. Postcode
  if (!postcode || typeof postcode !== 'string' || postcode.trim().length === 0) {
    errors.postcode = 'Postcode is required';
  } else {
    const cleanPostcode = postcode.trim().toUpperCase();
    if (!UK_POSTCODE_REGEX.test(cleanPostcode)) {
      errors.postcode = 'Please provide a valid UK postcode format (e.g. RM13 8GQ or BS8 2LG)';
    } else {
      req.body.postcode = cleanPostcode;
    }
  }

  // 6. Monthly Turnover
  const numTurnover = Number(monthlyTurnover);
  if (monthlyTurnover === undefined || monthlyTurnover === null || monthlyTurnover === '' || isNaN(numTurnover)) {
    errors.monthlyTurnover = 'Average monthly turnover is required';
  } else if (numTurnover < 1000) {
    errors.monthlyTurnover = 'Average monthly turnover must be at least £1,000 for eligibility';
  } else {
    req.body.monthlyTurnover = numTurnover;
  }

  // 7. Trading History
  if (!tradingHistory || typeof tradingHistory !== 'string') {
    errors.tradingHistory = 'Trading history duration is required';
  } else if (!VALID_TRADING_HISTORIES.includes(tradingHistory.trim())) {
    errors.tradingHistory = `Trading history must be one of: ${VALID_TRADING_HISTORIES.join(', ')}`;
  } else {
    req.body.tradingHistory = tradingHistory.trim();
  }

  // 8. Loan Purpose
  if (!loanPurpose || typeof loanPurpose !== 'string') {
    errors.loanPurpose = 'Primary loan objective must be selected';
  } else if (!VALID_LOAN_PURPOSES.includes(loanPurpose.trim())) {
    errors.loanPurpose = `Loan purpose must be one of: ${VALID_LOAN_PURPOSES.join(', ')}`;
  } else {
    req.body.loanPurpose = loanPurpose.trim();
  }

  // If validation errors exist, halt and return 400
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: `Validation failed on ${Object.keys(errors).length} field(s)`,
      errors,
    });
  }

  next();
};

/**
 * Middleware to validate step progression (Open Banking & Director verification)
 */
export const validateStepUpdate = (req, res, next) => {
  const errors = {};
  const { bankName, directorName, step } = req.body;

  if (step !== undefined) {
    const stepNum = Number(step);
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 4) {
      errors.step = 'Step must be a number between 1 and 4';
    }
  }

  if (bankName !== undefined) {
    if (typeof bankName !== 'string' || bankName.trim().length < 2) {
      errors.bankName = 'A valid UK financial institution name is required';
    }
  }

  if (directorName !== undefined) {
    if (typeof directorName !== 'string' || directorName.trim().length < 2) {
      errors.directorName = 'Director name must be at least 2 characters';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Step validation failed',
      errors,
    });
  }

  next();
};

