import React from 'react';
import { ShieldCheck, Phone, ArrowUpRight } from 'lucide-react';

export default function Header({ currentView, setCurrentView }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-burgundy-200/50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-burgundy-900 flex items-center justify-center text-white shadow-md shadow-burgundy-900/20 group-hover:bg-burgundy-800 transition">
              <span className="font-extrabold text-2xl tracking-tighter">Σ</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-ink-850 group-hover:text-burgundy-900 transition">
                Sigma Lending
              </span>
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-burgundy-700">
                Commercial Capital UK
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                currentView === 'home'
                  ? 'bg-blush-100 text-burgundy-900 font-bold'
                  : 'text-ink-600 hover:text-burgundy-900 hover:bg-burgundy-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('apply')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                currentView === 'apply'
                  ? 'bg-blush-100 text-burgundy-900 font-bold'
                  : 'text-ink-600 hover:text-burgundy-900 hover:bg-burgundy-50'
              }`}
            >
              Apply Online
            </button>
            <button
              onClick={() => setCurrentView('partners')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                currentView === 'partners'
                  ? 'bg-blush-100 text-burgundy-900 font-bold'
                  : 'text-ink-600 hover:text-burgundy-900 hover:bg-burgundy-50'
              }`}
            >
              Brokers & Partners
            </button>
          </nav>

          {/* Action Module */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="tel:02079460880"
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-ink-600 hover:text-burgundy-900 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center text-burgundy-900">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>020 7946 0880</span>
            </a>

            <button
              onClick={() => setCurrentView('apply')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-900 hover:bg-burgundy-800 text-white font-bold text-sm shadow-md shadow-burgundy-900/20 active:scale-95 transition"
            >
              <span>Fast-Track Apply</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

