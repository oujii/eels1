'use client';

import { useState, useEffect } from 'react';

const SystemStatus = () => {
  const [uptime, setUptime] = useState({ hours: 72, minutes: 14, seconds: 0 });
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => {
        let newSeconds = prev.seconds + 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return 'text-success';
      case 'offline': return 'text-error';
      case 'connecting': return 'text-warning';
      default: return 'text-secondary';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'offline':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'connecting':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass p-4 border-t border-border/20">
        <div className="max-w-[3840px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
            {/* System Status */}
            <div className="text-center">
              <div className={`flex items-center justify-center space-x-1 mb-1 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-xs font-semibold uppercase">
                  {connectionStatus === 'online' ? 'ONLINE' : 
                   connectionStatus === 'offline' ? 'OFFLINE' : 'ANSLUTER'}
                </span>
              </div>
              <span className="text-xs text-secondary">System Status</span>
            </div>

            {/* Uptime */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                <span className="text-xs font-mono text-accent">
                  {uptime.hours}h {uptime.minutes.toString().padStart(2, '0')}m
                </span>
              </div>
              <span className="text-xs text-secondary">Drifttid</span>
            </div>

            {/* Version */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
                <span className="text-xs font-mono text-secondary">2025.5.31</span>
              </div>
              <span className="text-xs text-secondary">Version</span>
            </div>

            {/* Aktiva Bassänger */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs font-mono text-success font-semibold">6/6</span>
              </div>
              <span className="text-xs text-secondary">Aktiva Bassänger</span>
            </div>

            {/* CPU */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-xs font-mono text-accent">23%</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-1 w-16 mx-auto">
                <div className="h-full bg-gradient-to-r from-accent to-success w-1/4 rounded-full shimmer"></div>
              </div>
              <span className="text-xs text-secondary">CPU</span>
            </div>
            
            {/* Memory */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-xs font-mono text-accent">67%</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-1 w-16 mx-auto">
                <div className="h-full bg-gradient-to-r from-accent to-warning w-2/3 rounded-full shimmer"></div>
              </div>
              <span className="text-xs text-secondary">Minne</span>
            </div>

            {/* Network Status */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 rounded-full ${
                        i < 3 ? 'bg-success' : 'bg-gray-600'
                      }`}
                      style={{ height: `${(i + 1) * 2 + 4}px` }}
                    ></div>
                  ))}
                </div>
                <span className="text-xs font-mono text-success">Stark</span>
              </div>
              <span className="text-xs text-secondary">Nätverk</span>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
};

export default SystemStatus;