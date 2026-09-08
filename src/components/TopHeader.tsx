import React, { useState, useEffect } from 'react';
import {
  soundService,
  toggleCalypso as toggleCalypsoAudio,
  subscribeCalypso,
  isCalypsoPlaying as checkCalypsoPlaying,
} from '../utils/audioSystem';

interface TopHeaderProps {
  currentTabTitle?: string;
  operatorName?: string;
  operatorRole?: string;
  onNavigateHome: () => void;
  onOpenDpdCamera?: () => void;
  onOpenNormative?: () => void;
  onOpenCalibrate?: () => void;
  onOpenSolutionPrep?: () => void;
  onOpenVolumeCalc?: () => void;
  onOpenProfile?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTabTitle = 'PORTAL PRINCIPAL',
  operatorName = 'Ing. Carlos Mendoza',
  operatorRole = 'Operador DIGESA / JASS',
  onNavigateHome,
  onOpenDpdCamera,
  onOpenNormative,
  onOpenCalibrate,
  onOpenSolutionPrep,
  onOpenVolumeCalc,
  onOpenProfile,
}) => {
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isCalypsoPlaying, setIsCalypsoPlaying] = useState(() => checkCalypsoPlaying());
  const [isGameSoundActive, setIsGameSoundActive] = useState(() => !soundService.getMuted());

  useEffect(() => {
    const unsubCalypso = subscribeCalypso((playing) => {
      setIsCalypsoPlaying(playing);
    });
    const unsubSound = soundService.subscribe((muted) => {
      setIsGameSoundActive(!muted);
    });
    return () => {
      unsubCalypso();
      unsubSound();
    };
  }, []);

  const toggleCalypso = () => {
    toggleCalypsoAudio();
  };

  const toggleGameSound = () => {
    soundService.toggleSound();
  };

  const initialLetter = operatorName ? operatorName.charAt(0).toUpperCase() : 'I';

  return (
    <header className="sticky top-0 w-full z-40 bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,103,125,0.08)] border-b border-white/70">
      <div className="h-20 px-4 max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand logo & title */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer group select-none"
            title="Ir a Página Principal"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#00677d] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,180,216,0.35)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">water_drop</span>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10e7b2] border-2 border-white flex items-center justify-center text-[7px] font-bold text-[#002116]">
                ✓
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[20px] text-[#00677d] tracking-tight leading-none group-hover:text-[#004e5f] transition-colors font-hud">
                  CLORAGUA
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#caf300]/40 text-[#334000] border border-[#caf300]">
                  D.S. 031
                </span>
              </div>
              <span className="font-hud text-[11px] text-[#006c51] tracking-wider uppercase leading-none mt-1 font-bold">
                {currentTabTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons & profile badge */}
        <div className="flex items-center gap-2">
          {/* Operator Info Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf5fc] hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)] border border-[#bcc9ce]/40 hover:border-[#00b4d8] hover:shadow-[0_2px_12px_rgba(0,180,216,0.3)] transition-all duration-200 cursor-pointer text-left active:scale-95 group"
            type="button"
            title="Ver o gestionar perfiles con correo y contraseña"
          >
            <span className="material-symbols-outlined text-[#006c51] group-hover:text-[#00b4d8] text-[18px] group-hover:scale-110 transition-transform">
              verified_user
            </span>
            <div className="flex flex-col">
              <span className="font-hud text-[9px] text-[#3d494d] group-hover:text-[#00677d] uppercase leading-none font-bold truncate max-w-[120px] sm:max-w-[150px] transition-colors">
                {operatorName}
              </span>
              <span className="font-hud text-[11px] sm:text-[12px] text-[#00677d] group-hover:text-[#004e5f] font-bold leading-none mt-0.5 truncate max-w-[120px] sm:max-w-[150px] transition-colors">
                {operatorRole}
              </span>
            </div>
          </button>

          {/* CALYPSO button */}
          <div className="relative inline-flex items-center">
            <button
              type="button"
              onClick={toggleCalypso}
              className={`h-10 px-3 rounded-full border flex items-center gap-1.5 transition-all duration-300 shadow-xs active:scale-95 cursor-pointer select-none ${
                isCalypsoPlaying
                  ? 'bg-gradient-to-r from-[#10e7b2]/30 via-[#00b4d8]/25 to-[#caf300]/25 hover:from-[#10e7b2]/50 hover:to-[#00b4d8]/40 border-[#10e7b2] text-[#004e5f] shadow-[0_0_16px_rgba(16,231,178,0.5)]'
                  : 'bg-[#edf5fc] hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 border-[#bcc9ce]/40 hover:border-[#00b4d8] text-[#5f747e] hover:text-[#00677d] hover:shadow-[0_2px_12px_rgba(0,180,216,0.3)]'
              }`}
              title={
                isCalypsoPlaying
                  ? 'Pausar BGM Calypso Tropical'
                  : 'Reproducir BGM Calypso Tropical (Sintetizador en Vivo)'
              }
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  isCalypsoPlaying ? 'animate-bounce text-[#00b4d8]' : 'group-hover:text-[#00b4d8]'
                }`}
              >
                {isCalypsoPlaying ? 'music_note' : 'music_off'}
              </span>
              <span className="font-hud text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline">
                CALYPSO
              </span>
              {isCalypsoPlaying && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-1 bg-[#10e7b2] rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2.5"></span>
                  <span className="w-1 bg-[#00b4d8] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3.5"></span>
                  <span className="w-1 bg-[#caf300] rounded-full animate-[pulse_0.3s_ease-in-out_infinite] h-2"></span>
                </div>
              )}
            </button>
          </div>

          {/* CÁMARA DPD button */}
          {onOpenDpdCamera && (
            <button
              onClick={onOpenDpdCamera}
              className="h-10 px-3 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/15 via-teal-500/15 to-emerald-500/15 hover:from-[#00b4d8] hover:via-[#009bb8] hover:to-[#10e7b2] text-[#00677d] hover:text-white hover:border-[#00b4d8] flex items-center gap-1.5 transition-all duration-300 shadow-xs hover:shadow-[0_0_16px_rgba(0,180,216,0.45)] active:scale-95 cursor-pointer select-none"
              title="Abrir Cámara Escáner DPD (Fotómetro de Cloro Libre en Vivo)"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-[#00b4d8] hover:text-white">
                photo_camera
              </span>
              <span className="font-hud text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline">
                CÁMARA DPD
              </span>
            </button>
          )}

          {/* Game sounds toggle */}
          <button
            onClick={toggleGameSound}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 cursor-pointer relative ${
              !isGameSoundActive
                ? 'bg-[#edf5fc] hover:bg-[#ffe8ec] border-[#bcc9ce]/40 hover:border-rose-400 text-[#71828a] hover:text-rose-600 hover:shadow-[0_0_12px_rgba(255,64,129,0.3)]'
                : 'bg-[#10e7b2]/20 hover:bg-[#10e7b2]/40 border-[#10e7b2] hover:border-[#00b4d8] text-[#006c51] hover:text-[#004e5f] shadow-[0_0_12px_rgba(16,231,178,0.4)] hover:shadow-[0_0_18px_rgba(16,231,178,0.6)]'
            }`}
            title={
              !isGameSoundActive
                ? 'Sonidos de Videojuego SILENCIADOS (Clic para activar)'
                : 'Sonidos de Videojuego ACTIVADOS (Clic para silenciar)'
            }
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {!isGameSoundActive ? 'volume_off' : 'sports_esports'}
            </span>
            {isGameSoundActive && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10e7b2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00b4d8]"></span>
              </span>
            )}
          </button>

          {/* Tools & Apps menu */}
          <div className="relative">
            <button
              onClick={() => setIsAppsOpen(!isAppsOpen)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 cursor-pointer ${
                isAppsOpen
                  ? 'bg-[#00677d] text-white border-[#00677d] shadow-[0_0_14px_rgba(0,103,125,0.4)]'
                  : 'bg-[#edf5fc] hover:bg-[#00b4d8] text-[#00677d] hover:text-white border-[#bcc9ce]/40 hover:border-[#00b4d8] hover:shadow-[0_0_14px_rgba(0,180,216,0.35)]'
              }`}
              title="Herramientas, Normativa y Perfiles"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isAppsOpen ? 'close' : 'apps'}
              </span>
            </button>

            {isAppsOpen && (
              <div className="absolute right-0 top-12 w-68 rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,103,125,0.2)] border border-[#bcc9ce]/50 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-hud uppercase tracking-wider text-[#00677d] font-extrabold border-b border-[#edf5fc] mb-1 flex items-center justify-between">
                  <span>Perfiles y Cuentas</span>
                  <span className="text-[9px] text-slate-400 font-normal">CLORAGUA ID</span>
                </div>
                <button
                  onClick={() => {
                    setIsAppsOpen(false);
                    onOpenProfile?.();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[#151d22] hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:text-[#00677d] flex items-center gap-2.5 transition-all cursor-pointer group"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#00b4d8] group-hover:scale-110 text-[18px] transition-transform">
                    person_add
                  </span>
                  <div>
                    <div className="font-bold text-[12px] text-[#00677d]">Registrar Nuevo Perfil</div>
                    <div className="text-[10px] text-[#3d494d]">Mediante correo y contraseña</div>
                  </div>
                </button>
                <div className="px-3 py-1.5 text-[10px] font-hud uppercase tracking-wider text-[#3d494d] font-bold border-b border-[#edf5fc] mb-1 mt-1">
                  Herramientas Técnicas
                </div>
                <button
                  onClick={() => {
                    setIsAppsOpen(false);
                    onOpenVolumeCalc?.();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[#151d22] hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:text-[#00677d] flex items-center gap-2.5 transition-all cursor-pointer group"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#00b4d8] group-hover:scale-110 text-[18px] transition-transform">
                    view_in_ar
                  </span>
                  <div>
                    <div className="font-bold text-[12px]">Calcular Volumen Tanque</div>
                    <div className="text-[10px] text-[#3d494d]">Cilindros, cisternas, cubos</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsAppsOpen(false);
                    onOpenCalibrate?.();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[#151d22] hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-[#006c51] flex items-center gap-2.5 transition-all cursor-pointer group"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#10e7b2] group-hover:scale-110 text-[18px] transition-transform">tune</span>
                  <div>
                    <div className="font-bold text-[12px]">Calibrar Dosificador</div>
                    <div className="text-[10px] text-[#3d494d]">Prueba de aforo y mL/min</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsAppsOpen(false);
                    onOpenSolutionPrep?.();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[#151d22] hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:text-[#00677d] flex items-center gap-2.5 transition-all cursor-pointer group"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#00677d] group-hover:scale-110 text-[18px] transition-transform">
                    science
                  </span>
                  <div>
                    <div className="font-bold text-[12px]">Preparar Solución Cloro</div>
                    <div className="text-[10px] text-[#3d494d]">Dilución C₁·V₁ = C₂·V₂</div>
                  </div>
                </button>
                {onOpenDpdCamera && (
                  <button
                    onClick={() => {
                      setIsAppsOpen(false);
                      onOpenDpdCamera();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[#151d22] hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:text-[#00677d] flex items-center gap-2.5 transition-all cursor-pointer group"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[#00b4d8] group-hover:scale-110 text-[18px] transition-transform">
                      photo_camera
                    </span>
                    <div>
                      <div className="font-bold text-[12px] text-[#00677d]">Cámara Escáner DPD</div>
                      <div className="text-[10px] text-[#3d494d]">Fotómetro de cloro libre en vivo</div>
                    </div>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsAppsOpen(false);
                    onOpenNormative?.();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-[13px] font-medium text-[#151d22] hover:bg-gradient-to-r hover:from-amber-50 hover:to-lime-50 hover:text-[#708a00] flex items-center gap-2.5 transition-all border-t border-[#edf5fc] mt-1 cursor-pointer group"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#93b100] group-hover:scale-110 text-[18px] transition-transform">
                    menu_book
                  </span>
                  <div>
                    <div className="font-bold text-[12px]">Normativa D.S. 031-2010-SA</div>
                    <div className="text-[10px] text-[#3d494d]">LMP y Guías DIGESA/MINSA</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <button
            onClick={onOpenProfile}
            className="relative min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group"
            title={`Perfil: ${operatorName} (Clic para ver/gestionar)`}
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00b4d8] to-[#00677d] group-hover:from-[#10e7b2] group-hover:to-[#00b4d8] text-white flex items-center justify-center font-hud text-[13px] font-bold shadow-[0_0_12px_rgba(0,180,216,0.3)] ring-2 ring-[#4cd6fb] group-hover:ring-[#10e7b2] transition-all">
              {initialLetter}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10e7b2] ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
