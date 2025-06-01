'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import TouchNavigation from './TouchNavigation';
import OverviewSection from './OverviewSection';
import BasinVisualization from './BasinVisualization';
import StatusPanel from './StatusPanel';
import SystemStatus from './SystemStatus';
import FingerprintModal from './FingerprintModal';
import FeedingPanel from './FeedingPanel';

const Dashboard = () => {
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Visa modalen automatiskt när komponenten laddas
  useEffect(() => {
    setShowFingerprintModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowFingerprintModal(false);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'matning':
        return (
          <div className="max-w-[3840px] mx-auto">
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-320px)]">
              <div className="col-span-12">
                <FeedingPanel />
              </div>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="max-w-[3840px] mx-auto">
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-320px)]">
              {/* Vänster kolumn - Översikt och nödstopp */}
              <div className="col-span-3 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                <OverviewSection />
              </div>

              {/* Mitten - Bassäng visualisering (2 kolumner) */}
              <div className="col-span-6">
                <BasinVisualization />
              </div>

              {/* Höger kolumn - Status och mätningar */}
              <div className="col-span-3 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                <StatusPanel />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2a] via-[#1a2332] to-[#0f1419] relative overflow-hidden">
      {/* Bakgrundseffekter */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Touch Navigation */}
      <TouchNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="pt-56 pb-20 px-4 relative z-10">
        {renderMainContent()}
      </main>

      {/* System Status (fast positionerad) */}
      <SystemStatus />

      {/* Fingerprint Modal */}
      <FingerprintModal 
        isOpen={showFingerprintModal} 
        onClose={handleCloseModal} 
      />

      {/* Ytterligare visuella effekter */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-24 grid-rows-12 h-full w-full">
            {[...Array(288)].map((_, i) => (
              <div 
                key={i} 
                className="border border-accent/20"
                style={{
                  animationDelay: `${(i % 24) * 0.1}s`,
                  animation: 'pulse 4s infinite'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animation: `float ${5 + Math.random() * 10}s infinite linear`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Dashboard;