import React, { useState, useEffect } from 'react';
import { OperatorProfile } from '../types';

interface ProfileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'register' | 'switch';
  profiles: OperatorProfile[];
  activeProfileId: string;
  onSelectProfile: (profile: OperatorProfile) => void;
  onAddProfile: (newProfile: OperatorProfile) => void;
  onSaveProfile?: (name: string, role: string) => void;
}

export const ProfileAuthModal: React.FC<ProfileAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onSaveProfile,
}) => {
  const [mode, setMode] = useState<'register' | 'switch'>(initialMode);

  // Form states for new profile registration
  const [name, setName] = useState('Ing.Zaira Salvador Amaya');
  const [email, setEmail] = useState('operador@cloragua.pe');
  const [role, setRole] = useState('Administrador de Sistema Hídrico');
  const [badge, setBadge] = useState('ADMINISTRADOR DE SISTEMA HÍDRICO');
  const [guardianTitle, setGuardianTitle] = useState('Guardián Potable');
  const [community, setCommunity] = useState('JASS El molino, Cascas, La Libertad');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingrese el nombre del operador');
      return;
    }

    const newProfile: OperatorProfile = {
      id: `prof-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || 'operador@cloragua.pe',
      role: role.trim() || 'Administrador de Sistema Hídrico',
      badge: (badge.trim() || role.trim()).toUpperCase(),
      guardianTitle: guardianTitle.trim() || 'Guardián Potable',
      community: community.trim() || 'JASS Comunitaria',
      password: password || '123456',
      avatarLetter: name.trim().charAt(0).toUpperCase() || 'I',
    };

    onAddProfile(newProfile);
    onSelectProfile(newProfile);
    if (onSaveProfile) {
      onSaveProfile(newProfile.name, newProfile.role);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#001b22] text-white rounded-3xl border border-cyan-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#00242e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#00677d] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">
                {mode === 'register' ? 'person_add' : 'switch_account'}
              </span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[16px] text-white">
                {mode === 'register' ? 'Registrar Nuevo Perfil' : 'Cambiar de Cuenta'}
              </h3>
              <p className="text-[11.5px] text-cyan-300/80">
                Sistema Oficial CLORAGUA • D.S. N.° 031-2010-SA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cyan-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex items-center border-b border-cyan-500/20 bg-[#00171d] px-4 pt-2">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`pb-2.5 px-4 font-hud text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              mode === 'register'
                ? 'border-[#10e7b2] text-[#10e7b2]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            + Registrar Perfil
          </button>
          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`pb-2.5 px-4 font-hud text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              mode === 'switch'
                ? 'border-[#00b4d8] text-[#00b4d8]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Cuentas Registradas ({profiles.length})
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-hud">
              {errorMsg}
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="flex flex-col gap-3.5 text-[13px]">
              <div>
                <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                  Nombre Completo del Operador / Ingeniero:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ing.Zaira Salvador Amaya"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                    required
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-cyan-400/50 text-[18px]">
                    person
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Correo Electrónico Oficial:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operador@cloragua.pe"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Contraseña / PIN de Firma:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Cargo o Especialidad:
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Administrador de Sistema Hídrico"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Distintivo / Badge Superior:
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="ADMINISTRADOR DE SISTEMA HÍDRICO"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] uppercase focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Título de Vigilancia:
                  </label>
                  <select
                    value={guardianTitle}
                    onChange={(e) => setGuardianTitle(e.target.value)}
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12px] focus:outline-none focus:border-[#10e7b2]"
                  >
                    <option value="Guardián Potable">Guardián Potable</option>
                    <option value="Vigilante Sanitario">Vigilante Sanitario</option>
                    <option value="Operador Comunitario">Operador Comunitario</option>
                    <option value="Auditor de Calidad">Auditor de Calidad</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    JASS / Organización / Red:
                  </label>
                  <input
                    type="text"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    placeholder="JASS El molino, Cascas, La Libertad"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-hud text-[12px] font-bold uppercase transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:opacity-95 text-[#002116] font-hud text-[12px] font-extrabold uppercase tracking-wide shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Registrar y Activar</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-cyan-200/80 mb-1">
                Seleccione el perfil con el que desea operar y certificar las dosificaciones en la bitácora:
              </p>

              <div className="divide-y divide-cyan-500/20">
                {profiles.map((p) => {
                  const isActive = p.id === activeProfileId;
                  const initial = p.avatarLetter || p.name.charAt(0).toUpperCase();

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProfile(p);
                        if (onSaveProfile) {
                          onSaveProfile(p.name, p.role);
                        }
                        onClose();
                      }}
                      className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#002833] border-2 border-[#10e7b2] shadow-sm'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-[#007791] text-white flex items-center justify-center font-hud text-lg font-black shrink-0">
                          {initial}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-hud font-bold text-[13.5px] text-white truncate">
                              {p.name}
                            </span>
                            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-[#d7f9ef] text-[#006c51] font-hud font-black uppercase">
                              {p.badge}
                            </span>
                          </div>
                          <span className="text-[11.5px] text-cyan-300/80 truncate mt-0.5">
                            {p.email} • {p.community}
                          </span>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="px-3 py-1 rounded-full bg-[#10e7b2]/20 border border-[#10e7b2] text-[#10e7b2] font-hud text-[10.5px] font-extrabold uppercase shrink-0">
                          ACTIVO
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1 rounded-full bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 font-hud text-[10.5px] font-bold uppercase transition-colors shrink-0"
                        >
                          Elegir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setMode('register')}
                className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-hud text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ Registrar Otro Perfil</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
