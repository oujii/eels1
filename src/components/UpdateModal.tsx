'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface UpdateModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

type UpdateStep = 'intro' | 'license' | 'features' | 'installation' | 'complete';

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<UpdateStep>('intro');
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [licenseScrolledToBottom, setLicenseScrolledToBottom] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [featureCarouselStarted, setFeatureCarouselStarted] = useState(false);
  const [featureCarouselCompleted, setFeatureCarouselCompleted] = useState(false);
  const [backgroundInstallStarted, setBackgroundInstallStarted] = useState(false);
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

  // Auto-play feature carousel with fade effect
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
      }, 4000); // Increased to 4 seconds for fade effect
      
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
        if (licenseAccepted && licenseScrolledToBottom) {
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
    if (currentStep === 'license') return licenseAccepted && licenseScrolledToBottom;
    if (currentStep === 'features') return featureCarouselCompleted;
    if (currentStep === 'installation') return false;
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay med backdrop blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0a1a2a]/95 via-[#1a2332]/95 to-[#0f1419]/95 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="relative bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full mx-4 h-[70vh] flex flex-col">
        {/* Header - Fixed height */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white h-8 flex items-center">
            {currentStep === 'intro' && 'KRITISK UPPDATERING KRÄVS - Matningsmodulen'}
            {currentStep === 'license' && 'Licensavtal'}
            {currentStep === 'features' && 'Nya Fantastiska Funktioner - Installeras'}
            {currentStep === 'installation' && 'Installerar uppdatering'}
            {currentStep === 'complete' && 'Uppdatering slutförd'}
          </h2>
        </div>

        {/* Content - Fixed height with internal scrolling */}
        <div className="flex-1 p-8 overflow-y-auto relative">
          {/* Content container with fixed dimensions */}
          <div className="h-full flex flex-col justify-center min-h-[250px]">
          {/* Skeleton/Placeholder structure to maintain consistent dimensions */}
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

          {currentStep === 'features' && (
            <FeaturesStep 
              features={features}
              currentFeature={currentFeature}
              featureCarouselCompleted={featureCarouselCompleted}
              backgroundInstallStarted={backgroundInstallStarted}
              installProgress={installProgress}
            />
          )}

          {currentStep === 'installation' && <InstallationStep installProgress={installProgress} />}

          {currentStep === 'complete' && <CompleteStep />}
          </div>
        </div>

        {/* Footer with larger touch-friendly button - Fixed position */}
        <div className="bg-gray-800 px-8 py-6 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`w-full py-4 px-8 text-xl font-semibold rounded-lg transition-all duration-200 ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === 'complete' ? 'Slutför' : 'Nästa'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Extracted components
const IntroStep = () => (
  <div className="text-center h-full flex flex-col justify-center">
    <div className="max-w-2xl mx-auto">
      <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-4xl font-bold text-red-400 mb-6 animate-pulse">OMEDELBAR ÅTGÄRD KRÄVS</h3>
      <div className="bg-red-900 bg-opacity-50 border-2 border-red-500 rounded-lg p-6 mb-6">
        <p className="text-red-200 text-xl font-semibold mb-4">
          ⚠️ SYSTEMKRITISK UPPDATERING MÅSTE INSTALLERAS NU
        </p>
        <p className="text-red-300 text-lg leading-relaxed mb-4">
          Matningsmodulen har identifierat kritiska säkerhetsbrister som MÅSTE åtgärdas omedelbart. 
          Fortsatt drift utan denna uppdatering kan resultera i:
        </p>
        <ul className="text-red-300 text-left space-y-2 mb-4">
          <li>• Systemkrasch och dataförlust</li>
          <li>• Säkerhetsrisker för ålbeståndet</li>
          <li>• Potentiell skada på utrustning</li>
          <li>• Förlust av garantiskydd</li>
        </ul>
      </div>
      <p className="text-yellow-400 text-lg font-bold animate-bounce">
        DENNA UPPDATERING KAN INTE SKJUTAS UPP!
      </p>
    </div>
  </div>
);

const LicenseStep = ({ licenseText, licenseScrollRef, handleLicenseScroll, licenseAccepted, setLicenseAccepted, licenseScrolledToBottom }: any) => (
  <div className="h-full flex flex-col">
    <div 
      ref={licenseScrollRef}
      onScroll={handleLicenseScroll}
      className="bg-gray-800 p-4 rounded-lg mb-4 flex-1 overflow-y-auto"
    >
      <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
        {licenseText}
      </pre>
    </div>
    <div className="flex-shrink-0">
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="license-accept"
          checked={licenseAccepted}
          onChange={(e) => setLicenseAccepted(e.target.checked)}
          disabled={!licenseScrolledToBottom}
          className={`mr-3 h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 ${
            !licenseScrolledToBottom ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        />
        <label htmlFor="license-accept" className={`text-gray-300 ${
          !licenseScrolledToBottom ? 'opacity-50' : ''
        }`}>
          Jag har läst och godkänner villkoren i licensavtalet
        </label>
      </div>
      {!licenseScrolledToBottom && (
        <p className="text-yellow-400 text-sm animate-pulse">
          ⚠️ Du måste scrolla ner och läsa hela avtalet innan du kan acceptera
        </p>
      )}
    </div>
  </div>
);

const FeaturesStep = ({ features, currentFeature, featureCarouselCompleted, backgroundInstallStarted, installProgress }: any) => (
  <div className="text-center h-full flex flex-col">
    <div className="flex-1 flex flex-col justify-center">
      <div className="w-full h-80 bg-gray-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
        <img 
          src={features[currentFeature].image} 
          alt={features[currentFeature].title}
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: 1 }}
        />
        {!featureCarouselCompleted && (
          <div className="absolute top-2 right-2 text-xs text-yellow-400 animate-pulse">
            ...
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-4 transition-opacity duration-1000 h-12 flex items-center justify-center">
        {features[currentFeature].title}
      </h3>
      <p className="text-gray-300 text-xl leading-relaxed transition-opacity duration-1000 h-16 flex items-center justify-center">
        {features[currentFeature].description}
      </p>
    </div>
    <div className="flex-shrink-0">
      <div className="flex justify-center space-x-2 mb-4">
        {features.map((_: any, index: number) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-500 ${
              index === currentFeature ? 'bg-blue-500 scale-125' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      <div className="h-20">
        {backgroundInstallStarted && (
          <div className="p-3 bg-gray-800 rounded-lg">
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
    </div>
  </div>
);

const InstallationStep = ({ installProgress }: any) => (
  <div className="text-center h-full flex flex-col justify-center">
    <div className="max-w-md mx-auto">
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
      <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${installProgress}%` }}
        />
      </div>
      <p className="text-gray-400 text-sm mb-4">
        {Math.round(installProgress)}% slutfört
      </p>
      <div className="h-16">
        {installProgress >= 90 && (
          <div className="p-3 bg-red-900 bg-opacity-50 rounded-lg border border-red-700">
            <p className="text-red-400 text-sm font-semibold">
              ⚠️ Installation har fastnat vid 90%
            </p>
            <p className="text-red-300 text-xs mt-1">
              Detta är ett känt problem. Vänligen kontakta teknisk support.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CompleteStep = () => (
  <div className="text-center h-full flex flex-col justify-center">
    <div className="max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">
        Uppdatering slutförd!
      </h3>
      <p className="text-gray-300 text-lg leading-relaxed mb-4">
        Matningsmodulen är nu optimerad och redo att användas med alla nya funktioner aktiverade. 
        Du kan nu komma åt den förbättrade nätkontrollen.
      </p>
      <p className="text-green-400 font-semibold">
        Välkommen till framtiden för ålmatning!
      </p>
    </div>
  </div>
);

export default UpdateModal;