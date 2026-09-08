import React from 'react';

export type TabType = 'inicio' | 'dosis' | 'hud' | 'sistemas' | 'registro';

interface FloatingNavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: 'inicio' as TabType, label: 'INICIO', icon: 'home' },
    { id: 'dosis' as TabType, label: 'DOSIS', icon: 'science', badge: '7 PASOS' },
    { id: 'hud' as TabType, label: 'HUD', icon: 'grid_view' },
    { id: 'sistemas' as TabType, label: 'SISTEMAS', icon: 'water' },
    { id: 'registro' as TabType, label: 'BITÁCORA', icon: 'description' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none px-4 mb-3">
      <nav className="pointer-events-auto mx-auto max-w-md bg-white/90 backdrop-blur-xl rounded-full shadow-[0_12px_32px_-6px_rgba(0,103,125,0.25)] border border-white/80 p-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isSelected = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative min-w-[56px] min-h-[44px] px-3.5 py-1.5 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#00b4d8] to-[#009bb8] hover:from-[#10e7b2] hover:to-[#00b4d8] text-white hover:text-[#002b1f] shadow-[0_0_16px_1px_rgba(0,180,216,0.4)] hover:shadow-[0_0_20px_2px_rgba(16,231,178,0.6)] scale-105'
                  : 'text-[#3d494d] hover:text-[#00677d] hover:bg-gradient-to-t hover:from-cyan-100 hover:to-teal-50 hover:shadow-2xs active:scale-95'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-hud text-[10px] tracking-tight uppercase font-bold">
                {item.label}
              </span>
              {item.badge && !isSelected && (
                <span className="absolute -top-0.5 right-1.5 w-2 h-2 rounded-full bg-[#10e7b2] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
