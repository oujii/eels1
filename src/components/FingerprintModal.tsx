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
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes spinBorder {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
  }
  .spinning-border {
    position: relative;
  }
  .spinning-border::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 1rem;
    padding: 3px;
    background: conic-gradient(from 0deg, transparent, #60a5fa, transparent);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    animation: spinBorder 2s linear infinite;
    z-index: -1;
  }
  .shake {
    animation: shake 0.6s ease-in-out;
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
  | 'success_reading'
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
  const [currentFooterMessage, setCurrentFooterMessage] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  
  const tips = [
    'Testa att vinkla fingret åt vänster.',
    'Försök placera fingertoppen mer centralt.',
    'Se till att fingret är rent och torrt.',
    'Tryck lite hårdare mot sensorn.',
    'Prova att rotera fingret något.'
  ];
  
  const footerMessages = [
    'Varje ål räknas i vår strävan efter excellens!',
    'ÅlControl: Helt enkelt elektrifierande! – En Användare',
    '...sätter standarden för framtidens ålhantering.',
    'Innovation genom tradition – ÅlControl™ levererar.',
    'Certifierad enligt ISO-9001 för akvatisk biomassa.'
  ];

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setModalState('waiting');
      setAttemptCount(0);
      setCurrentTip(0);
      setPassword('');
      setPasswordAttempts(0);
      setCurrentFooterMessage(0);
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

  // Automatisk cykling av footer-meddelanden
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFooterMessage((prev) => (prev + 1) % footerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [footerMessages.length]);

  const handleFingerprintClick = () => {
    if (modalState === 'waiting') {
      setModalState('success_reading');
      // Visa framgångsrik läsning i 3 sekunder innan fel börjar
      setTimeout(() => {
        setModalState('basic_error');
        setAttemptCount(1);
      }, 3000);
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
      // Första försöket - trigga shake animation
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setPassword('');
      }, 600);
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
      {/* Overlay med dashboard färgtema */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0a1a2a]/80 via-[#1a2332]/80 to-[#0f1419]/80 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Bakgrundstext med värdeord */}
      <div className="absolute bottom-8 right-8 pointer-events-none select-none">
        <div className="text-right space-y-2">
          <div className="text-8xl font-bold text-white/10 leading-none tracking-wider">
            INNOVATION
          </div>
          <div className="text-7xl font-bold text-blue-400/15 leading-none tracking-wider">
            EFFEKTIVITET
          </div>
          <div className="text-6xl font-bold text-white/8 leading-none tracking-wider">
            SYNERGI
          </div>
          <div className="text-5xl font-bold text-blue-300/12 leading-none tracking-wider">
            SÄKERHET
          </div>
        </div>
      </div>
      
      {/* Modal innehåll */}
      <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-2xl shadow-2xl max-w-lg w-full mx-4 backdrop-blur-lg overflow-hidden select-none ${
        modalState === 'success_reading' 
          ? 'border-blue-400 spinning-border' 
          : 'border-slate-600'
      } ${isShaking ? 'shake' : ''}`}>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-800 px-8 py-6 border-b border-slate-600">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-blue-400 rounded-full mr-3 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">Å</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                ÅlControl™
              </h1>
            </div>
            <div className="space-y-1">
              <p className="text-xl text-blue-200 font-medium">
                Välkommen!
              </p>
              <p className="text-sm text-gray-300 font-light">
                Vänligen autentisera för systemåtkomst.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content Section - Fixed height to prevent layout shift */}
        <div className="px-8 py-8 text-center h-[400px] flex flex-col">
          {modalState === 'password_fallback' ? (
            // Lösenordsfallback UI
            <div className="flex flex-col justify-center h-full">
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
              
              {passwordAttempts === 2 && (
                <div className="mb-4 text-green-400 text-sm">
                  Lösenord accepterat!
                </div>
              )}
              
              <button
                onClick={handlePasswordSubmit}
                disabled={password.trim() === ''}
                className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Logga in
              </button>
            </div>
          ) : (
            // Fingeravtrycks UI med fast layout
            <div className="flex flex-col h-full">
              {/* Text ovanför fingeravtrycksikon - Fast höjd för att förhindra layout shift */}
              <div className="h-[120px] flex flex-col justify-center mb-6">
                {/* Titel - Fast höjd */}
                <div className="h-[32px] flex items-center justify-center mb-2">
                  <h2 className={`text-xl font-semibold transition-colors duration-300 ${
                    modalState === 'waiting' ? 'text-white' :
                    modalState === 'success_reading' ? 'text-blue-400' :
                    modalState === 'basic_error' || modalState === 'final_error' ? 'text-red-400' :
                    modalState === 'active_scanning' ? 'text-blue-400' :
                    modalState === 'calibrating' ? 'text-purple-400' :
                    modalState === 'calibration_complete' ? 'text-green-400' :
                    'text-white'
                  }`}>
                    {modalState === 'waiting' && 'Fingeravtrycksläsning'}
                    {modalState === 'success_reading' && 'Läser fingeravtryck...'}
                    {modalState === 'basic_error' && 'Fel: Kan inte läsa fingeravtryck.'}
                    {modalState === 'active_scanning' && 'Utför noggrannare analys...'}
                    {modalState === 'calibrating' && 'Systemet kalibrerar sensorn...'}
                    {modalState === 'calibration_complete' && 'Kalibrering slutförd. Försök igen.'}
                    {modalState === 'final_error' && 'Fingeravtryck ej igenkänt.'}
                  </h2>
                </div>
                
                {/* Beskrivning/tips - Fast höjd */}
                <div className="h-[48px] flex items-center justify-center">
                  {modalState === 'waiting' && (
                    <p className="text-gray-300">
                      Placera ditt finger på ikonen för att börja
                    </p>
                  )}
                  
                  {modalState === 'success_reading' && (
                    <p className="text-blue-300">
                      Håll fingret stilla under avläsning.
                    </p>
                  )}
                  
                  {modalState === 'basic_error' && (
                    <p className="text-yellow-300 text-sm animate-pulse">
                      {tips[currentTip]}
                    </p>
                  )}
                  
                  {modalState === 'active_scanning' && (
                    <p className="text-blue-300">
                      Försök hålla fingret stilla.
                    </p>
                  )}
                  
                  {modalState === 'final_error' && (
                    <p className="text-gray-300">
                      Övergår till alternativ inloggning...
                    </p>
                  )}
                </div>
                
                {/* Extra indikator för vissa states - Fast höjd */}
                <div className="h-[32px] flex items-center justify-center">
                  {modalState === 'success_reading' && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  )}
                  
                  {modalState === 'active_scanning' && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  )}
                  
                  {modalState === 'calibrating' && (
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }}></div>
                  )}
                </div>
              </div>
              
              {/* Fingeravtrycksikon - Fast position och storlek */}
              <div className="flex-1 flex items-center justify-center">
                <div 
                  className={`w-28 h-24 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 ${
                    modalState === 'waiting' || modalState === 'basic_error'
                      ? 'cursor-pointer border-gray-400 bg-gray-500/20 hover:border-blue-400 hover:bg-blue-500/20'
                      : modalState === 'success_reading'
                      ? 'border-blue-400 bg-blue-500/20 animate-pulse'
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
                        modalState === 'success_reading' ? 'text-blue-400' :
                        modalState === 'active_scanning' ? 'text-blue-400' :
                        modalState === 'calibrating' ? 'text-purple-400' :
                        modalState === 'calibration_complete' ? 'text-green-400' :
                        'text-red-400'
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 512 512"
                    >
                    <path d="M190.313,494.345c-2.116,0-4.242-0.759-5.935-2.293c-3.608-3.285-3.871-8.862-0.59-12.474
	l35.474-39.026c32.569-35.819,50.505-82.216,50.505-130.63v-36.267c0-4.871-3.961-8.828-8.828-8.828s-8.828,3.957-8.828,8.828
	v32.742c0,43.69-16.095,85.638-45.323,118.103l-36.392,40.439c-3.258,3.62-8.845,3.914-12.466,0.655
	c-3.625-3.258-3.918-8.845-0.655-12.466l36.392-40.439c26.302-29.224,40.789-66.966,40.789-106.293v-32.742
	c0-14.603,11.88-26.483,26.483-26.483s26.483,11.88,26.483,26.483v36.267c0,52.819-19.569,103.431-55.1,142.508l-35.474,39.026
	C195.106,493.37,192.715,494.345,190.313,494.345z"/>
<path d="M221.986,512c-2.116,0-4.242-0.759-5.935-2.293c-3.608-3.285-3.871-8.862-0.59-12.474l29.931-32.922
	c38.487-42.345,59.686-97.173,59.686-154.388v-36.267c0-24.337-19.801-44.138-44.138-44.138s-44.138,19.801-44.138,44.138v32.742
	c0,34.948-12.875,68.5-36.258,94.483l-25.87,28.75c-3.254,3.629-8.845,3.914-12.466,0.655c-3.625-3.258-3.918-8.845-0.655-12.466
	l25.87-28.75c20.457-22.733,31.724-52.095,31.724-82.673v-32.742c0-34.069,27.72-61.793,61.793-61.793s61.793,27.724,61.793,61.793
	v36.267c0,61.612-22.828,120.664-64.276,166.268l-29.935,32.922C226.779,511.026,224.387,512,221.986,512z"/>
<path d="M269.762,511.939c-2.116,0-4.242-0.759-5.931-2.293c-3.608-3.276-3.875-8.862-0.599-12.474
	l8.28-9.112c44.414-48.853,68.875-112.12,68.875-178.138v-36.266c0-43.81-35.642-79.448-79.448-79.448s-79.448,35.638-79.448,79.448
	v32.742c0,26.207-9.655,51.371-27.194,70.862l-23.297,25.888c-3.258,3.629-8.845,3.914-12.466,0.655
	c-3.625-3.258-3.918-8.845-0.655-12.466l23.297-25.888c14.612-16.242,22.659-37.207,22.659-59.052v-32.742
	c0-53.543,43.561-97.103,97.103-97.103s97.103,43.561,97.103,97.103v36.267c0,70.422-26.091,137.906-73.465,190.017l-8.276,9.112
	C274.558,510.966,272.163,511.939,269.762,511.939z"/>
<path d="M362.843,432.552c-1.081,0-2.182-0.199-3.25-0.621c-4.53-1.793-6.75-6.931-4.952-11.457
	c4.439-11.198,8.233-22.784,11.281-34.431c1.228-4.715,6.051-7.5,10.772-6.311c4.715,1.233,7.543,6.06,6.306,10.776
	c-3.224,12.337-7.242,24.604-11.944,36.466C369.68,430.44,366.361,432.552,362.843,432.552z"/>
<path d="M100.765,379.586c-2.103,0-4.215-0.75-5.901-2.268c-3.625-3.258-3.918-8.845-0.655-12.466
	l20.719-23.026c8.767-9.741,13.594-22.319,13.594-35.431c0-4.879,3.953-8.828,8.828-8.828c4.875,0,8.828,3.948,8.828,8.828
	c0,17.474-6.44,34.259-18.13,47.242l-20.719,23.026C105.588,378.603,103.184,379.586,100.765,379.586z"/>
<path d="M381.636,361.103c-0.405,0-0.81-0.025-1.216-0.086c-4.832-0.664-8.207-5.112-7.543-9.949
	c1.87-13.578,2.819-27.423,2.819-41.146v-36.267c0-32.457-13.897-63.561-38.121-85.336c-3.625-3.258-3.923-8.845-0.664-12.474
	c3.258-3.604,8.841-3.905,12.466-0.664c27.948,25.121,43.975,61.017,43.975,98.474v36.267c0,14.535-1.004,29.19-2.983,43.561
	C389.762,357.906,385.977,361.103,381.636,361.103z"/>
<path d="M137.352,282.483c-4.875,0-8.828-3.948-8.828-8.828c0-65.422,48.798-121.768,113.504-131.069
	c4.806-0.672,9.298,2.664,9.992,7.482c0.694,4.828-2.655,9.302-7.482,10.001c-56.073,8.052-98.358,56.888-98.358,113.587
	C146.18,278.535,142.227,282.483,137.352,282.483z"/>
<path d="M313.873,170.819c-1.271,0-2.564-0.276-3.789-0.853c-10.379-4.94-21.397-8.276-32.746-9.897
	c-4.823-0.698-8.177-5.164-7.482-9.992c0.69-4.836,5.121-8.199,9.992-7.491c13.112,1.879,25.836,5.725,37.823,11.431
	c4.405,2.103,6.272,7.371,4.177,11.767C320.335,168.966,317.171,170.819,313.873,170.819z"/>
<path d="M85.037,344.276c-2.103,0-4.215-0.75-5.901-2.268c-3.625-3.258-3.918-8.845-0.655-12.466
	l10.202-11.336c2.922-3.25,4.53-7.439,4.53-11.81v-32.742c0-42.879,16.233-83.715,45.711-114.974
	c3.345-3.552,8.927-3.724,12.479-0.371c3.548,3.345,3.711,8.931,0.366,12.474c-26.375,27.982-40.9,64.518-40.9,102.871v32.742
	c0,8.742-3.22,17.129-9.065,23.62l-10.202,11.336C89.861,343.293,87.456,344.276,85.037,344.276z"/>
<path d="M419.835,318.75c-4.875,0-8.828-3.948-8.828-8.828v-36.267c0-82.75-67.319-150.069-150.069-150.069
	c-2.815,0-5.612,0.086-8.388,0.233c-4.81,0.31-9.022-3.482-9.28-8.353c-0.258-4.871,3.478-9.026,8.349-9.284
	c3.086-0.163,6.194-0.25,9.319-0.25c92.483,0,167.724,75.242,167.724,167.724v36.267C428.663,314.802,424.71,318.75,419.835,318.75
	z"/>
<path d="M170.451,151.939c-2.793,0-5.539-1.319-7.254-3.785c-2.784-4-1.798-9.508,2.202-12.294
	c15.328-10.655,32.177-18.621,50.073-23.672c4.703-1.311,9.578,1.422,10.892,6.103c1.323,4.69-1.409,9.569-6.099,10.897
	c-16.004,4.509-31.073,11.629-44.78,21.173C173.947,151.431,172.188,151.939,170.451,151.939z"/>
<path d="M66.938,273.655c-0.138,0-0.271,0-0.405-0.009c-4.871-0.215-8.642-4.345-8.423-9.216
	c4.884-108.681,93.978-193.81,202.828-193.81c9.737,0,19.543,0.698,29.142,2.078c4.823,0.698,8.172,5.173,7.478,10.001
	c-0.698,4.828-5.194,8.163-9.996,7.482c-8.767-1.268-17.728-1.906-26.624-1.906c-99.383,0-180.733,77.725-185.19,176.948
	C75.537,269.956,71.628,273.655,66.938,273.655z"/>
<path d="M445.068,220.681c-3.69,0-7.125-2.327-8.366-6.008c-8.306-24.69-21.517-47-39.258-66.311
	c-3.297-3.595-3.06-9.173,0.526-12.474c3.599-3.31,9.176-3.06,12.474,0.526c19.426,21.146,33.892,45.578,42.991,72.621
	c1.556,4.621-0.931,9.63-5.551,11.19C446.951,220.534,445.999,220.681,445.068,220.681z"/>
<path d="M376.848,126.759c-1.836,0-3.69-0.569-5.271-1.759c-15.487-11.561-32.569-20.577-50.772-26.81
	c-4.612-1.578-7.073-6.603-5.495-11.215c1.578-4.612,6.591-7.043,11.211-5.492c19.944,6.828,38.659,16.707,55.616,29.379
	c3.91,2.914,4.712,8.448,1.793,12.353C382.196,125.535,379.537,126.759,376.848,126.759z"/>
<path d="M80.141,141.241c-1.906,0-3.823-0.612-5.44-1.879c-3.837-3-4.513-8.552-1.508-12.388
	c25.397-32.439,58.84-57.888,96.712-73.594c4.522-1.87,9.673,0.276,11.539,4.776s-0.271,9.664-4.771,11.534
	c-35.073,14.543-66.047,38.121-89.574,68.163C85.357,140.077,82.761,141.241,80.141,141.241z"/>
<path d="M426.408,123.586c-2.319,0-4.633-0.905-6.367-2.716c-42.06-43.785-98.564-67.905-159.103-67.905
	c-17.181,0-34.297,1.992-50.871,5.913c-4.755,1.121-9.504-1.802-10.625-6.552c-1.126-4.742,1.811-9.5,6.556-10.621
	c17.906-4.241,36.388-6.396,54.941-6.396c65.388,0,126.418,26.044,171.837,73.336c3.38,3.518,3.263,9.103-0.25,12.483
	C430.813,122.767,428.611,123.586,426.408,123.586z"/>
<path d="M384.525,48.301c-1.393,0-2.806-0.328-4.12-1.026c-8.147-4.31-16.574-8.207-25.047-11.586
	c-4.53-1.802-6.741-6.931-4.94-11.466c1.806-4.526,6.944-6.75,11.466-4.931c9.065,3.604,18.073,7.767,26.781,12.38
	c4.31,2.284,5.953,7.62,3.672,11.932C390.748,46.595,387.688,48.301,384.525,48.301z"/>
<path d="M146.184,43.828c-3.281,0-6.431-1.836-7.953-4.991c-2.121-4.388-0.28-9.664,4.113-11.785
	C179.528,9.103,219.429,0,260.939,0c21.63,0,43.172,2.543,64.03,7.561c4.742,1.146,7.659,5.913,6.517,10.655
	c-1.142,4.742-5.906,7.638-10.646,6.517c-19.509-4.698-39.66-7.078-59.901-7.078c-38.828,0-76.151,8.509-110.922,25.293
	C148.779,43.543,147.473,43.828,146.184,43.828z"/>
                  </svg>
                </div>
              </div>
            </div>
           )}
         </div>
         
         {/* Footer Section */}
         <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-t border-slate-600">
           {/* Corporate Values */}
           <div className="text-center mb-3">
             <p className="text-xs text-gray-400 font-medium tracking-wider">
               Innovation • Effektivitet • Synergi • Säkerhet
             </p>
           </div>
           
           {/* Rotating Corporate Messages */}
           <div className="text-center mb-3 h-4">
             <p className="text-xs text-blue-300 italic transition-opacity duration-1000" style={{ animation: 'fadeInOut 4s infinite' }}>
               {footerMessages[currentFooterMessage]}
             </p>
           </div>
           
           {/* Legal Text */}
           <div className="text-center">
             <p className="text-[10px] text-gray-500 leading-tight">
               Genom att försöka autentisera godkänner du ÅlControl™ Användaravtal (v.4.2 rev. B), vår Dataintegritetspolicy för Akvatisk Biomassa, samt EU-direktiv 2025/8C §12-14 gällande digital ål-övervakning. Fullständiga dokument finns på intranätet: dok.id ÅC-7345.
             </p>
           </div>
         </div>
       </div>
    </div>
  );
};

export default FingerprintModal;