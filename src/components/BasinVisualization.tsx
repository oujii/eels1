'use client';

import React, { useState, useRef, useCallback } from 'react';
import BasinFlowDiagram from './BasinFlowDiagram';

const BasinVisualization = () => {
  const [cranePosition, setCranePosition] = useState({ x: 50, y: 50 });
  const [isFeeding, setIsFeeding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);

  const moveCrane = (direction: 'up' | 'down' | 'left' | 'right') => {
    setCranePosition(prev => {
      const step = 5;
      switch (direction) {
        case 'up':
          return { ...prev, y: Math.max(0, prev.y - step) };
        case 'down':
          return { ...prev, y: Math.min(100, prev.y + step) };
        case 'left':
          return { ...prev, x: Math.max(0, prev.x - step) };
        case 'right':
          return { ...prev, x: Math.min(100, prev.x + step) };
        default:
          return prev;
      }
    });
  };

  const handleJoystickMove = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2;
    
    if (distance > 10) { // Dead zone
      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;
      
      setCranePosition(prev => ({
        x: Math.max(0, Math.min(100, prev.x + normalizedX * 2)),
        y: Math.max(0, Math.min(100, prev.y + normalizedY * 2))
      }));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleJoystickMove(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleJoystickMove(e.clientX, e.clientY);
    }
  }, [isDragging, handleJoystickMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    handleJoystickMove(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      e.preventDefault();
      const touch = e.touches[0];
      handleJoystickMove(touch.clientX, touch.clientY);
    }
  }, [isDragging, handleJoystickMove]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="glass rounded-2xl overflow-hidden h-full">
      {/* Bassäng diagram område */}
      <div className="relative h-full">
        {/* ReactFlow diagram */}
        <div className="absolute inset-0">
          <BasinFlowDiagram />
        </div>

        {/* Kontrollpanel - absolut positionerad längst ner */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System status */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Systemstatus</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Aktiva bassänger:</span>
                    <span className="font-mono text-accent">4/6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Aktiva pumpar:</span>
                    <span className="font-mono text-accent">2/3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Systemtryck:</span>
                    <span className="font-mono text-accent">92 mbar</span>
                  </div>
                </div>
              </div>

              {/* Matningskontroll */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Matningskontroll</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsFeeding(!isFeeding)}
                    className={`w-full touch-target rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center font-semibold py-3 ${
                      isFeeding 
                        ? 'bg-gradient-to-br from-warning to-orange-600 text-white' 
                        : 'bg-gradient-to-br from-accent/20 to-secondary/20 border border-accent text-accent'
                    }`}
                  >
                    {isFeeding ? 'STOPP MATNING' : 'STARTA MATNING'}
                  </button>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Status:</span>
                    <span className={`font-semibold ${
                      isFeeding ? 'text-warning' : 'text-success'
                    }`}>
                      {isFeeding ? 'MATAR' : 'STANDBY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Temperatur översikt */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Temperatur</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Medel:</span>
                    <span className="font-mono text-accent">18.9°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Min:</span>
                    <span className="font-mono text-blue-400">18.5°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Max:</span>
                    <span className="font-mono text-red-400">19.2°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasinVisualization;