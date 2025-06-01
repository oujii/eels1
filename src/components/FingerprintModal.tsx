'use client';

import React, { useState, useEffect } from 'react';

// CSS för progress animation och spinner
const progressStyle = `
  @keyframes progress {
    from { width: 0%; }
    to { width: 100%; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Lägg till styles i head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = progressStyle;
  document.head.appendChild(styleElement);
}

interface FingerprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = 
  | 'waiting'
  | 'basic_error'
  | 'active_scanning'
  | 'calibrating'
  | 'calibration_complete'
  | 'final_error'
  | 'password_fallback';

const FingerprintModal: React.FC<FingerprintModalProps> = ({ isOpen, onClose }) => {
  const [modalState, setModalState] = useState<ModalState>('waiting');
  const [showModal, setShowModal] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [password, setPassword] = useState('');
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  
  const tips = [
    'Testa att vinkla fingret åt vänster.',
    'Försök placera fingertoppen mer centralt.',
    'Se till att fingret är rent och torrt.',
    'Tryck lite hårdare mot sensorn.',
    'Prova att rotera fingret något.'
  ];

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setModalState('waiting');
      setAttemptCount(0);
      setCurrentTip(0);
      setPassword('');
      setPasswordAttempts(0);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  // Automatisk cykling av tips i basic_error state
  useEffect(() => {
    if (modalState === 'basic_error') {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [modalState, tips.length]);

  const handleFingerprintClick = () => {
    if (modalState === 'waiting') {
      setModalState('basic_error');
      setAttemptCount(1);
    } else if (modalState === 'basic_error') {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      
      if (newAttemptCount >= 3) {
        // Övergå till aktiv skanning efter 3 försök
        setModalState('active_scanning');
        setTimeout(() => {
          setModalState('calibrating');
          setTimeout(() => {
            setModalState('calibration_complete');
            setTimeout(() => {
              setModalState('final_error');
              setTimeout(() => {
                setModalState('password_fallback');
              }, 2000);
            }, 1500);
          }, 3000);
        }, 3000);
      }
    }
  };

  const handlePasswordSubmit = () => {
    if (password.trim() === '') return;
    
    const newPasswordAttempts = passwordAttempts + 1;
    setPasswordAttempts(newPasswordAttempts);
    
    if (newPasswordAttempts === 1) {
      // Första försöket - visa fel
      setTimeout(() => {
        setPassword('');
      }, 1500);
    } else {
      // Andra försöket - acceptera lösenord
      setTimeout(() => {
        onClose(); // Stäng modalen
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay - blockerar interaktion med bakgrunden */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Modal innehåll */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 backdrop-blur-lg">
        <div className="text-center">
          {modalState === 'password_fallback' ? (
            // Lösenordsfallback UI
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Alternativ inloggning
              </h2>
              <p className="text-gray-300 mb-4">
                Ange lösenord
              </p>
              
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Lösenord"
                  autoFocus
                />
              </div>
              
              <div className="mb-4 text-sm text-gray-400 italic">
                Hint: Min gamla hund Sussies favoritleksak från när hon var valp...?
              </div>
              
              {passwordAttempts === 1 && (
                <div className="mb-4 text-red-400 text-sm">
                  Fel lösenord.
                </div>
              )}
              
              {passwordAttempts === 2 && (
                <div className="mb-4 text-green-400 text-sm">
                  Lösenord accepterat!
                </div>
              )}
              
              <button
                onClick={handlePasswordSubmit}
                disabled={password.trim() === ''}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Skicka
              </button>
            </div>
          ) : (
            // Fingeravtrycks UI
            <div>
              {/* Text ovanför fingeravtrycksikon */}
              <div className="mb-6">
                {modalState === 'waiting' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Fingeravtrycksläsning
                    </h2>
                    <p className="text-gray-300">
                      Placera ditt finger på ikonen för att börja
                    </p>
                  </div>
                )}
                
                {modalState === 'basic_error' && (
                  <div>
                    <h2 className="text-xl font-semibold text-red-400 mb-2">
                      Fel: Kan inte läsa fingeravtryck.
                    </h2>
                    <p className="text-yellow-300 text-sm animate-pulse">
                      {tips[currentTip]}
                    </p>
                  </div>
                )}
                
                {modalState === 'active_scanning' && (
                  <div>
                    <h2 className="text-xl font-semibold text-blue-400 mb-2">
                      Utför noggrannare analys...
                    </h2>
                    <p className="text-blue-300">
                      Försök hålla fingret stilla.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {modalState === 'calibrating' && (
                  <div>
                    <h2 className="text-xl font-semibold text-purple-400 mb-2">
                      Systemet kalibrerar sensorn...
                    </h2>
                    <div className="flex justify-center items-center mt-4">
                      <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }}></div>
                    </div>
                  </div>
                )}
                
                {modalState === 'calibration_complete' && (
                  <div>
                    <h2 className="text-xl font-semibold text-green-400 mb-2">
                      Kalibrering slutförd. Försök igen.
                    </h2>
                  </div>
                )}
                
                {modalState === 'final_error' && (
                  <div>
                    <h2 className="text-xl font-semibold text-red-400 mb-2">
                      Fingeravtryck ej igenkänt.
                    </h2>
                    <p className="text-gray-300">
                      Övergår till alternativ inloggning...
                    </p>
                  </div>
                )}
              </div>
              
              {/* Fingeravtrycksikon */}
              <div className="mb-6">
                <div 
                  className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                    modalState === 'waiting' || modalState === 'basic_error'
                      ? 'cursor-pointer border-gray-400 bg-gray-500/20 hover:border-blue-400 hover:bg-blue-500/20'
                      : modalState === 'active_scanning'
                      ? 'border-blue-400 bg-blue-500/20 animate-pulse'
                      : modalState === 'calibrating'
                      ? 'border-purple-400 bg-purple-500/20 animate-pulse'
                      : modalState === 'calibration_complete'
                      ? 'border-green-400 bg-green-500/20'
                      : 'border-red-400 bg-red-500/20'
                  }`}
                  onClick={modalState === 'waiting' || modalState === 'basic_error' ? handleFingerprintClick : undefined}>
                  <svg 
                      className={`w-12 h-12 transition-colors duration-500 ${
                        modalState === 'waiting' || modalState === 'basic_error' ? 'text-gray-400' :
                        modalState === 'active_scanning' ? 'text-blue-400' :
                        modalState === 'calibrating' ? 'text-purple-400' :
                        modalState === 'calibration_complete' ? 'text-green-400' :
                        'text-red-400'
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-2.04-1.34-3.28 0-1.24.47-2.41 1.34-3.28.87-.87 2.04-1.34 3.28-1.34 1.24 0 2.41.47 3.28 1.34.87.87 1.34 2.04 1.34 3.28 0 1.24-.47 2.41-1.34 3.28-.09.1-.22.15-.35.15s-.26-.05-.35-.15c-.19-.19-.19-.51 0-.71.68-.68 1.05-1.58 1.05-2.57s-.37-1.88-1.05-2.56c-.68-.68-1.58-1.05-2.57-1.05s-1.88.37-2.56 1.05c-.68.68-1.05 1.58-1.05 2.56s.37 1.88 1.05 2.56c.19.2.19.52 0 .71-.1.1-.23.15-.35.15z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FingerprintModal;