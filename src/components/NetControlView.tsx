// src/components/NetControlView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Zap } from 'lucide-react';
import type { NetInfo } from './NetSelectionView';

interface NetControlViewProps {
  selectedNet: NetInfo;
  onBack: () => void;
}

const MAX_WINCH_LOAD = 100;
const NORMAL_OPERATION_LOAD = 30;
const EMERGENCY_OPERATION_LOAD = 95;
const LOWER_SPEED_NORMAL = 0.5; // meters per second (simulated)
const RAISE_SPEED_NORMAL = 0.7;
const LOWER_SPEED_EMERGENCY = 5; // meters per second (simulated)

const NetControlView: React.FC<NetControlViewProps> = ({ selectedNet, onBack }) => {
  const [currentDepth, setCurrentDepth] = useState(selectedNet.depth);
  const [winchLoad, setWinchLoad] = useState(0);
  const [isOperating, setIsOperating] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isEmergencyPressed, setIsEmergencyPressed] = useState(false);
  const emergencyPressTimer = useRef<NodeJS.Timeout | null>(null);
  const operationInterval = useRef<NodeJS.Timeout | null>(null);

  const NET_HEIGHT_PERCENTAGE = 80; // Net visual takes 80% of the container height

  useEffect(() => {
    setCurrentDepth(selectedNet.depth);
    setWinchLoad(0);
    setIsOperating(false);
    setIsEmergencyMode(false);
  }, [selectedNet]);

  const stopOperation = () => {
    setIsOperating(false);
    if (operationInterval.current) clearInterval(operationInterval.current);
    if (!isEmergencyMode) setWinchLoad(0);
  };

  const handleOperation = (direction: 'lower' | 'raise', emergency: boolean = false) => {
    if (isOperating && !emergency) return; // Prevent multiple normal operations

    setIsOperating(true);
    setIsEmergencyMode(emergency);
    setWinchLoad(emergency ? EMERGENCY_OPERATION_LOAD : NORMAL_OPERATION_LOAD);

    const speed = emergency ? LOWER_SPEED_EMERGENCY :
                  direction === 'lower' ? LOWER_SPEED_NORMAL : RAISE_SPEED_NORMAL;
    const targetDepth = direction === 'lower' ? selectedNet.maxDepth : 0;
    const depthChangePerTick = speed / 10; // Update 10 times per second

    if (operationInterval.current) clearInterval(operationInterval.current);

    operationInterval.current = setInterval(() => {
      setCurrentDepth(prevDepth => {
        let newDepth;
        if (direction === 'lower') {
          newDepth = Math.min(prevDepth + depthChangePerTick, targetDepth);
        } else {
          newDepth = Math.max(prevDepth - depthChangePerTick, targetDepth);
        }

        if ((direction === 'lower' && newDepth >= targetDepth) || 
            (direction === 'raise' && newDepth <= targetDepth)) {
          stopOperation();
          if (emergency) setIsEmergencyMode(false); // Reset emergency mode after completion
        }
        return newDepth;
      });
    }, 100);
  };

  const handleEmergencyPressStart = () => {
    setIsEmergencyPressed(true);
    emergencyPressTimer.current = setTimeout(() => {
      if (isEmergencyPressed) { // Check if still pressed
        handleOperation('lower', true);
      }
      setIsEmergencyPressed(false); // Reset after timer or release
    }, 1500); // 1.5 seconds press and hold
  };

  const handleEmergencyPressEnd = () => {
    setIsEmergencyPressed(false);
    if (emergencyPressTimer.current) {
      clearTimeout(emergencyPressTimer.current);
      emergencyPressTimer.current = null;
    }
    // If emergency operation hasn't started (timer didn't complete), don't start it.
    // If it has started, it will continue until completion or manual stop (if implemented).
  };

  const depthPercentage = (currentDepth / selectedNet.maxDepth) * 100;
  const winchLoadColor = winchLoad > 80 ? 'bg-red-500' : winchLoad > 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="p-4 md:p-6 bg-gray-800/60 backdrop-blur-lg rounded-lg shadow-2xl h-full flex flex-col text-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-300">Kontroll: {selectedNet.name}</h2>
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors duration-200 text-sm"
        >
          &larr; Tillbaka till val
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
        {/* Net Visualization Column */}
        <div className="md:col-span-2 bg-slate-900/70 p-3 md:p-4 rounded-lg shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
          <p className="absolute top-2 left-2 text-xs text-slate-400">Djup: {currentDepth.toFixed(1)}m / {selectedNet.maxDepth}m</p>
          <div className="w-2/3 md:w-1/2 h-full bg-slate-700 rounded-t-md relative border-2 border-slate-600 flex items-end justify-center" style={{ maxHeight: 'calc(100% - 40px)' }}> {/* Silo/Tank structure */}
            <div 
              className={`absolute bottom-0 w-full ${isEmergencyMode ? 'bg-red-600/80 animate-pulse' : 'bg-sky-500/80'} transition-all duration-100 ease-linear rounded-t-sm`}
              style={{ height: `${(depthPercentage / 100) * NET_HEIGHT_PERCENTAGE}%`, bottom: 0, left:0, right:0, margin: 'auto'}}
            > 
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white font-semibold">NÄT</span>
            </div>
          </div>
          {/* Depth Scale */}
          <div className="absolute right-2 md:right-4 top-10 bottom-10 w-4 bg-slate-600 rounded-full overflow-hidden">
            <div 
              className="absolute bottom-0 w-full bg-sky-400 transition-all duration-100 ease-linear"
              style={{ height: `${depthPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="flex flex-col justify-between space-y-4 bg-slate-700/50 p-3 md:p-4 rounded-lg shadow-md">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-sky-200">Manövrering</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleOperation('lower')}
                disabled={isOperating || currentDepth >= selectedNet.maxDepth}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-500 text-white font-medium rounded-md transition-colors duration-200 shadow-md disabled:opacity-70"
              >
                <ChevronDown size={20} className="mr-2" /> Sänk Nät
              </button>
              <button 
                onClick={() => handleOperation('raise')}
                disabled={isOperating || currentDepth <= 0}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-500 text-white font-medium rounded-md transition-colors duration-200 shadow-md disabled:opacity-70"
              >
                <ChevronUp size={20} className="mr-2" /> Höj Nät
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-lg font-semibold mb-2 text-sky-200">Vinschbelastning</h3>
            <div className="w-full bg-slate-600 rounded-full h-6 md:h-8 shadow-inner overflow-hidden relative">
              <div 
                className={`h-full ${winchLoadColor} transition-all duration-300 ease-out flex items-center justify-center text-xs md:text-sm font-bold text-white`}
                style={{ width: `${winchLoad}%` }}
              >
                {winchLoad.toFixed(0)}%
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-600/50">
            <h3 className="text-lg font-semibold mb-2 text-red-400 flex items-center"><AlertTriangle size={20} className="mr-2 text-red-500"/>Nödsystem</h3>
            <button 
              onMouseDown={handleEmergencyPressStart}
              onMouseUp={handleEmergencyPressEnd}
              onTouchStart={handleEmergencyPressStart} // For touch devices
              onTouchEnd={handleEmergencyPressEnd}   // For touch devices
              disabled={isEmergencyMode || (isOperating && !isEmergencyMode) || currentDepth >= selectedNet.maxDepth}
              className={`w-full flex items-center justify-center px-4 py-3 font-bold rounded-md transition-all duration-200 shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 relative overflow-hidden
                ${isEmergencyPressed ? 'bg-yellow-500 text-slate-900 ring-yellow-400' : 'bg-red-600 hover:bg-red-500 text-white ring-red-500'}
                disabled:bg-slate-500 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isEmergencyPressed && (
                <div className="absolute inset-0 bg-yellow-300/50 animate-pulse-fast"></div>
              )}
              <Zap size={22} className="mr-2" /> {isEmergencyPressed ? 'AKTIVERAR...' : 'NÖDSÄNKNING (HÅLL IN)'}
            </button>
            {isEmergencyPressed && (
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full animate-emergency-progress"></div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetControlView;

// Add this to your globals.css or a style tag for the animation
/*
@keyframes emergency-progress {
  0% { width: 0%; }
  100% { width: 100%; }
}
.animate-emergency-progress {
  animation: emergency-progress 1.5s linear forwards;
}
@keyframes pulse-fast {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.animate-pulse-fast {
  animation: pulse-fast 0.7s infinite;
}
*/