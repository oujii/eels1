// src/components/FeedingManagementPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import NetSelectionView, { NetInfo } from './NetSelectionView';
import NetControlView from './NetControlView';


// Sample data for nets - this would likely come from an API or global state
const initialNets: NetInfo[] = [
  { id: 'net-a', name: 'Nätstation Alfa', status: 'Uppfällt, Tomt', depth: 0, maxDepth: 20 },
  { id: 'net-b', name: 'Nätstation Beta', status: 'Sänkt, 50% Fyllt', depth: 10, maxDepth: 20 },
  { id: 'net-c', name: 'Nätstation Gamma', status: 'Uppfällt, Service', depth: 0, maxDepth: 15 },
  { id: 'net-d', name: 'Nätstation Delta', status: 'Uppfällt, Tomt', depth: 0, maxDepth: 25 },
];

const FeedingManagementPage: React.FC = () => {
  const [nets, setNets] = useState<NetInfo[]>(initialNets);
  const [selectedNetId, setSelectedNetId] = useState<string | null>(null);
  const [updateCompleted, setUpdateCompleted] = useState(false);

  const handleSelectNet = (netId: string) => {
    setSelectedNetId(netId);
  };

  const handleBackToSelection = () => {
    setSelectedNetId(null);
    // Potentially refresh net data here if needed
    // For now, just reset the view
  };

  const handleUpdateComplete = () => {
    setUpdateCompleted(true);
  };

  const selectedNet = selectedNetId ? nets.find(n => n.id === selectedNetId) : null;

  // This component will be rendered within the 'Matning' tab of Dashboard.tsx
  return (
    <>

      
      <div className="w-full h-full p-2 transition-all duration-300">
        {selectedNet ? (
          <NetControlView 
            selectedNet={selectedNet} 
            onBack={handleBackToSelection} 
          />
        ) : (
          <NetSelectionView nets={nets} onSelectNet={handleSelectNet} />
        )}
      </div>
    </>
  );
};

export default FeedingManagementPage;