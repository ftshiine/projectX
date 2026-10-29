import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Search,
  ShieldCheck,
  Lock,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Check,
  TrendingUp,
  FileText,
  Banknote,
  Sparkles,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

const LOAN_PURPOSES = [
  'Working Capital',
  'Stock / Inventory',
  'Equipment Asset',
  'HMRC / VAT Bill',
  'Growth / Expansion',
  'Other Refinance',
];

const TRADING_OPTIONS = [
  '6-12 Months Established',
  '1-2 Years Established',
  '3+ Years Established',
];

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 150000];

const UK_BANKS = [
  { name: 'Barclays', color: '#00AEEF' },
  { name: 'HSBC', color: '#DB0011' },
  { name: 'NatWest', color: '#561972' },
  { name: 'Lloyds Bank', color: '#006A4E' },
  { name: 'Santander', color: '#EC0000' },
  { name: 'Monzo', color: '#FF3565' },
  { name: 'Revolut', color: '#0075EB' },
];

export default function ApplyView({ setCurrentView }) {
  // Stepper State (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State - Empty by default
  const [fundingAmount, setFundingAmount] = useState(50000);
  const [companySearch, setCompanySearch] = useState('');
  const [crn, setCrn] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [turnover, setTurnover] = useState('');
  const [tradingHistory, setTradingHistory] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');

  // Dynamic Calculation State
  const [estimate, setEstimate] = useState({
    facilityAmount: 50000,
    indicativeTermMonths: 24,
    earlyRepaymentPenalty: '£0 (Zero Fees)',
    approvalTimeline: 'Under 4 Hours',
    disbursementTarget: 'Same Working Day',
    approvalScore: 88,
    approvalBand: 'High Approval Band',
  });

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Custom Trading History Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Submissions State
  const [savedApplication, setSavedApplication] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Backend Validation Errors State
  const [fieldErrors, setFieldErrors] = useState({});

  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Fetch estimate from API on amount / turnover change
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const amt = fundingAmount || 50000;
        const turn = turnover || 35000;
        const hist = tradingHistory || '3+ Years Established';
        const res = await fetch(`/api/applications/estimate?fundingAmount=${amt}&monthlyTurnover=${turn}&tradingHistory=${encodeURIComponent(hist)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) setEstimate(json.data);
        }
      } catch (err) {
        console.error('Estimate calculation error:', err);
      }
    };
    fetchEstimate();
  }, [fundingAmount, turnover, tradingHistory]);

  // Companies House Autocomplete
  const handleCompanySearchChange = async (val) => {
    setCompanySearch(val);
    if (val.trim().length > 1) {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/companies/search?q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const json = await res.json();
          setSuggestions(json.data || []);
        }
      } catch (err) {
        console.error('Company search error:', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectCompany = (comp) => {
    setCompanySearch(comp.companyName);
    setCrn(comp.crn);
    setAddress(comp.address);
    setPostcode(comp.postcode);
    if (comp.directors && comp.directors.length > 0) {
      setDirectorName(comp.directors[0].name);
    }
    setSuggestions([]);
  };

  // Step 1: Submit Business Profile (Validated by Backend API)
  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      const payload = {
        fundingAmount: Number(fundingAmount),
        companyName: companySearch,
        crn: crn || (companySearch && !/^\d{8}$/.test(companySearch) ? 'PENDING' : companySearch),
        address,
        postcode,
        monthlyTurnover: turnover === '' ? '' : Number(turnover),
        tradingHistory,
        loanPurpose,
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setSavedApplication(json.data);
        setFieldErrors({});
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (res.status === 400 && json.errors) {
        // Backend validation errors mapped directly
        setFieldErrors(json.errors);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        alert(json.message || 'Error processing loan application');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to connect to backend server. Make sure MongoDB and backend are running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Open Banking Sync
  const handleConnectBank = async (bankName) => {
    setSelectedBank(bankName);
    if (!savedApplication) return;
    try {
      await fetch(`/api/applications/${savedApplication._id}/step`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName }),
      });
      setTimeout(() => {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    } catch (err) {
      console.error(err);
    }
  };

  // Step 3: Director eKYC
  const handleVerifyDirector = async () => {
    if (!savedApplication) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/applications/${savedApplication._id}/step`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directorName }),
      });
      setCurrentStep(4);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-burgundy-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* TOP STATUS BAR */}
        <div className="bg-white rounded-2xl p-6 border border-burgundy-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-burgundy-900 flex items-center justify-center text-white font-extrabold text-xl">
              Σ
            </div>
            <div className="h-6 w-px bg-burgundy-200 hidden sm:block" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-600">
              Commercial Capital UK • Application Portal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blush-50 border border-burgundy-200 text-xs text-ink-850">
              <span className="w-2 h-2 rounded-full bg-emerald-700" />
              <span>FCA Regulated & Monitored</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blush-50 border border-burgundy-200 text-xs font-bold text-ink-850 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Soft Search Guarantee</span>
            </div>

            <a href="tel:02079460880" className="text-xs font-semibold text-burgundy-900 hover:underline flex items-center gap-1 pl-2">
              <span>Need Help?</span>
              <HelpCircle className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4-STEP STEPPER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className={`p-4 rounded-2xl border transition relative overflow-hidden ${currentStep === 1
            ? 'bg-white border-burgundy-700 shadow-md ring-2 ring-burgundy-900/10'
            : currentStep > 1
              ? 'bg-emerald-50/60 border-emerald-300'
              : 'bg-white/60 border-burgundy-200 opacity-60'
            }`}>
            {currentStep === 1 && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-burgundy-900" />
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-burgundy-900">Step 01</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep > 1 ? 'bg-emerald-700 text-white' : 'bg-burgundy-900 text-white'
                }`}>
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
            </div>
            <div className="font-bold text-sm text-ink-850">Business Profile</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {currentStep === 1 ? '• Active Session' : currentStep > 1 ? 'Completed' : 'Upcoming'}
            </div>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-2xl border transition relative overflow-hidden ${currentStep === 2
            ? 'bg-white border-burgundy-700 shadow-md ring-2 ring-burgundy-900/10'
            : currentStep > 2
              ? 'bg-emerald-50/60 border-emerald-300'
              : 'bg-white/60 border-burgundy-200 opacity-60'
            }`}>
            {currentStep === 2 && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-burgundy-900" />
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600">Step 02</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep > 2 ? 'bg-emerald-700 text-white' : currentStep === 2 ? 'bg-burgundy-900 text-white' : 'bg-burgundy-200 text-ink-600'
                }`}>
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
            </div>
            <div className="font-bold text-sm text-ink-850">Open Banking Link</div>
            <div className="text-[11px] text-ink-600 mt-1">Instant Bank Sync</div>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-2xl border transition relative overflow-hidden ${currentStep === 3
            ? 'bg-white border-burgundy-700 shadow-md ring-2 ring-burgundy-900/10'
            : currentStep > 3
              ? 'bg-emerald-50/60 border-emerald-300'
              : 'bg-white/60 border-burgundy-200 opacity-60'
            }`}>
            {currentStep === 3 && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-burgundy-900" />
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600">Step 03</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep > 3 ? 'bg-emerald-700 text-white' : currentStep === 3 ? 'bg-burgundy-900 text-white' : 'bg-burgundy-200 text-ink-600'
                }`}>
                {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
              </div>
            </div>
            <div className="font-bold text-sm text-ink-850">Director ID Check</div>
            <div className="text-[11px] text-ink-600 mt-1">Automated eKYC</div>
          </div>

          {/* Step 4 */}
          <div className={`p-4 rounded-2xl border transition relative overflow-hidden ${currentStep === 4
            ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
            : 'bg-white/60 border-burgundy-200 opacity-60'
            }`}>
            {currentStep === 4 && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" />
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600">Step 04</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 4 ? 'bg-emerald-700 text-white' : 'bg-burgundy-200 text-ink-600'
                }`}>
                4
              </div>
            </div>
            <div className="font-bold text-sm text-ink-850">Decision & Payout</div>
            <div className="text-[11px] text-ink-600 mt-1">Funds in 24h</div>
          </div>
        </div>

        {/* 12-COLUMN MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: APPLICATION FORM / STEP VIEW (Col 1-8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-burgundy-200/80 shadow-md relative">

            {/* STEP 1: BUSINESS PROFILE FORM */}
            {currentStep === 1 && (
                <form onSubmit={handleSubmitStep1} className="space-y-8" noValidate>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-100 border border-burgundy-200 text-[11px] font-bold uppercase tracking-wider text-burgundy-900 mb-2">
                      <Sparkles className="w-3 h-3 text-burgundy-700" />
                      <span>Fast-Track Application</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-850">
                      Let's find your business funding
                    </h2>
                    <p className="text-xs sm:text-sm text-ink-600 mt-1">
                      Takes under 4 minutes. Submitting this form creates zero impact on your commercial credit score.
                    </p>
                  </div>

                  {/* BACKEND VALIDATION ERROR BANNER */}
                  {Object.keys(fieldErrors).length > 0 && (
                    <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3 shadow-sm animate-in fade-in">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold text-sm block text-red-800">
                          Please resolve the following required fields:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-red-700">
                          {Object.values(fieldErrors).map((msg, i) => (
                            <li key={i}>{msg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 1. FUNDING SELECTOR SLIDER */}
                    <div className={`bg-burgundy-50/60 rounded-2xl p-6 border space-y-4 transition ${fieldErrors.fundingAmount ? 'border-red-400 ring-2 ring-red-400/20' : 'border-burgundy-200'
                      }`}>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-ink-850">Funding Required</label>
                        <div className="text-right">
                          <span className="text-3xl font-extrabold text-burgundy-900">
                            £{Number(fundingAmount).toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-ink-600 ml-1">GBP</span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="5000"
                        max="150000"
                        step="5000"
                        value={fundingAmount}
                        onChange={(e) => {
                          clearFieldError('fundingAmount');
                          setFundingAmount(Number(e.target.value));
                        }}
                        className="w-full h-3"
                      />

                      <div className="flex justify-between text-xs text-ink-600 font-semibold">
                        <span>Min: £5,000</span>
                        <span>Max: £150,000 (Unsecured)</span>
                      </div>

                      {fieldErrors.fundingAmount && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.fundingAmount}</span>
                        </p>
                      )}

                      {/* Quick Select Pills */}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-ink-600 mr-1">Quick Select:</span>
                        {QUICK_AMOUNTS.map((amt) => (
                          <button
                            type="button"
                            key={amt}
                            onClick={() => {
                              clearFieldError('fundingAmount');
                              setFundingAmount(amt);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${fundingAmount === amt
                              ? 'bg-burgundy-900 text-white shadow-sm'
                              : 'bg-white hover:bg-blush-100 text-ink-850 border border-burgundy-200'
                              }`}
                          >
                            £{amt >= 1000 ? `${amt / 1000}k` : amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. COMPANIES HOUSE LIVE LOOKUP */}
                    <div className="space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-ink-850">
                          UK Registered Company Name or CRN
                        </label>
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Live Companies House API</span>
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          value={companySearch}
                          onChange={(e) => {
                            clearFieldError('companyName');
                            clearFieldError('crn');
                            handleCompanySearchChange(e.target.value);
                          }}
                          placeholder="Start typing UK registered company name or 8-digit CRN..."
                          className={`w-full px-4 py-3.5 pl-11 pr-28 rounded-2xl border text-ink-850 font-medium focus:outline-none focus:ring-2 text-sm shadow-sm transition ${fieldErrors.companyName
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-400'
                              : 'border-burgundy-200 bg-white focus:ring-burgundy-900'
                            }`}
                        />
                        <Building2 className="w-5 h-5 text-burgundy-700 absolute left-3.5 top-3.5 pointer-events-none" />

                        {crn && (
                          <div className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                            CRN: {crn}
                          </div>
                        )}
                      </div>

                      {fieldErrors.companyName && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-0.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.companyName}</span>
                        </p>
                      )}
                      {fieldErrors.crn && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-0.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.crn}</span>
                        </p>
                      )}

                      {/* Autocomplete Dropdown */}
                      {suggestions.length > 0 && (
                        <div className="absolute z-20 top-full left-0 w-full mt-1 bg-white border border-burgundy-200 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                          {suggestions.map((comp) => (
                            <div
                              key={comp.crn}
                              onClick={() => {
                                clearFieldError('companyName');
                                clearFieldError('crn');
                                clearFieldError('address');
                                clearFieldError('postcode');
                                selectCompany(comp);
                              }}
                              className="px-4 py-3 hover:bg-blush-100 cursor-pointer border-b border-burgundy-100 last:border-0 flex items-center justify-between text-sm"
                            >
                              <div>
                                <div className="font-bold text-ink-850">{comp.companyName}</div>
                                <div className="text-xs text-ink-600">{comp.address}, {comp.postcode}</div>
                              </div>
                              <span className="font-mono text-xs font-bold text-burgundy-900 bg-burgundy-50 px-2 py-1 rounded">
                                {comp.crn}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-ink-600">
                        We automatically populate registered directors and corporate filing history in the next step.
                      </p>
                    </div>

                    {/* 3. DUAL FIELD: TRADING ADDRESS & POSTCODE */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-ink-850">Primary UK Trading Address</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => {
                            clearFieldError('address');
                            setAddress(e.target.value);
                          }}
                          placeholder="e.g. Units 4-6, Thames Gateway Industrial Park"
                          className={`w-full px-4 py-3 rounded-2xl border text-sm text-ink-850 focus:outline-none focus:ring-2 transition ${fieldErrors.address
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-400'
                              : 'border-burgundy-200 bg-white focus:ring-burgundy-900'
                            }`}
                        />
                        {fieldErrors.address && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-0.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{fieldErrors.address}</span>
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-ink-850">Postcode</label>
                        <input
                          type="text"
                          value={postcode}
                          onChange={(e) => {
                            clearFieldError('postcode');
                            setPostcode(e.target.value.toUpperCase());
                          }}
                          placeholder="e.g. RM13 8GQ"
                          className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono uppercase text-ink-850 focus:outline-none focus:ring-2 transition ${fieldErrors.postcode
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-400'
                              : 'border-burgundy-200 bg-white focus:ring-burgundy-900'
                            }`}
                        />
                        {fieldErrors.postcode && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-0.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{fieldErrors.postcode}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 4. DUAL FIELD: TURNOVER & TRADING DURATION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-ink-850">Average Monthly Turnover (£ GBP)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-sm font-bold text-ink-600">£</span>
                          <input
                            type="number"
                            value={turnover}
                            onChange={(e) => {
                              clearFieldError('monthlyTurnover');
                              setTurnover(e.target.value === '' ? '' : Number(e.target.value));
                            }}
                            placeholder="e.g. 38500"
                            className={`w-full pl-8 pr-4 py-3 rounded-2xl border text-sm font-bold text-ink-850 focus:outline-none focus:ring-2 transition ${fieldErrors.monthlyTurnover
                                ? 'border-red-500 bg-red-50/20 focus:ring-red-400'
                                : 'border-burgundy-200 bg-white focus:ring-burgundy-900'
                              }`}
                          />
                        </div>
                        {fieldErrors.monthlyTurnover ? (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-0.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{fieldErrors.monthlyTurnover}</span>
                          </p>
                        ) : (
                          <span className="text-[11px] text-ink-600">Based on past 3–6 months trading receipts.</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-ink-850">Trading History</label>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => {
                              clearFieldError('tradingHistory');
                              setIsDropdownOpen(!isDropdownOpen);
                            }}
                            className={`w-full px-4 py-3 rounded-2xl border text-sm text-left flex items-center justify-between transition focus:outline-none focus:ring-2 shadow-sm ${fieldErrors.tradingHistory
                                ? 'border-red-500 bg-red-50/20 focus:ring-red-400'
                                : isDropdownOpen
                                  ? 'border-burgundy-900 ring-2 ring-burgundy-900/10 bg-white'
                                  : 'border-burgundy-200 hover:border-burgundy-400 bg-white'
                              }`}
                          >
                            <span className={tradingHistory ? "font-bold text-ink-850" : "text-ink-600/60 font-normal"}>
                              {tradingHistory || "Select trading history duration..."}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-burgundy-900 transition-transform duration-200 shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                          </button>

                          {isDropdownOpen && (
                            <div className="absolute z-30 top-full left-0 w-full mt-1.5 bg-white rounded-2xl border border-burgundy-200 shadow-xl overflow-hidden py-1.5">
                              {TRADING_OPTIONS.map((opt) => {
                                const isSelected = tradingHistory === opt;
                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    onClick={() => {
                                      clearFieldError('tradingHistory');
                                      setTradingHistory(opt);
                                      setIsDropdownOpen(false);
                                    }}
                                className={`w-full px-4 py-3 text-sm font-semibold flex items-center justify-between text-left transition ${isSelected
                                        ? 'bg-blush-100 text-burgundy-900 font-bold'
                                        : 'text-ink-850 hover:bg-burgundy-50 hover:text-burgundy-900'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <Check className="w-4 h-4 text-burgundy-900 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {fieldErrors.tradingHistory ? (
                      <p className="text-xs text-red-600 font-semibold flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.tradingHistory}</span>
                      </p>
                    ) : (
                      <span className="text-[11px] text-ink-600">Minimum requirement: 6 months active trading.</span>
                    )}
                  </div>
                </div>

                {/* 5. LOAN PURPOSE SELECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-ink-850">Primary Loan Objective</label>
                    {fieldErrors.loanPurpose && (
                      <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Required</span>
                      </span>
                    )}
                  </div>

                  <div className={`grid grid - cols - 2 sm:grid-cols-3 gap-3 p-1 rounded-2xl transition ${
                                fieldErrors.loanPurpose ? 'ring-2 ring-red-400/40' : ''
                              }`}>
                              {LOAN_PURPOSES.map((purpose) => (
                                <button
                                  type="button"
                                  key={purpose}
                                  onClick={() => {
                                    clearFieldError('loanPurpose');
                                    setLoanPurpose(purpose);
                                  }}
                                  className={`py-3 px-4 rounded-full text-xs font-bold text-left transition border ${loanPurpose === purpose
                                      ? 'bg-burgundy-900 text-white border-burgundy-900 shadow-md'
                                      : fieldErrors.loanPurpose
                                        ? 'bg-white hover:bg-blush-100 text-ink-850 border-red-300'
                                        : 'bg-blush-100/70 hover:bg-blush-100 text-ink-850 border-burgundy-200'
                                    }`}
                                >
                                  {purpose}
                                </button>
                              ))}
                            </div>

                  {fieldErrors.loanPurpose && (
                            <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{fieldErrors.loanPurpose}</span>
                            </p>
                          )}
                        </div>

                        {/* ACTION SUBMISSION */}
                        <div className="pt-4 space-y-3">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-full bg-burgundy-900 hover:bg-burgundy-800 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-burgundy-900/20 active:scale-95 transition flex items-center justify-center gap-2"
                          >
                            <span>{isSubmitting ? 'Processing Application...' : 'Continue to Open Banking Link'}</span>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                          <p className="text-center text-xs text-ink-600 flex items-center justify-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-emerald-700" />
                            <span>256-bit SSL encrypted • Over 90% of UK high street banks supported instantly</span>
                          </p>
                        </div>
                      </form>
            )}

                      {/* STEP 2: OPEN BANKING LINK */}
                      {currentStep === 2 && (
                        <div className="space-y-8">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-100 border border-burgundy-200 text-[11px] font-bold uppercase tracking-wider text-burgundy-900 mb-2">
                              <span>Step 02 of 04</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-850">
                              Connect UK Commercial Account
                            </h2>
                            <p className="text-sm text-ink-600 mt-1">
                              Select your primary business account provider. Open Banking securely verifies trading cashflow in read-only mode without sharing your credentials.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {UK_BANKS.map((b) => (
                              <button
                                key={b.name}
                                onClick={() => handleConnectBank(b.name)}
                                className={`p-6 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 ${selectedBank === b.name
                                  ? 'border-burgundy-900 bg-blush-100 shadow-md ring-2 ring-burgundy-900/20'
                                  : 'border-burgundy-200 bg-white hover:border-burgundy-400'
                                  }`}
                              >
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                                  style={{ backgroundColor: b.color }}
                                >
                                  {b.name[0]}
                                </div>
                                <span className="font-bold text-sm text-ink-850 mt-1">{b.name}</span>
                                <span className="text-[10px] text-emerald-700 font-semibold">Fast Sync Available</span>
                              </button>
                            ))}
                          </div>

                          <div className="p-4 rounded-xl bg-blush-50 border border-burgundy-200 flex items-start gap-3 text-xs text-ink-600">
                            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                            <span>
                              Open Banking is regulated by the FCA under the Payment Services Regulations. Sigma Lending receives read-only transactional statements to verify the £{Number(turnover).toLocaleString()} turnover. We cannot initiate payments or view login passwords.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: DIRECTOR ID CHECK (eKYC) */}
                      {currentStep === 3 && (
                        <div className="space-y-8">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-100 border border-burgundy-200 text-[11px] font-bold uppercase tracking-wider text-burgundy-900 mb-2">
                              <span>Step 03 of 04</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-850">
                              Verify Appointed Director Identity
                            </h2>
                            <p className="text-sm text-ink-600 mt-1">
                              Companies House records indicate registered officers for <span className="font-bold text-ink-850">{companySearch}</span>. Confirm the signing director details below.
                            </p>
                          </div>

                          <div className="bg-burgundy-50 p-6 rounded-2xl border border-burgundy-200 space-y-4">
                            <div>
                              <label className="text-xs font-bold text-ink-850">Primary Appointed Director</label>
                              <input
                                type="text"
                                value={directorName}
                                onChange={(e) => setDirectorName(e.target.value)}
                                placeholder="Enter full name of primary appointed director"
                                required
                                className="w-full mt-1 px-4 py-3 rounded-xl border border-burgundy-200 bg-white text-sm font-bold text-ink-850 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-ink-600">Filing Status:</span>
                                <span className="block font-bold text-emerald-700">Active Officer</span>
                              </div>
                              <div>
                                <span className="text-ink-600">CRN Registration:</span>
                                <span className="block font-bold font-mono text-ink-850">{crn}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={handleVerifyDirector}
                              disabled={isSubmitting}
                              className="w-full py-4 rounded-full bg-burgundy-900 hover:bg-burgundy-800 disabled:opacity-50 text-white font-bold text-base shadow-lg transition flex items-center justify-center gap-2"
                            >
                              <span>{isSubmitting ? 'Verifying Identity...' : 'Confirm Director & View Facility Offer'}</span>
                              <ArrowRight className="w-5 h-5" />
                            </button>
                            <p className="text-center text-xs text-ink-600">
                              Executing non-damaging automated biometric eKYC review.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* STEP 4: DECISION & PAYOUT CONFIRMATION */}
                      {currentStep === 4 && (
                        <div className="space-y-8 text-center py-6">
                          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                            <Check className="w-10 h-10 stroke-[3]" />
                          </div>

                          <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                              Approval Granted • Same-Day Disbursement
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-850">
                              Congratulations! Your £{Number(fundingAmount).toLocaleString()} Facility is Ready
                            </h2>
                            <p className="text-sm text-ink-600 max-w-lg mx-auto">
                              Reference: <span className="font-mono font-bold text-burgundy-900">{savedApplication?.referenceCode || 'SIG-2026-APX94'}</span>. Your commercial credit agreement has been generated and approved.
                            </p>
                          </div>

                          <div className="max-w-md mx-auto bg-burgundy-50 p-6 rounded-2xl border border-burgundy-200 text-left space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-ink-600">Borrower Company:</span>
                              <span className="font-bold text-ink-850">{companySearch}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-ink-600">Companies House CRN:</span>
                              <span className="font-mono font-bold text-ink-850">{crn}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-ink-600">Connected Bank:</span>
                              <span className="font-bold text-ink-850">{selectedBank || 'Barclays Open Banking'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-ink-600">Underwritten Term:</span>
                              <span className="font-bold text-ink-850">{estimate.indicativeTermMonths} Months</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-ink-600">Early Settlement Fee:</span>
                              <span className="font-bold text-emerald-700">£0.00</span>
                            </div>
                            <div className="pt-2 border-t border-burgundy-200 flex justify-between text-base font-extrabold">
                              <span className="text-ink-850">Disbursement Amount:</span>
                              <span className="text-burgundy-900">£{Number(fundingAmount).toLocaleString()} GBP</span>
                            </div>
                          </div>

                          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                              onClick={() => alert(`Digital agreement e-signature package sent for ${companySearch}. Funds scheduled for wire via Faster Payments.`)}
                              className="px-8 py-4 rounded-full bg-burgundy-900 hover:bg-burgundy-800 text-white font-bold text-sm shadow-md transition"
                            >
                              E-Sign Digital Credit Agreement
                            </button>
                            <button
                              onClick={() => setCurrentView('home')}
                              className="px-6 py-4 rounded-full border border-burgundy-200 bg-white hover:bg-burgundy-50 text-ink-850 font-bold text-sm transition"
                            >
                              Return to Home
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SUPPORTED INSTITUTIONS FOOTER RAIL */}
                      <div className="pt-8 border-t border-burgundy-100 space-y-3">
                        <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-ink-600">
                          Direct Open Banking Integration Across Leading UK Institutions
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-ink-600/70">
                          <span>BARCLAYS</span>
                          <span>•</span>
                          <span>HSBC</span>
                          <span>•</span>
                          <span>NatWest</span>
                          <span>•</span>
                          <span>LLOYDS</span>
                          <span>•</span>
                          <span>Santander</span>
                          <span>•</span>
                          <span>Monzo</span>
                          <span>•</span>
                          <span>Revolut</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: DYNAMIC LIVE ESTIMATION SIDEBAR (Col 9-12) */}
                    <div className="lg:col-span-4 space-y-6">

                      {/* 1. LIVE ESTIMATE CARD (Dark Card matching Figma layout) */}
                      <div className="bg-ink-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-ink-800 space-y-6 relative overflow-hidden">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-200/80">Estimated Facility</span>
                            <div className="text-3xl font-extrabold text-burgundy-400">
                              £{Number(fundingAmount).toLocaleString()}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-burgundy-400">
                            <Banknote className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-burgundy-200/80">Indicative Term:</span>
                            <span className="font-bold text-white">{estimate.indicativeTermMonths} Months</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-burgundy-200/80">Early Repayment Penalty:</span>
                            <span className="font-bold text-emerald-400">{estimate.earlyRepaymentPenalty}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-burgundy-200/80">Approval Timeline:</span>
                            <span className="font-bold text-white">{estimate.approvalTimeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-burgundy-200/80">Disbursement Target:</span>
                            <span className="font-bold text-burgundy-300">{estimate.disbursementTarget}</span>
                          </div>
                        </div>

                        {/* Financial Health Ring Gauge Micro-Visual */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-white/20"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-emerald-400"
                                strokeDasharray={`${estimate.approvalScore}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <span className="absolute text-xs font-extrabold text-white">{estimate.approvalScore}%</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white">{estimate.approvalBand}</span>
                            <span className="text-[11px] text-burgundy-200/70">Turnover matches tier 1 criteria</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. VERIFIED BORROWER TESTIMONIAL (Matching Figma Sarah Jenkins card) */}
                      <div className="bg-white rounded-3xl p-6 border border-burgundy-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-burgundy-900 text-white flex items-center justify-center font-bold text-sm">
                            SJ
                          </div>
                          <div>
                            <span className="block font-bold text-sm text-ink-850">Sarah Jenkins</span>
                            <span className="block text-xs text-ink-600">Founder, Flour & Hearth (Bristol)</span>
                          </div>
                        </div>
                        <p className="text-xs text-ink-600 italic leading-relaxed">
                          “Applying through Sigma was night and day compared to our high street bank. We connected Open Banking at 10am and had £45k in our account by 4pm to secure equipment.”
                        </p>
                        <div className="pt-2 border-t border-burgundy-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>£45,000 Unsecured Working Capital Funded</span>
                        </div>
                      </div>

                      {/* 3. TRUST BADGES & FCA COMPLIANCE BOX */}
                      <div className="bg-blush-50 rounded-2xl p-5 border border-burgundy-200 space-y-2 text-xs text-ink-600">
                        <div className="flex items-center gap-2 font-bold text-ink-850">
                          <ShieldCheck className="w-4 h-4 text-burgundy-900" />
                          <span>UK Regulatory Compliance</span>
                        </div>
                        <p className="leading-relaxed text-[11px]">
                          Sigma Lending Ltd is registered with the Financial Conduct Authority under reference 1009680 for anti-money laundering supervision and with the ICO (ZB61147).
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
}

