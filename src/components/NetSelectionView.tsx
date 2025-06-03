// src/components/NetSelectionView.tsx
import React from 'react';

interface NetInfo {
  id: string;
  name: string;
  status: string; // e.g., 'Uppfällt, Tomt', 'Sänkt, Fyllt'
  depth: number; // Current depth, 0 = fully raised
  maxDepth: number; // Max depth it can be lowered to
}

interface NetSelectionViewProps {
  nets: NetInfo[];
  onSelectNet: (netId: string) => void;
}

const NetSelectionView: React.FC<NetSelectionViewProps> = ({ nets, onSelectNet }) => {
  return (
    <div className="p-4 bg-gray-800/50 backdrop-blur-md rounded-lg shadow-xl h-full text-slate-200">
      <h2 className="text-2xl font-semibold mb-6 text-center text-sky-300">Välj Nätstation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nets.map((net) => (
          <button
            key={net.id}
            onClick={() => onSelectNet(net.id)}
            className="p-6 bg-slate-700/70 hover:bg-sky-600/80 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            <h3 className="text-xl font-medium mb-2 text-sky-100">{net.name}</h3>
            <p className="text-sm text-slate-300">Status: {net.status}</p>
            <p className="text-sm text-slate-300">Djup: {net.depth}m / {net.maxDepth}m</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetSelectionView;

export type { NetInfo };