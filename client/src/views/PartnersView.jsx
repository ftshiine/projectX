import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  ArrowRight, 
  Percent, 
  Users, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

export default function PartnersView({ setCurrentView }) {
  // Calculator State
  const [dealAmount, setDealAmount] = useState(50000);
  const [monthlyDeals, setMonthlyDeals] = useState(2);
  const [calcResult, setCalcResult] = useState({
    tier: 'Associate Introducer',
    baseRate: 2.5,
    estimatedCommission: 1250,
    annualProjectedCommission: 30000,
  });

  // Broker Registration Form State
  const [brokerName, setBrokerName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fcaNumber, setFcaNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Query Commission Calculator API
  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const res = await fetch(`/api/partners/calculator?dealAmount=${dealAmount}&monthlyDeals=${monthlyDeals}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) setCalcResult(json.data);
        }
      } catch (err) {
        console.error('Commission calc error:', err);
      }
    };
    fetchCommission();
  }, [dealAmount, monthlyDeals]);

  // Handle Partner Registration Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brokerName,
          firmName,
          email,
          phone,
          fcaNumber,
          monthlyDealVolume: Number(monthlyDeals),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setRegSuccess(true);
      } else {
        alert(json.message || 'Error registering partner');
      }
    } catch (err) {
      console.error(err);
      alert('Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 bg-burgundy-50 border-b border-burgundy-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-100 border border-burgundy-200 text-burgundy-900 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-burgundy-700" />
              <span>Commercial Broker & Introducer Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink-850 tracking-tight leading-tight">
              Better for Partners: <br />
              <span className="text-burgundy-900">High Commission, Rapid 24h Payouts.</span>
            </h1>

            <p className="text-lg text-ink-600 leading-relaxed">
              Introduce UK SME clients in minutes. We provide generous tiered commission structures, automated introducer links, and pragmatic underwriting that looks beyond balance sheets.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#calculator"
                className="px-8 py-4 rounded-full bg-burgundy-900 hover:bg-burgundy-800 text-white font-bold text-sm shadow-md transition"
              >
                Estimate Broker Commission
              </a>
              <a
                href="#register"
                className="px-8 py-4 rounded-full bg-white hover:bg-burgundy-50 text-burgundy-900 border border-burgundy-200 font-bold text-sm transition"
              >
                Register as an Introducer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP PROCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700">Transparent 4-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-850 mt-2">
              How the Partner Portal Works
            </h2>
            <p className="text-sm text-ink-600 mt-2">
              Seamless digital interaction designed so you can introduce clients in seconds and track progress every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-burgundy-50 rounded-3xl p-8 border border-burgundy-200 space-y-4">
              <span className="text-4xl font-extrabold text-burgundy-300">01</span>
              <h4 className="text-lg font-bold text-ink-850">Submit or Invite Client</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Upload 3 months bank statements or generate your bespoke introducer link allowing clients to self-apply under your tag.
              </p>
              <div className="text-[11px] font-bold text-burgundy-900 bg-white px-3 py-1 rounded-full border border-burgundy-200 inline-block">
                Time: 2 minutes
              </div>
            </div>

            <div className="bg-burgundy-50 rounded-3xl p-8 border border-burgundy-200 space-y-4">
              <span className="text-4xl font-extrabold text-burgundy-300">02</span>
              <h4 className="text-lg font-bold text-ink-850">Instant Assessment</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Our automated decision engine and credit underwriters assess turnover and serviceability with non-damaging soft credit pulls.
              </p>
              <div className="text-[11px] font-bold text-burgundy-900 bg-white px-3 py-1 rounded-full border border-burgundy-200 inline-block">
                Decision: 1 – 4 hours
              </div>
            </div>

            <div className="bg-burgundy-50 rounded-3xl p-8 border border-burgundy-200 space-y-4">
              <span className="text-4xl font-extrabold text-burgundy-300">03</span>
              <h4 className="text-lg font-bold text-ink-850">Offer & 24h Payout</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Formal credit contract delivered electronically. Once e-signed by borrower directors, funds disburse straight to their UK bank.
              </p>
              <div className="text-[11px] font-bold text-burgundy-900 bg-white px-3 py-1 rounded-full border border-burgundy-200 inline-block">
                Disbursement: 24 Hours
              </div>
            </div>

            <div className="bg-burgundy-50 rounded-3xl p-8 border border-burgundy-200 space-y-4">
              <span className="text-4xl font-extrabold text-burgundy-300">04</span>
              <h4 className="text-lg font-bold text-ink-850">Instant Broker Remittance</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Commission notification generates automatically on completion, transferred directly to your nominated firm account.
              </p>
              <div className="text-[11px] font-bold text-burgundy-900 bg-white px-3 py-1 rounded-full border border-burgundy-200 inline-block">
                Settlement: Automated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE COMMISSION CALCULATOR (Dark Section matching Figma) */}
      <section id="calculator" className="py-20 bg-ink-850 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy-400">
              Transparent Introducer Economics
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Commission Tiers & Estimator
            </h2>
            <p className="text-sm text-burgundy-200/80">
              Higher referral volume unlocks preferential revenue splits and custom white-label client applications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Sliders */}
            <div className="lg:col-span-6 bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span>Average Facility Size</span>
                  <span className="text-2xl text-burgundy-400 font-extrabold">£{dealAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={dealAmount}
                  onChange={(e) => setDealAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-burgundy-200/60 mt-1">
                  <span>£5k</span>
                  <span>£150k</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span>Expected Monthly Deals</span>
                  <span className="text-2xl text-burgundy-400 font-extrabold">{monthlyDeals} deals / mo</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={monthlyDeals}
                  onChange={(e) => setMonthlyDeals(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-burgundy-200/60 mt-1">
                  <span>1 deal</span>
                  <span>20+ deals</span>
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-burgundy-900 to-burgundy-950 rounded-3xl p-8 border border-burgundy-700 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-burgundy-200 font-bold">Your Status Tier</span>
                  <h3 className="text-2xl font-extrabold text-white">{calcResult.tier}</h3>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-400 font-bold text-xs border border-white/20">
                  {calcResult.baseRate}% Commission Rate
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-2xl">
                  <span className="block text-xs text-burgundy-200 font-medium">Per-Deal Commission:</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    £{Math.round(calcResult.estimatedCommission).toLocaleString()}
                  </span>
                </div>

                <div className="bg-black/20 p-4 rounded-2xl">
                  <span className="block text-xs text-burgundy-200 font-medium">Projected Annual Payout:</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    £{Math.round(calcResult.annualProjectedCommission).toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-burgundy-200/70 leading-relaxed">
                Commissions are credited automatically via UK BACS/Faster Payments on day of loan drawdown. Zero clawback on standard commercial facility amortization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BROKER ONBOARDING REGISTRATION FORM */}
      <section id="register" className="py-20 bg-burgundy-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-burgundy-200 shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700">Quick Introducer Signup</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-850">
                Join the Sigma Partner Network
              </h2>
              <p className="text-xs sm:text-sm text-ink-600">
                Get your unique referral link and direct line to a UK commercial desk underwriter.
              </p>
            </div>

            {regSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="text-xl font-bold text-ink-850">Welcome to the Network!</h3>
                <p className="text-xs text-ink-600">
                  Your introducer profile has been registered in MongoDB. Our partner manager will contact you with your live referral link and portal credentials.
                </p>
                <button
                  onClick={() => setRegSuccess(false)}
                  className="px-6 py-2.5 rounded-full bg-burgundy-900 text-white font-bold text-xs"
                >
                  Register Another Broker
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-850">Broker / Advisor Name</label>
                    <input
                      type="text"
                      value={brokerName}
                      onChange={(e) => setBrokerName(e.target.value)}
                      required
                      placeholder="e.g. James Campbell"
                      className="w-full px-4 py-3 rounded-xl border border-burgundy-200 bg-blush-50 text-sm text-ink-850 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-850">Brokerage / Firm Name</label>
                    <input
                      type="text"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      required
                      placeholder="e.g. Apex Commercial Finance Ltd"
                      className="w-full px-4 py-3 rounded-xl border border-burgundy-200 bg-blush-50 text-sm text-ink-850 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-850">Business Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="james@apexfinance.co.uk"
                      className="w-full px-4 py-3 rounded-xl border border-burgundy-200 bg-blush-50 text-sm text-ink-850 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-850">Direct Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="07700 900123"
                      className="w-full px-4 py-3 rounded-xl border border-burgundy-200 bg-blush-50 text-sm text-ink-850 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-850">FCA Registration Number (Optional)</label>
                  <input
                    type="text"
                    value={fcaNumber}
                    onChange={(e) => setFcaNumber(e.target.value)}
                    placeholder="e.g. 789456"
                    className="w-full px-4 py-3 rounded-xl border border-burgundy-200 bg-blush-50 text-sm font-mono text-ink-850 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-burgundy-900 hover:bg-burgundy-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition"
                >
                  {isSubmitting ? 'Submitting Partner Application...' : 'Activate Broker Portal Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

