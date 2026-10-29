import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-burgundy-950 text-burgundy-100/90 pt-16 pb-12 border-t border-burgundy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-burgundy-900/80">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <span className="font-extrabold text-xl">Σ</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">Sigma Lending</span>
            </div>
            <p className="text-xs leading-relaxed text-burgundy-200/80">
              Direct UK commercial funding and unsecured growth facilities designed exclusively for viable limited enterprises and SMEs.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>FCA Regulated & AML Supervised</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Borrower Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setCurrentView('home')} 
                  className="hover:text-white transition"
                >
                  Unsecured Business Loans
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('apply')} 
                  className="hover:text-white transition"
                >
                  Start Fast-Track Application
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('partners')} 
                  className="hover:text-white transition"
                >
                  Commercial Broker Portal
                </button>
              </li>
              <li>
                <span className="text-burgundy-200/50 cursor-not-allowed">Open Banking Security</span>
              </li>
            </ul>
          </div>

          {/* Facilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Commercial Products
            </h4>
            <ul className="space-y-2 text-sm text-burgundy-200/80">
              <li>£5k to £150k Working Capital</li>
              <li>Stock & Inventory Purchasing</li>
              <li>Commercial Equipment Finance</li>
              <li>VAT & Corporation Tax Funding</li>
              <li>Same-Day Disbursement SLA</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              UK Underwriting Desk
            </h4>
            <p className="text-sm">
              <span className="block text-white font-bold">Direct Phone:</span>
              <a href="tel:02079460880" className="text-burgundy-300 hover:text-white font-mono">
                020 7946 0880
              </a>
            </p>
            <p className="text-xs text-burgundy-200/80">
              Operating Mon – Fri, 08:30 – 18:00 GMT<br />
              London Commercial Trading Office
            </p>
            <div className="flex items-center gap-2 text-[11px] text-burgundy-200/60 pt-2">
              <Lock className="w-3.5 h-3.5 text-burgundy-300" />
              <span>256-Bit SSL Encrypted Sessions</span>
            </div>
          </div>
        </div>

        {/* Regulatory Bottom Box */}
        <div className="pt-8 space-y-4 text-xs text-burgundy-200/70 leading-relaxed">
          <p>
            Sigma Lending Ltd is registered with the Financial Conduct Authority under reference 1009680 for anti-money laundering supervision and holds registration with the Information Commissioner's Office (ICO: ZB61147). Sigma Lending operates strictly within commercial SME lending parameters. Decisions are subject to status, financial verification, and standard AML/KYC checks. Borrowing responsibly is essential for commercial enterprise longevity.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-burgundy-900/60 text-[11px]">
            <p>© {new Date().getFullYear()} Sigma Lending Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6 text-burgundy-300">
              <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-white transition">Terms of Service</a>
              <span>•</span>
              <a href="#fca" className="hover:text-white transition">FCA Credentials</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

