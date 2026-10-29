const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validatePartner = (req, res, next) => {
  const errors = {};
  const { brokerName, firmName, email, phone } = req.body;

  if (!brokerName || typeof brokerName !== 'string' || brokerName.trim().length < 2) {
    errors.brokerName = 'Advisor/Broker name is required (minimum 2 characters)';
  }

  if (!firmName || typeof firmName !== 'string' || firmName.trim().length < 2) {
    errors.firmName = 'Brokerage or Firm name is required';
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'A valid business email address is required';
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    errors.phone = 'A valid direct phone number is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: `Validation failed on ${Object.keys(errors).length} field(s)`,
      errors,
    });
  }

  next();
};

