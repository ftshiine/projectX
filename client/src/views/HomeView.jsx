import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Percent, 
  Building2, 
  FileCheck2, 
  Zap, 
  ChevronDown, 
  CheckCircle2, 
  CreditCard,
  Lock,
  Headphones
} from 'lucide-react';

const FAQS = [
  {
    q: 'What defines an "unsecured" business loan with Sigma?',
    a: 'Unlike traditional bank loans requiring physical commercial property charges or debentures on your company assets, our facilities are unsecured. Approvals are derived from your company\'s historical bank turnover and trading cashflows via Open Banking, rather than real estate collateral.',
  },
  {
    q: 'How fast do funds reach our company bank account?',
    a: 'Once your eKYC identity check is completed and the digital credit agreement is electronically signed, approved funds are disbursed automatically via UK Faster Payments. Over 85% of borrowers receive funds within 24 hours of starting their application.',
  },
  {
    q: 'Can I repay the facility early without paying exit fees?',
    a: 'Yes, absolutely. Sigma enforces a strict £0 early settlement penalty policy. If your receivables land ahead of forecast or your cashflow surges, you can pay off the facility in full at any time without punitive break charges.',
  },
  {
    q: 'Does checking my loan options impact my credit file?',
    a: 'No. Submitting your business information and connecting Open Banking executes a soft credit footprint only. This has zero impact on your commercial credit score or ability to obtain credit elsewhere.',
  },
  {
    q: 'What documents do I need to supply to apply?',
    a: 'Because we connect directly to Companies House and your bank via Open Banking, you rarely need to upload bulky paper statements or management accounts. Just have your company number (CRN) and online banking login handy.',
  },
];

