import React, { useState, useEffect } from 'react';
import { TopHeader } from './components/TopHeader';
import { FloatingNavbar, TabType } from './components/FloatingNavbar';
import { WaterBackground } from './components/WaterBackground';
import { HeroVideoSection } from './components/HeroVideoSection';
import { DosageCalculatorView } from './components/DosageCalculatorView';
import { PhotometerHUDView } from './components/PhotometerHUDView';
import { SystemsManagerView } from './components/SystemsManagerView';
import { LogbookView } from './components/LogbookView';
import { DpdCameraModal } from './components/DpdCameraModal';
import { CalibrateModal } from './components/CalibrateModal';
import { SolutionPrepModal } from './components/SolutionPrepModal';
import { NormativeModal } from './components/NormativeModal';
import { VolumeCalcModal } from './components/VolumeCalcModal';
import { ProfileAuthModal } from './components/ProfileAuthModal';
import { INITIAL_SYSTEMS, INITIAL_RECORDS, INITIAL_PROFILES } from './data/mockInitialData';
import { WaterSystem, SamplingRecord, OperatorProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');

  // Persisted profiles and active profile
  const [profiles, setProfiles] = useState<OperatorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('cloragua_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('cloragua_active_profile_id') || 'prof-01';
  });

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || INITIAL_PROFILES[0];
  const operatorName = activeProfile.name;
  const operatorRole = activeProfile.badge || activeProfile.role;

  // Persisted water systems with fallback to exact INITIAL_SYSTEMS
  const [systems, setSystems] = useState<WaterSystem[]>(() => {
    try {
      const saved = localStorage.getItem('cloragua_systems');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      }
      return INITIAL_SYSTEMS;
    } catch {
      return INITIAL_SYSTEMS;
    }
  });

  // Persisted records with fallback to exact INITIAL_RECORDS
  const [records, setRecords] = useState<SamplingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cloragua_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed;
        }
      }
      return INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  const [selectedSystemId, setSelectedSystemId] = useState<string>(
    systems[0]?.id || 'sys-01'
  );

  // Modals state
  const [isDpdCameraOpen, setIsDpdCameraOpen] = useState(false);
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const [isSolutionPrepOpen, setIsSolutionPrepOpen] = useState(false);
  const [isNormativeOpen, setIsNormativeOpen] = useState(false);
  const [isVolumeCalcOpen, setIsVolumeCalcOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState<'register' | 'switch'>('register');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cloragua_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Could not save profiles', e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('cloragua_active_profile_id', activeProfileId);
      localStorage.setItem('cloragua_operator_name', operatorName);
      localStorage.setItem('cloragua_operator_role', operatorRole);
    } catch (e) {
      console.warn('Could not save profile metadata', e);
    }
  }, [activeProfileId, operatorName, operatorRole]);

  useEffect(() => {
    try {
      localStorage.setItem('cloragua_systems', JSON.stringify(systems));
    } catch (e) {
      console.warn('Could not save systems', e);
    }
  }, [systems]);

  useEffect(() => {
    try {
      localStorage.setItem('cloragua_records', JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save records', e);
    }
  }, [records]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleOpenRegisterProfile = () => {
    setProfileModalMode('register');
    setIsProfileOpen(true);
  };

  const handleOpenSwitchAccount = () => {
    setProfileModalMode('switch');
    setIsProfileOpen(true);
  };

  const handleSelectProfile = (p: OperatorProfile) => {
    setActiveProfileId(p.id);
    showToast(`✓ Operador activo: ${p.name}`);
  };

  const handleAddProfile = (newP: OperatorProfile) => {
    setProfiles((prev) => [newP, ...prev]);
    setActiveProfileId(newP.id);
    showToast(`✓ Perfil registrado con éxito: ${newP.name}`);
  };

  const handleApplyDpdReading = (ppm: number) => {
    const selectedSys = systems.find((s) => s.id === selectedSystemId) || systems[0];
    const now = new Date();
    const isCompliant = ppm >= 0.5 && ppm <= 2.0;
    const status: 'compliant' | 'low' | 'excess' = isCompliant
      ? 'compliant'
      : ppm < 0.5
      ? 'low'
      : 'excess';

    const newRecord: SamplingRecord = {
      id: `rec-${Date.now()}`,
      timestamp: now.toISOString(),
      dateStr: now.toLocaleDateString('es-PE'),
      timeStr: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      systemId: selectedSys.id,
      systemName: selectedSys.name,
      measurementPoint: 'Salida de Reservorio / Celda Fotométrica DPD',
      freeChlorinePpm: ppm,
      ph: 7.3,
      turbidityNtu: 0.8,
      temperatureC: 18.5,
      status,
      operator: operatorName,
      observations: `Medición analizada y capturada mediante Escáner Óptico DPD (${ppm.toFixed(2)} ppm).`,
      correctiveAction:
        ppm < 0.5
          ? 'Sub-cloración detectada. Calibrar dosificador e incrementar caudal de solución.'
          : ppm > 2.0
          ? 'Cloro superior a norma. Reducir apertura de goteo en cámara de carga.'
          : 'Parámetro en rango óptimo según D.S. N.° 031-2010-SA.',
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === selectedSys.id
          ? {
              ...sys,
              lastChlorinePpm: ppm,
              lastInspectionDate: 'Hoy',
            }
          : sys
      )
    );

    showToast(`✓ Medición DPD registrada: ${ppm.toFixed(2)} ppm Cl₂ en ${selectedSys.name}`);
  };

  const handleCreateRecord = (recordData: Omit<SamplingRecord, 'id' | 'timestamp'>) => {
    const newRecord: SamplingRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === recordData.systemId
          ? {
              ...sys,
              lastChlorinePpm: recordData.freeChlorinePpm,
              lastInspectionDate: 'Hoy',
            }
          : sys
      )
    );

    showToast('✓ Registro guardado en bitácora oficial');
  };

  const currentTabTitleMap: Record<TabType, string> = {
    inicio: 'PORTAL PRINCIPAL',
    dosis: 'ASISTENTE DE DOSIFICACIÓN',
    hud: 'BIO-TELEMETRÍA HUD',
    sistemas: 'RED DE SISTEMAS',
    registro: 'BITÁCORA OFICIAL',
  };

  const selectedSystem = systems.find((s) => s.id === selectedSystemId) || systems[0];

  return (
    <div className="min-h-screen bg-transparent text-[#151d22] flex flex-col font-sans selection:bg-[#00b4d8] selection:text-white relative overflow-x-hidden">
      {/* Interactive Water Ripples & Waves Background */}
      <WaterBackground />

      {/* Top Header matching exact screenshot and A5 component */}
      <TopHeader
        currentTabTitle={currentTabTitleMap[activeTab]}
        operatorName={operatorName}
        operatorRole={operatorRole}
        onNavigateHome={() => setActiveTab('inicio')}
        onOpenDpdCamera={() => setIsDpdCameraOpen(true)}
        onOpenNormative={() => setIsNormativeOpen(true)}
        onOpenCalibrate={() => setIsCalibrateOpen(true)}
        onOpenSolutionPrep={() => setIsSolutionPrepOpen(true)}
        onOpenVolumeCalc={() => setIsVolumeCalcOpen(true)}
        onOpenProfile={handleOpenSwitchAccount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 relative z-10 pb-20">
        {activeTab === 'inicio' && (
          <HeroVideoSection
            systems={systems}
            activeProfile={activeProfile}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenDpdCamera={() => setIsDpdCameraOpen(true)}
            onOpenSolutionPrep={() => setIsSolutionPrepOpen(true)}
            onOpenCalibrate={() => setIsCalibrateOpen(true)}
            onOpenNormative={() => setIsNormativeOpen(true)}
            onOpenRegisterProfile={handleOpenRegisterProfile}
            onOpenSwitchAccount={handleOpenSwitchAccount}
            onSelectSystemForDosage={(id) => {
              setSelectedSystemId(id);
              setActiveTab('dosis');
            }}
          />
        )}

        {activeTab === 'dosis' && (
          <DosageCalculatorView
            systems={systems}
            preselectedSystemId={selectedSystemId}
            onSystemSelect={(id) => setSelectedSystemId(id)}
            onRecordSaved={handleCreateRecord}
          />
        )}

        {activeTab === 'hud' && (
          <PhotometerHUDView
            systems={systems}
            records={records}
            onOpenNewRecord={() => setIsDpdCameraOpen(true)}
          />
        )}

        {activeTab === 'sistemas' && (
          <SystemsManagerView
            systems={systems}
            onUpdateSystems={(updated) => setSystems(updated)}
            onSelectSystemForDosage={(id) => {
              setSelectedSystemId(id);
              setActiveTab('dosis');
            }}
          />
        )}

        {activeTab === 'registro' && (
          <LogbookView
            records={records}
            systems={systems}
            onOpenNewRecord={() => setIsDpdCameraOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <FloatingNavbar
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <DpdCameraModal
        isOpen={isDpdCameraOpen}
        onClose={() => setIsDpdCameraOpen(false)}
        onApplyReading={handleApplyDpdReading}
        systemName={selectedSystem?.name}
      />

      <CalibrateModal
        isOpen={isCalibrateOpen}
        onClose={() => setIsCalibrateOpen(false)}
      />

      <SolutionPrepModal
        isOpen={isSolutionPrepOpen}
        onClose={() => setIsSolutionPrepOpen(false)}
      />

      <NormativeModal
        isOpen={isNormativeOpen}
        onClose={() => setIsNormativeOpen(false)}
      />

      <VolumeCalcModal
        isOpen={isVolumeCalcOpen}
        onClose={() => setIsVolumeCalcOpen(false)}
      />

      <ProfileAuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        initialMode={profileModalMode}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onAddProfile={handleAddProfile}
        onSaveProfile={(name, role) => {
          setProfiles((prev) =>
            prev.map((p) => (p.id === activeProfileId ? { ...p, name, role } : p))
          );
          showToast('✓ Perfil de operador actualizado');
        }}
      />

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#001f27]/95 backdrop-blur-md text-white border border-cyan-400/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-hud text-[12.5px] font-bold animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#10e7b2] text-[20px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
