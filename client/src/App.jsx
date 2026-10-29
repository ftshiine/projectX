import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomeView from './views/HomeView.jsx';
import ApplyView from './views/ApplyView.jsx';
import PartnersView from './views/PartnersView.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-burgundy-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1">
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}
        {currentView === 'apply' && <ApplyView setCurrentView={setCurrentView} />}
        {currentView === 'partners' && <PartnersView setCurrentView={setCurrentView} />}
      </main>

      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}