export default function HomeView({ setCurrentView }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-burgundy-50 border-b border-burgundy-200/60">
        {/* Ambient Blur Graphics */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blush-200/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-burgundy-100/60 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-100 border border-burgundy-200 text-burgundy-900 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-burgundy-700 animate-pulse" />
                <span>Direct UK Commercial Funding</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink-850 tracking-tight leading-[1.15]">
                Apply Today, <br />
                <span className="text-burgundy-900">Fund Your Big Idea</span> Tomorrow.
              </h1>

              <p className="text-lg text-ink-600 max-w-xl leading-relaxed">
                Fast, fair, unsecured commercial loans from £5,000 to £150,000. Connected via modern Open Banking for instant decisions with zero paper forms.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('apply')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-burgundy-900 hover:bg-burgundy-800 text-white font-bold text-base shadow-lg shadow-burgundy-900/25 active:scale-95 transition"
                >
                  <span>Start Online Application</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href="tel:02079460880"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-burgundy-50 text-burgundy-900 border border-burgundy-200 font-bold text-base transition"
                >
                  <Headphones className="w-4 h-4 text-burgundy-700" />
                  <span>Talk With UK Specialist</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-ink-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Soft Search Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-burgundy-700" />
                  <span>256-Bit Bank Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-burgundy-700" />
                  <span>FCA Supervised</span>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Quick Estimator Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-8 border border-burgundy-200 shadow-xl shadow-burgundy-900/5 relative">
                <div className="flex items-center justify-between pb-6 border-b border-burgundy-100">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-burgundy-700">Instant Estimate Preview</span>
                    <h3 className="text-2xl font-extrabold text-ink-850">£50,000 Facility</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    88% Approval Tier
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ink-600">Indicative Duration:</span>
                    <span className="font-bold text-ink-850">12 – 36 Months</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ink-600">Early Repayment Penalty:</span>
                    <span className="font-bold text-emerald-700">£0 (Zero Exit Fees)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ink-600">Underwriting Speed:</span>
                    <span className="font-bold text-ink-850">Under 4 Hours</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ink-600">Disbursement SLA:</span>
                    <span className="font-bold text-burgundy-700">Same Working Day</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('apply')}
                  className="w-full py-3.5 rounded-full bg-burgundy-900 hover:bg-burgundy-800 text-white font-bold text-sm shadow-md transition"
                >
                  Configure Your Business Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC SLA COUNTER STRIP */}
      <section className="bg-white py-12 border-b border-burgundy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left border-l-2 border-burgundy-700 pl-4">
              <span className="block text-4xl sm:text-5xl font-extrabold text-burgundy-900 tracking-tight">24h</span>
              <span className="block text-sm font-bold text-ink-850 mt-1">Disbursement SLA</span>
              <span className="text-xs text-ink-600">Direct UK Faster Payments</span>
            </div>
            <div className="text-center md:text-left border-l-2 border-burgundy-700 pl-4">
              <span className="block text-4xl sm:text-5xl font-extrabold text-burgundy-900 tracking-tight">£150k</span>
              <span className="block text-sm font-bold text-ink-850 mt-1">Maximum Unsecured</span>
              <span className="text-xs text-ink-600">Zero physical charge on freehold</span>
            </div>
            <div className="text-center md:text-left border-l-2 border-burgundy-700 pl-4">
              <span className="block text-4xl sm:text-5xl font-extrabold text-burgundy-900 tracking-tight">92%</span>
              <span className="block text-sm font-bold text-ink-850 mt-1">Approval Velocity</span>
              <span className="text-xs text-ink-600">High acceptance for trading SMEs</span>
            </div>
            <div className="text-center md:text-left border-l-2 border-burgundy-700 pl-4">
              <span className="block text-4xl sm:text-5xl font-extrabold text-burgundy-900 tracking-tight">£0</span>
              <span className="block text-sm font-bold text-ink-850 mt-1">Early Exit Penalty</span>
              <span className="text-xs text-ink-600">Settle whenever cashflow allows</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 VALUE PILLARS: THE SIGMA DIFFERENCE */}
      <section className="py-20 bg-burgundy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700">The Sigma Difference</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-850 mt-2">
              Making unsecured small business loans simple
            </h2>
            <p className="text-ink-600 text-sm mt-3">
              We stripped out the endless bank branches, archaic paperwork, and rigid scoring committees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-burgundy-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-burgundy-900 flex items-center justify-center text-white mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-ink-850 mb-3">Applications taking too long?</h3>
              <p className="text-sm text-ink-600 leading-relaxed">
                Say goodbye to laborious paper forms and weeks of waiting. Connect your accounts securely and receive simple funding decisions in minutes.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-burgundy-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-burgundy-900 flex items-center justify-center text-white mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-ink-850 mb-3">Funds arriving too slowly?</h3>
              <p className="text-sm text-ink-600 leading-relaxed">
                Just 24 hours from successful application to disbursement means you are never kept waiting when commercial opportunities knock.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-burgundy-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-burgundy-900 flex items-center justify-center text-white mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-ink-850 mb-3">Lack of support from your bank?</h3>
              <p className="text-sm text-ink-600 leading-relaxed">
                Funding has never been easier with transparent approvals, accessible UK decision makers, and simple, flexible repayment schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="py-20 bg-white border-t border-burgundy-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700">Everything You Need To Know</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-850 mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-ink-600 mt-2">
              Clear, jargon-free answers regarding our UK commercial lending facilities.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-burgundy-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-ink-850 hover:bg-burgundy-50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-burgundy-700 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-ink-600 leading-relaxed border-t border-burgundy-100 bg-burgundy-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM HIGH-VOLTAGE CTA SECTION */}
      <section className="py-20 bg-burgundy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-ink-850 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Glowing Burgundy Orbs */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-burgundy-800/40 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-burgundy-700/40 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-400">Ready in Minutes</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Apply Today, Fund Your Big Idea Tomorrow
              </h2>
              <p className="text-sm sm:text-base text-burgundy-200/80 leading-relaxed">
                Join thousands of ambitious UK small businesses leveraging agile unsecured funding to stay ahead. Quick application, instant estimate, zero obligations.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentView('apply')}
                  className="px-8 py-4 rounded-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold text-sm tracking-wide uppercase shadow-lg shadow-burgundy-900/40 active:scale-95 transition"
                >
                  Start Online Application
                </button>
                <a
                  href="tel:02079460880"
                  className="px-8 py-4 rounded-full border border-white/30 hover:bg-white/10 text-white font-bold text-sm tracking-wide uppercase transition"
                >
                  Talk With UK Specialist
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

