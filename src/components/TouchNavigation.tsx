'use client';

import { useState } from 'react';
import { 
  HomeIcon, 
  BeakerIcon, 
  CpuChipIcon, 
  CakeIcon,
  CogIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  status?: 'active' | 'warning' | 'error';
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, status: 'active' },
  { id: 'bassanger', label: 'Bassänger', icon: BeakerIcon },
  { id: 'sensorer', label: 'Sensorer', icon: CpuChipIcon, status: 'warning' },
  { id: 'matning', label: 'Matning', icon: CakeIcon },
  { id: 'installningar', label: 'Inställningar', icon: CogIcon },
  { id: 'rapporter', label: 'Rapporter', icon: DocumentTextIcon },
  { id: 'larm', label: 'Larm', icon: ExclamationTriangleIcon, status: 'error' },
  { id: 'profil', label: 'Profil', icon: UserIcon }
];

const TouchNavigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return '';
    }
  };

  const getStatusIndicator = (status?: string) => {
    if (!status) return null;
    
    return (
      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(status)} pulse`}>
        <div className={`w-full h-full rounded-full ${getStatusColor(status)} animate-ping absolute`}></div>
        <div className={`w-full h-full rounded-full ${getStatusColor(status)} relative`}></div>
      </div>
    );
  };

  return (
    <nav className="fixed top-24 left-0 right-0 z-40 glass border-t border-border">
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  relative touch-target flex flex-col items-center justify-center
                  px-4 py-6 rounded-xl transition-all duration-300
                  hover:scale-105 active:scale-95
                  ${isActive 
                    ? 'bg-gradient-to-br from-accent/20 to-secondary/20 border border-accent glow-border' 
                    : 'bg-gradient-to-br from-card-bg hover:from-accent/10 hover:to-secondary/10'
                  }
                  w-full
                `}
              >
                {getStatusIndicator(item.status)}
                
                <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-accent glow' : 'text-secondary'}`} />
                
                <span className={`text-sm font-medium whitespace-nowrap ${
                  isActive ? 'text-accent glow' : 'text-foreground'
                }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-accent rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TouchNavigation;