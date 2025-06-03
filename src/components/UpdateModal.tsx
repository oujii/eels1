'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface UpdateModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

type UpdateStep = 'intro' | 'license' | 'features' | 'installation' | 'complete';

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<UpdateStep>('intro');
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [featureCarouselStarted, setFeatureCarouselStarted] = useState(false);
  const [featureCarouselCompleted, setFeatureCarouselCompleted] = useState(false);
  const [backgroundInstallStarted, setBackgroundInstallStarted] = useState(false);

  const features = [
    {
      title: "Förbättrad Nätvisualisering",
      description: "Ny 3D-visualisering av nätstationer med realtidsdata och förbättrad användarupplevelse för bättre överblick över alla aktiva nät.",
      image: "/1.png"
    },
    {
      title: "Automatisk Djupkontroll",
      description: "Intelligent djupkontrollsystem som automatiskt justerar nätdjup baserat på vattenförhållanden och ålbeteende för optimal fångst.",
      image: "/2.png"
    }
  ];

  const licenseText = `LICENSAVTAL FÖR ÅLCONTROL MATNINGSMODUL v2.0

1. ALLMÄNNA VILLKOR OCH DEFINITIONER
Denna programvara ("Programvaran") tillhandahålls "som den är" utan garantier av något slag, varken uttryckliga eller underförstådda, inklusive men inte begränsat till garantier för säljbarhet, lämplighet för ett visst ändamål och icke-intrång. Användaren ("Licenstagaren") accepterar alla risker förknippade med användningen av denna programvara. "ÅlControl" avser det kompletta systemet för ålodling och matningshantering. "Matningsmodul" avser den specifika komponenten som hanterar automatiserad matning av ålar i odlingssystem.

2. ANVÄNDARRÄTTIGHETER OCH BEGRÄNSNINGAR
Licenstagaren beviljas en icke-exklusiv, icke-överförbar, återkallelig licens att använda Programvaran i enlighet med dessa villkor. Denna licens gäller endast för den specifika installation och får inte överföras till andra system utan skriftligt tillstånd från Licensgivaren. Användningen är begränsad till kommersiell ålodling och får inte användas för forskningsändamål utan separat avtal.

3. STRIKTA BEGRÄNSNINGAR OCH FÖRBUD
Licenstagaren får under inga omständigheter:
- Dekompilera, reverse-engineera, disassemblera eller på annat sätt försöka härleda källkoden
- Distribuera, sälja, hyra ut, låna ut eller på annat sätt överföra Programvaran
- Använda Programvaran för olagliga ändamål eller i strid med gällande miljölagstiftning
- Modifiera, anpassa eller skapa härledda verk baserade på Programvaran
- Kringgå eller inaktivera säkerhetsmekanismer eller kopieringsskydd
- Använda Programvaran i konkurrerande produkter eller tjänster
- Extrahera eller isolera delar av Programvaran för användning i andra system

4. OMFATTANDE DATAINSAMLING OCH ÖVERVAKNING
Programvaran samlar kontinuerligt in detaljerad data om:
- Alla användarinteraktioner och systemkommandon
- Prestanda- och användningsstatistik
- Systemkonfiguration och hårdvaruinformation
- Geografisk plats och nätverksaktivitet
- Biometriska data från säkerhetssystem
- Video- och ljudinspelningar från övervakningskameror
- Kommunikation mellan användare och system
Denna data kan delas med tredje parter för analys, marknadsföring och säkerhetsändamål.

5. AUTOMATISKA UPPDATERINGAR OCH FJÄRRÅTKOMST
Licensgivaren förbehåller sig rätten att:
- Installera automatiska uppdateringar utan förvarning
- Fjärrstyra och övervaka systemet
- Samla in diagnostikdata i realtid
- Inaktivera funktioner eller hela systemet vid behov
- Ändra licensvillkor med omedelbar verkan
- Komma åt alla filer och data på systemet

6. OMFATTANDE ANSVARSBEGRÄNSNING
Licensgivaren ansvarar under inga omständigheter för:
- Direkta, indirekta, tillfälliga eller följdskador
- Förlust av data, vinst eller affärsmöjligheter
- Avbrott i verksamheten eller systemfel
- Skador på ålar eller odlingsutrustning
- Miljöskador eller föroreningar
- Personskador eller dödsfall
- Juridiska konsekvenser av systemfel
- Säkerhetsincidenter eller dataintrång

Licenstagaren håller Licensgivaren skadeslös för alla anspråk som kan uppstå.

7. UPPSÄGNING OCH KONSEKVENSER
Denna licens kan sägas upp omedelbart av Licensgivaren vid:
- Brott mot licensvillkoren
- Utebliven betalning
- Konkursbeslut eller likvidation
- Ändring av ägarförhållanden
- Misstanke om missbruk

Vid uppsägning måste all Programvara omedelbart avinstalleras och förstöras.

8. TILLÄMPLIG LAG OCH JURISDIKTION
Detta avtal styrs av svensk lag utan hänsyn till lagvalsregler. Alla tvister ska avgöras av svensk domstol med Stockholm som första instans. Licenstagaren avstår från rätten till jury och samgrupptalan.

9. SÄKERHETSBESTÄMMELSER
Licenstagaren förbinder sig att:
- Implementera lämpliga säkerhetsåtgärder
- Rapportera säkerhetsincidenter inom 24 timmar
- Tillåta säkerhetsrevisioner när som helst
- Utbilda all personal i säkerhetsrutiner
- Följa alla branschstandarder för cybersäkerhet

10. MILJÖANSVAR
Licenstagaren ansvarar för att användningen av Programvaran sker i enlighet med alla miljölagar och förordningar. Eventuella miljöskador till följd av systemfel är Licenstagaren ansvar.

11. FORCE MAJEURE
Licensgivaren ansvarar inte för förseningar eller fel som beror på omständigheter utanför rimlig kontroll, inklusive naturkatastrofer, krig, terrorism, pandemier eller myndighetsbeslut.

12. HELA AVTALET
Detta licensavtal utgör hela avtalet mellan parterna och ersätter alla tidigare överenskommelser. Ändringar måste göras skriftligt och undertecknas av båda parter.

Genom att acceptera dessa villkor bekräftar Licenstagaren att ha läst, förstått och godkänt alla punkter i detta omfattande licensavtal samt att ha juridisk behörighet att ingå detta avtal.`;

  // Auto-play feature carousel
  useEffect(() => {
    if (currentStep === 'features' && !featureCarouselCompleted) {
      const interval = setInterval(() => {
        setCurrentFeature(prev => {
          const next = (prev + 1) % features.length;
          if (next === 0) {
            // Completed one full cycle
            setFeatureCarouselCompleted(true);
            clearInterval(interval);
          }
          return next;
        });
      }, 3000); // Change every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [currentStep, featureCarouselCompleted, features.length]);

  // Start background installation during feature carousel
  useEffect(() => {
    if (currentStep === 'features' && !backgroundInstallStarted) {
      const timer = setTimeout(() => {
        setBackgroundInstallStarted(true);
      }, 2000); // Start after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, backgroundInstallStarted]);

  // Simulate erratic installation progress
  useEffect(() => {
    if (backgroundInstallStarted || currentStep === 'installation') {
      const interval = setInterval(() => {
        setInstallProgress(prev => {
          if (prev < 15) {
            return prev + Math.random() * 2; // Very slow start
          } else if (prev < 90) {
            return 90; // Sudden jump to 90%
          } else {
            return 90; // Stuck at 90%
          }
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [backgroundInstallStarted, currentStep]);

  // Auto-advance from installation to complete after being stuck
  useEffect(() => {
    if (currentStep === 'installation' && installProgress >= 90) {
      const timer = setTimeout(() => {
        setInstallProgress(100);
        setCurrentStep('complete');
      }, 8000); // Wait 8 seconds at 90% before completing
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, installProgress]);

  const handleNext = () => {
    switch (currentStep) {
      case 'intro':
        setCurrentStep('license');
        break;
      case 'license':
        if (licenseAccepted) {
          setCurrentStep('features');
          setCurrentFeature(0);
        }
        break;
      case 'features':
        if (featureCarouselCompleted) {
          setCurrentStep('installation');
        }
        break;
      case 'complete':
        onComplete();
        break;
    }
  };

  const canProceed = () => {
    if (currentStep === 'license') return licenseAccepted;
    if (currentStep === 'features') return featureCarouselCompleted;
    if (currentStep === 'installation') return false;
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay med backdrop blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0a1a2a]/90 via-[#1a2332]/90 to-[#0f1419]/90 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="relative bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {currentStep === 'intro' && 'Viktig uppdatering för Matningsmodulen'}
            {currentStep === 'license' && 'Licensavtal'}
            {currentStep === 'features' && 'Nya Fantastiska Funktioner'}
            {currentStep === 'installation' && 'Installerar uppdatering'}
            {currentStep === 'complete' && 'Uppdatering slutförd'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 'intro' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Välkommen till ÅlControl 2.0</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  En kritisk uppdatering krävs för Matningsmodulen för att säkerställa förbättrad prestanda, 
                  nya revolutionerande funktioner och optimal kompatibilitet med våra senaste system.
                </p>
                <p className="text-gray-400 mt-4">
                  Denna uppdatering innehåller viktiga säkerhetsförbättringar och prestandaoptimering.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'license' && (
            <div>
              <div className="bg-gray-800 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                  {licenseText}
                </pre>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="license-accept"
                  checked={licenseAccepted}
                  onChange={(e) => setLicenseAccepted(e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="license-accept" className="text-gray-300">
                  Jag har läst och godkänner villkoren i licensavtalet
                </label>
              </div>
            </div>
          )}

          {currentStep === 'features' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-full h-64 bg-gray-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                  <img 
                    src={features[currentFeature].image} 
                    alt={features[currentFeature].title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  {!featureCarouselCompleted && (
                    <div className="absolute top-2 right-2 text-xs text-yellow-400 animate-pulse">
                      Auto-uppspelning...
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 transition-all duration-500">
                  {features[currentFeature].title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed transition-all duration-500">
                  {features[currentFeature].description}
                </p>
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFeature ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              {backgroundInstallStarted && (
                <div className="mt-6 p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Steg 1 av 3: Initierar uppdatering...</span>
                    <span className="text-xs text-yellow-400">{Math.round(installProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${installProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'installation' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Installerar uppdatering för Matningsmodulen...
                </h3>
                <p className="text-gray-300 mb-6">
                  Vänligen vänta medan vi installerar de senaste förbättringarna. 
                  Denna process kan ta några minuter.
                </p>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${installProgress}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm">
                {Math.round(installProgress)}% slutfört
              </p>
              {installProgress >= 90 && (
                <div className="mt-4 p-3 bg-red-900 bg-opacity-50 rounded-lg border border-red-700">
                  <p className="text-red-400 text-sm font-semibold">
                    ⚠️ Installation har fastnat vid 90%
                  </p>
                  <p className="text-red-300 text-xs mt-1">
                    Detta är ett känt problem. Vänligen kontakta teknisk support.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Uppdatering slutförd!
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Matningsmodulen är nu optimerad och redo att användas med alla nya funktioner aktiverade. 
                  Du kan nu komma åt den förbättrade nätkontrollen.
                </p>
                <p className="text-green-400 mt-4 font-semibold">
                  Välkommen till framtiden för ålmatning!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {currentStep === 'features' && `${currentFeature + 1} av ${features.length}`}
            {currentStep === 'installation' && 'Installerar...'}
          </div>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === 'complete' ? 'Öppna Matningsmodul' : 'Nästa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;