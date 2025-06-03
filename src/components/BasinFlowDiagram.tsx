import React from 'react';

const BasinFlowDiagram = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden relative">
      {/* Placeholder image */}
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src="/basins.png" 
          alt="Bassäng diagram placeholder" 
          className="max-w-full max-h-full object-contain opacity-80"
        />
      </div>
      
      {/* System overview panel */}
      <div className="absolute top-4 left-4 bg-slate-800/90 p-3 rounded-lg border border-slate-600">
        <h3 className="text-white font-semibold mb-2">Systemöversikt</h3>
        <div className="space-y-1 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Bassänger (6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Pumpar (3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Filter (2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>System (3)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasinFlowDiagram;