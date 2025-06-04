'use client';

import React, { useState, useEffect, useRef } from 'react';

interface UpdateModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

type UpdateStep = 'intro' | 'license' | 'featuresAndInstallation' | 'complete';

// Step title mapping for dynamic header
const getStepTitle = (step: UpdateStep): string => {
  switch (step) {
    case 'intro':
      return 'Programvaruuppdatering';
    case 'license':
      return 'Licensavtal för Matningsmodul';
    case 'featuresAndInstallation':
      return 'Nya Funktioner & Installation Pågår';
    case 'complete':
      return 'Uppdatering Slutförd';
    default:
      return 'Programvaruuppdatering';
  }
};

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<UpdateStep>('intro');
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [licenseScrolledToBottom, setLicenseScrolledToBottom] = useState(false);
  const [licenseTimerCompleted, setLicenseTimerCompleted] = useState(false);
  
  // State for consolidated featuresAndInstallation step
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const [featureCarouselCyclesDone, setFeatureCarouselCyclesDone] = useState(0);
  const [installationProgress, setInstallationProgress] = useState(0);
  const [installationSubText, setInstallationSubText] = useState('Verifierar systemfiler...');
  const [isProgressBarStuck, setIsProgressBarStuck] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [stuckNextClickCount, setStuckNextClickCount] = useState(0);
  
  // Modal visibility delay
  const [modalContentVisible, setModalContentVisible] = useState(false);
  
  const licenseScrollRef = useRef<HTMLDivElement>(null);

  const licenseText = `LICENSAVTAL FÖR ÅLCONTROL PRO 2025

Denna programvara tillhandahålls "som den är" utan garantier av något slag. Genom att använda denna programvara accepterar du följande villkor:

1. ANVÄNDNING
Denna programvara är licensierad för användning inom akvakultur och fiskodling. Användaren ansvarar för att följa alla tillämpliga lagar och förordningar.

2. BEGRÄNSNINGAR
- Programvaran får inte användas för kommersiella ändamål utan skriftligt tillstånd
- Reverse engineering, dekompilering eller disassemblering är förbjudet
- Distribution av programvaran utan tillstånd är förbjudet

3. ANSVARSBEGRÄNSNING
Utvecklaren ansvarar inte för några direkta eller indirekta skador som kan uppstå genom användning av programvaran.

4. DATAINSAMLING
Programvaran kan samla in anonymiserad användningsdata för att förbättra funktionaliteten.

5. UPPDATERINGAR
Utvecklaren förbehåller sig rätten att uppdatera licensvillkoren. Användare kommer att meddelas om väsentliga ändringar.

VIKTIGT – LÄS NOGGRANT: Genom att installera, kopiera, komma åt eller på annat sätt använda denna programvara godkänner du att vara bunden av villkoren i detta licensavtal. Om du inte accepterar dessa villkor ska du inte installera eller använda programvaran. Denna programvara tillhandahålls "i befintligt skick" utan några som helst garantier, uttryckliga eller underförstådda.

1. ANVÄNDNING OCH LICENS
1.1 Programvaran ÅlControl Pro 2025 är licensierad – inte såld – till dig av utvecklaren (hädanefter kallad “Licensgivaren”), för icke-exklusiv användning inom områden kopplade till akvakultur, fiskodling, vattenmiljöövervakning eller liknande tillämpningar.

1.2 Licensen är personlig och får inte överlåtas utan skriftligt medgivande från Licensgivaren. Programvaran får endast installeras på en (1) maskin per licensnyckel, om inte annat anges i särskilt avtal.

1.3 Användaren är ansvarig för att programvaran används i enlighet med alla tillämpliga nationella och internationella lagar, inklusive regler om djurskydd, miljöskydd och datahantering.

2. BEGRÄNSNINGAR OCH FÖRBUD
2.1 Det är inte tillåtet att:

Använda programvaran i kommersiella sammanhang utan uttryckligt skriftligt tillstånd från Licensgivaren.

Modifiera, översätta, hyra ut, leasa, sälja, distribuera eller skapa derivat av programvaran.

Utföra reverse engineering, dekompilera, demontera eller på annat sätt försöka härleda källkoden till programvaran.

Använda programvaran i samband med kritiska system där fel kan leda till personskada eller betydande miljöskador.

2.2 All obehörig kopiering eller vidareförsäljning utgör ett brott mot detta avtal och kan leda till civilrättsliga och straffrättsliga påföljder.

3. BEGRÄNSNING AV ANSVAR
3.1 Programvaran tillhandahålls utan några garantier, inklusive men inte begränsat till garantier för lämplighet för ett visst ändamål, icke-intrång i tredje parts rättigheter, funktionalitet eller kompatibilitet.

3.2 Licensgivaren ska under inga omständigheter hållas ansvarig för indirekta, tillfälliga, särskilda, följdskador eller skador av något slag (inklusive men inte begränsat till dataförlust, affärsavbrott, ekonomisk förlust) som uppstår på grund av användning eller oförmåga att använda programvaran, även om Licensgivaren har informerats om risken för sådana skador.

4. INSAMLING OCH ANVÄNDNING AV DATA
4.1 Programvaran kan samla in anonymiserad statistik om användning, systemprestanda och felrapporter. Informationen används i syfte att förbättra framtida versioner och säkerställa kompatibilitet med olika maskinvarumiljöer.

4.2 Inga personuppgifter samlas in eller behandlas utan uttryckligt samtycke från användaren, i enlighet med gällande dataskyddslagstiftning (t.ex. GDPR inom EU).

4.3 Användaren har rätt att när som helst begära information om vilka data som samlats in samt begära att data raderas, i den mån detta är förenligt med licensens fortsatta giltighet.

5. UPPDATERINGAR, PATCHAR OCH ÄNDRINGAR
5.1 Licensgivaren förbehåller sig rätten att genomföra ändringar i programvaran, inklusive säkerhetsuppdateringar, funktionella förbättringar och anpassningar till ny lagstiftning eller teknik.

5.2 Användaren godkänner att uppdateringar kan installeras automatiskt utan föregående meddelande. Kritiska uppdateringar som påverkar funktion eller säkerhet kan vara obligatoriska för fortsatt användning.

5.3 Licensvillkoren kan ändras. Användare kommer att meddelas om väsentliga ändringar och ges möjlighet att acceptera eller avböja dessa. Avböjande kan resultera i att licensen upphör att gälla.

6. UPPSÄGNING OCH OGILTIGFÖRKLARING
6.1 Licensgivaren har rätt att säga upp denna licens om användaren bryter mot något av avtalsvillkoren. Vid uppsägning ska all användning omedelbart upphöra och alla kopior av programvaran raderas.

6.2 Användaren kan när som helst säga upp licensen genom att radera programvaran från samtliga enheter och meddela detta skriftligen till Licensgivaren.

6.3 Vid uppsägning upphör alla rättigheter enligt detta avtal omedelbart, men begränsningar och ansvarsfriheter enligt punkt 2 och 3 fortsätter att gälla.

7. TILLÄMPLIG LAG OCH TVISTELÖSNING
7.1 Detta avtal ska tolkas i enlighet med svensk lag. Eventuella tvister ska avgöras av svensk allmän domstol, med Stockholms tingsrätt som första instans, om inte annat överenskommits i särskilt licensavtal.

7.2 Om någon del av detta avtal bedöms vara ogiltig eller ogenomförbar ska återstoden fortsätta att gälla fullt ut.

8. SLUTBESTÄMMELSER
8.1 Detta licensavtal utgör hela överenskommelsen mellan parterna vad gäller programvaran och ersätter alla tidigare muntliga eller skriftliga avtal.

8.2 Genom att klicka på "Jag accepterar" bekräftar du att du har läst, förstått och godkänner samtliga villkor i detta avtal. Om du inte godkänner villkoren, avbryt installationen omedelbart.


6. UPPSÄGNING
Denna licens gäller tills den sägs upp av användaren eller utvecklaren.

Genom att klicka "Jag accepterar" bekräftar du att du har läst och förstått dessa villkor.`;

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

  // Check if license is scrolled to bottom
  const handleLicenseScroll = () => {
    if (licenseScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = licenseScrollRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
      setLicenseScrolledToBottom(isAtBottom);
    }
  };

  // Modal content visibility delay
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setModalContentVisible(true);
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    } else {
      setModalContentVisible(false);
    }
  }, [isOpen]);

  // Reset stuck click counter when leaving featuresAndInstallation step or when no longer stuck
  useEffect(() => {
    if (currentStep !== 'featuresAndInstallation' || !isProgressBarStuck) {
      setStuckNextClickCount(0);
    }
  }, [currentStep, isProgressBarStuck]);

  // 4-second timer for license step
  useEffect(() => {
    if (currentStep === 'license') {
      const timer = setTimeout(() => {
        setLicenseTimerCompleted(true);
      }, 4000); // 4 seconds
      
      return () => clearTimeout(timer);
    } else {
      setLicenseTimerCompleted(false);
    }
  }, [currentStep]);

  // Consolidated featuresAndInstallation step logic
  useEffect(() => {
    if (currentStep === 'featuresAndInstallation') {
      // Image carousel with fade effect
      const carouselInterval = setInterval(() => {
        setImageOpacity(0); // Start fade out
        
        setTimeout(() => {
          setCurrentFeatureSlide(prev => {
            const next = (prev + 1) % features.length;
            if (next === 0) {
              setFeatureCarouselCyclesDone(cycles => cycles + 1);
            }
            return next;
          });
          setImageOpacity(1); // Fade back in
        }, 500); // 500ms fade duration
      }, 3500); // 3.5 seconds per slide
      
      // Installation progress simulation
      const progressInterval = setInterval(() => {
        setInstallationProgress(prev => {
          if (prev < 15) {
            return prev + Math.random() * 2; // Very slow start
          } else if (prev < 90) {
            return 90; // Sudden jump to 90%
          } else {
            setIsProgressBarStuck(true);
            return 90; // Stuck at 90%
          }
        });
      }, 800);
      
      // Installation sub-text rotation
      const subTextMessages = [
        'Verifierar systemfiler...',
        'Kompilerar algoritmer...',
        'Uppdaterar databaser...',
        'Konfigurerar nätverk...',
        'Optimerar prestanda...',
        'Slutför installation...'
      ];
      
      let subTextIndex = 0;
      const subTextInterval = setInterval(() => {
        subTextIndex = (subTextIndex + 1) % subTextMessages.length;
        setInstallationSubText(subTextMessages[subTextIndex]);
      }, 2500);
      
      return () => {
        clearInterval(carouselInterval);
        clearInterval(progressInterval);
        clearInterval(subTextInterval);
      };
    } else {
      // Reset states when leaving the step
      setCurrentFeatureSlide(0);
      setFeatureCarouselCyclesDone(0);
      setInstallationProgress(0);
      setInstallationSubText('Verifierar systemfiler...');
      setIsProgressBarStuck(false);
      setImageOpacity(1);
    }
  }, [currentStep, features.length]);

  const handleNext = () => {
    switch (currentStep) {
      case 'intro':
        setCurrentStep('license');
        break;
      case 'license':
        if ((licenseAccepted && licenseScrolledToBottom) || licenseTimerCompleted) {
          setCurrentStep('featuresAndInstallation');
        }
        break;
      case 'featuresAndInstallation':
        if (isProgressBarStuck) {
          // Increment click counter when progress bar is stuck
          const newClickCount = stuckNextClickCount + 1;
          setStuckNextClickCount(newClickCount);
          
          // After 5 clicks, proceed to complete step
          if (newClickCount >= 5) {
            setCurrentStep('complete');
            setStuckNextClickCount(0); // Reset counter
          }
        }
        break;
      case 'complete':
        onComplete();
        break;
    }
  };

  const canProceed = () => {
    if (currentStep === 'license') return (licenseAccepted && licenseScrolledToBottom) || licenseTimerCompleted;
    if (currentStep === 'featuresAndInstallation') {
      // Allow clicking Next when progress bar is stuck, but require feature carousel to be done first
      return featureCarouselCyclesDone >= 2;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Professional dimmed overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: '#2A6DD3' }}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Modal container with corporate styling */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 min-h-[60vh] max-h-[75vh] h-auto flex flex-col border border-slate-600/50">
        
        {/* Header Section with ÅlControl branding */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 border-b border-slate-600/50 flex-shrink-0 rounded-t-2xl">
          <div className="flex items-center justify-between">
            {/* ÅlControl Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center shadow-lg">
                <img 
                  src="/aea_logo.svg" 
                  alt="ÅlControl Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-white">
                <span className="text-xl font-bold tracking-wide">ÅlControl</span>
                <span className="text-blue-300 text-xl">™</span>
              </div>
            </div>
            
            {/* Dynamic Title */}
            <h2 className="text-xl font-semibold text-white tracking-wide">
              {getStepTitle(currentStep)}
            </h2>
          </div>
        </div>

        {/* Central Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <div className="h-full flex flex-col justify-center min-h-[300px]">
            {modalContentVisible ? (
              <>
                {currentStep === 'intro' && <IntroStep />}
                {currentStep === 'license' && (
                  <LicenseStep 
                    licenseText={licenseText}
                    licenseScrollRef={licenseScrollRef}
                    handleLicenseScroll={handleLicenseScroll}
                    licenseAccepted={licenseAccepted}
                    setLicenseAccepted={setLicenseAccepted}
                    licenseScrolledToBottom={licenseScrolledToBottom}
                  />
                )}
                {currentStep === 'featuresAndInstallation' && (
                  <FeaturesAndInstallationStep 
                    features={features}
                    currentFeatureSlide={currentFeatureSlide}
                    featureCarouselCyclesDone={featureCarouselCyclesDone}
                    installationProgress={installationProgress}
                    installationSubText={installationSubText}
                    isProgressBarStuck={isProgressBarStuck}
                    imageOpacity={imageOpacity}
                  />
                )}
                {currentStep === 'complete' && <CompleteStep />}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-300 text-lg">Förbereder uppdatering...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Area */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 border-t border-slate-600/50 flex-shrink-0 rounded-b-2xl">
          <div className="flex justify-between items-center">
            {/* Secondary info area (can be used for step indicators, etc.) */}
            <div className="text-slate-400 text-sm">
              Steg {Object.keys({intro: 1, license: 2, featuresAndInstallation: 3, complete: 4}).findIndex(key => key === currentStep) + 1} av 4
            </div>
            
            {/* Primary action button - always visible */}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 min-w-[120px] ${
                canProceed()
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 'complete' ? 'Slutför' : 'Nästa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted components
const IntroStep = () => (
  <div className="h-full flex flex-col py-20">
    {/* Top section with icon */}
    <div className="flex flex-col items-center mb-16">
      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-xl mb-10">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>
      {/* Large title text */}
      <h1 className="text-5xl font-bold text-white mb-4">Dags att uppdatera!</h1>
    </div>
    
    {/* Main content section - grows to fill space */}
    <div className="flex-grow flex flex-col justify-center text-center px-4">
      <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 text-left max-w-2xl mx-auto">
        <p className="text-slate-200 mb-6 text-lg leading-relaxed">
          En ny version av <strong className="text-blue-300">Matningsmodulen</strong> är tillgänglig med förbättringar och nya funktioner.
        </p>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-300">Förbättrad prestanda och stabilitet</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-300">Nya avancerade matningsfunktioner</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-300">Säkerhetsförbättringar och buggfixar</p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Bottom section with call to action */}
    <div className="text-center mt-6">
      <p className="text-slate-300 text-lg">
        Klicka på <strong className="text-blue-300">Nästa</strong> för att påbörja uppdateringsprocessen.
      </p>
    </div>
  </div>
);

const LicenseStep = ({ licenseText, licenseScrollRef, handleLicenseScroll, licenseAccepted, setLicenseAccepted, licenseScrolledToBottom }: any) => (
  <div className="h-full flex flex-col py-2">
    {/* Compact header - removed redundant title since modal header shows "Licensavtal för Matningsmodul" */}
    <div className="text-center mb-4">
      <p className="text-slate-300">Matningsmodul v2.1 - Användarvillkor</p>
    </div>
    
    {/* License text area - fixed height to ensure scrollbar */}
    <div 
      ref={licenseScrollRef}
      onScroll={handleLicenseScroll}
      className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 overflow-y-auto text-sm text-slate-200 leading-relaxed shadow-inner h-[350px] max-h-[350px]"
    >
      <pre className="whitespace-pre-wrap font-mono">{licenseText}</pre>
    </div>
    
    {/* Acceptance section - fixed at bottom */}
    <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600 mt-4 flex-shrink-0">
      <div className="flex items-start space-x-4">
        <input
          type="checkbox"
          id="licenseAccept"
          checked={licenseAccepted}
          onChange={(e) => setLicenseAccepted(e.target.checked)}
          disabled={!licenseScrolledToBottom}
          className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-500 rounded focus:ring-blue-500 focus:ring-2 mt-1"
        />
        <div className="flex-1">
          <label 
            htmlFor="licenseAccept" 
            className={`text-lg font-medium block ${
              licenseScrolledToBottom ? 'text-white cursor-pointer' : 'text-slate-500 cursor-not-allowed'
            }`}
          >
            Jag accepterar licensavtalet och användarvillkoren
          </label>
          {!licenseScrolledToBottom && (
            <p className="text-blue-400 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vänligen läs igenom hela licensavtalet för att fortsätta
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const FeaturesAndInstallationStep = ({ 
  features, 
  currentFeatureSlide, 
  featureCarouselCyclesDone, 
  installationProgress, 
  installationSubText, 
  isProgressBarStuck, 
  imageOpacity 
}: any) => (
  <div className="h-full flex flex-col py-2">
    {/* Header */}
    <div className="text-center mb-4 flex-shrink-0">
      <p className="text-slate-300">Upptäck förbättringarna i v2.1</p>
    </div>
    
    {/* Image section - fixed height */}
    <div className="flex-shrink-0 mb-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="relative h-[320px]">
          <div className="bg-slate-700/50 rounded-2xl p-2 border border-slate-600 h-full">
            <img 
              src={features[currentFeatureSlide].image} 
              alt={features[currentFeatureSlide].title}
              className="w-full h-full object-cover rounded-xl shadow-lg transition-opacity duration-500"
              style={{ opacity: imageOpacity }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent rounded-2xl" />
          <div className="absolute bottom-6 left-6 right-6">
            <h4 className="text-2xl font-bold text-white mb-3">{features[currentFeatureSlide].title}</h4>
            <p className="text-slate-200 text-lg leading-relaxed">{features[currentFeatureSlide].description}</p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Carousel indicators */}
    <div className="text-center mb-6 flex-shrink-0">
      <div className="flex justify-center space-x-3">
        {features.map((_: any, index: number) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              index === currentFeatureSlide ? 'bg-blue-400 scale-150 shadow-lg' : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
    
    {/* Installation progress section - at bottom */}
    <div className="flex-shrink-0">
      <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
        <div className="text-center mb-4">
          <p className="text-slate-300 text-lg">{installationSubText}</p>
        </div>
        
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Installation</span>
            <span>{Math.round(installationProgress)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                isProgressBarStuck ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${installationProgress}%` }}
            />
          </div>
          {isProgressBarStuck && (
            <p className="text-yellow-400 text-sm mt-2 text-center">
              Slutför kritiska systemfiler...
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);



const CompleteStep = () => (
  <div className="h-full flex flex-col justify-between py-20">
    {/* Top section with success icon */}
    <div className="flex justify-center">
      <div className="relative">
        <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
          <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="absolute -inset-3 bg-green-500/20 rounded-full animate-pulse"></div>
      </div>
    </div>
    
    {/* Main content section - grows to fill space */}
    <div className="flex-1 flex flex-col justify-center">
      {/* Removed redundant title since modal header shows "Uppdatering Slutförd" */}
      <div className="text-center max-w-2xl mx-auto mt-16 mb-16">
        <p className="text-slate-300 text-xl leading-relaxed">
          <strong className="text-green-400">Matningsmodulen v2.1</strong> har installerats framgångsrikt. 
          Alla nya funktioner och förbättringar är nu tillgängliga.
        </p>
      </div>
      
      {/* Feature highlights grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mx-auto mb-6">
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="text-white font-semibold mb-2">Förbättrad Prestanda</h4>
          <p className="text-slate-400 text-sm">Snabbare responstider och optimerad systemanvändning</p>
        </div>
        
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-white font-semibold mb-2">Säkerhetsuppdateringar</h4>
          <p className="text-slate-400 text-sm">Förstärkt säkerhet och skydd mot sårbarheter</p>
        </div>
        
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h4 className="text-white font-semibold mb-2">Nya Funktioner</h4>
          <p className="text-slate-400 text-sm">Avancerade matningsalgorithmer och kontrollmöjligheter</p>
        </div>
      </div>
    </div>
    
    {/* Bottom section with next steps */}
   
  </div>
);

export default UpdateModal;