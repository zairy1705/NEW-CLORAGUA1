import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Calculator, 
  MapPin, 
  User, 
  Clock, 
  Droplet, 
  ShieldCheck, 
  AlertTriangle,
  Layers,
  X,
  Check
} from 'lucide-react';
import { WaterSystem, WaterSystemType } from '../types';

interface SystemsManagerViewProps {
  systems: WaterSystem[];
  onAddSystem: (newSys: Omit<WaterSystem, 'id'>) => void;
  onSelectSystemForDose: (systemId: string) => void;
  onSelectSystemForSample: (systemId: string) => void;
}

export const SystemsManagerView: React.FC<SystemsManagerViewProps> = ({
  systems,
  onAddSystem,
  onSelectSystemForDose,
  onSelectSystemForSample,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New system form state
  const [name, setName] = useState('');
  const [type, setType] = useState<WaterSystemType>('reservorio_apoyado');
  const [capacityLiters, setCapacityLiters] = useState<number>(30000);
  const [currentLevelPercent, setCurrentLevelPercent] = useState<number>(80);
  const [location, setLocation] = useState('');
  const [operator, setOperator] = useState('');

  const handleSubmitNewSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSystem({
      name: name.trim(),
      type,
      capacityLiters: Number(capacityLiters) || 10000,
      currentLevelPercent: Math.min(100, Math.max(0, Number(currentLevelPercent))),
      location: location.trim() || 'Sector General',
      operator: operator.trim() || 'Operador Sanitario',
      lastInspectionDate: 'Reciente',
      lastChlorinePpm: 1.0,
    });

    // Reset and close
    setName('');
    setLocation('');
    setOperator('');
    setIsModalOpen(false);
  };

  const getTypeLabel = (t: WaterSystemType) => {
    switch (t) {
      case 'reservorio_apoyado':
        return 'Reservorio Apoyado';
      case 'reservorio_elevado':
        return 'Reservorio Elevado';
      case 'cisterna':
        return 'Cisterna Subterránea';
      case 'red_distribucion':
        return 'Red de Distribución';
      case 'pozo_subterraneo':
        return 'Pozo Subterráneo';
      default:
        return 'Sistema de Agua';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-100 text-teal-800 border border-teal-200">
              Infraestructura
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {systems.length} Puntos de Almacenamiento y Red
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Gestión de Sistemas y Reservorios
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Control de capacidad, volumen útil almacenado y monitoreo de desinfección para cada infraestructura del servicio de agua potable.
          </p>
        </div>

        <button
          id="btn-add-system-modal"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Tanque</span>
        </button>
      </div>

      {/* Grid of Water Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {systems.map((sys) => {
          const isCompliant = sys.lastChlorinePpm >= 0.5 && sys.lastChlorinePpm <= 2.0;
          const currentWaterLiters = Math.round((sys.capacityLiters * sys.currentLevelPercent) / 100);

          return (
            <div
              key={sys.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Type Badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {getTypeLabel(sys.type)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompliant
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isCompliant ? (
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                    )}
                    {sys.lastChlorinePpm.toFixed(2)} ppm
                  </span>
                </div>

                {/* System Title */}
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {sys.name}
                </h3>

                {/* Location & Operator */}
                <div className="space-y-1.5 mt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sys.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sys.operator}</span>
                  </div>
                </div>

                {/* Level Progress Bar & Capacity */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                    <span className="text-slate-600">Nivel de Agua:</span>
                    <span className="font-bold text-teal-800">
                      {sys.currentLevelPercent}% ({currentWaterLiters.toLocaleString()} L)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${sys.currentLevelPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Capacidad Total:</span>
                    <span>{sys.capacityLiters.toLocaleString()} L ({(sys.capacityLiters / 1000).toFixed(1)} m³)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  id={`btn-dose-sys-${sys.id}`}
                  onClick={() => onSelectSystemForDose(sys.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition-colors border border-teal-200/60"
                >
                  <Calculator className="w-3.5 h-3.5 text-teal-600" />
                  <span>Dosificar</span>
                </button>
                <button
                  id={`btn-sample-sys-${sys.id}`}
                  onClick={() => onSelectSystemForSample(sys.id)}
                  className="inline-flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  <span>Muestrear</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding New System */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" />
                Registrar Nuevo Sistema / Tanque
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewSystem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Tanque / Sistema:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Reservorio Apoyado R-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Infraestructura:
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as WaterSystemType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="reservorio_apoyado">Reservorio Apoyado</option>
                    <option value="reservorio_elevado">Reservorio Elevado</option>
                    <option value="cisterna">Cisterna Subterránea</option>
                    <option value="red_distribucion">Red de Distribución</option>
                    <option value="pozo_subterraneo">Pozo Subterráneo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Capacidad (Litros):
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={capacityLiters}
                    onChange={(e) => setCapacityLiters(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ubicación / Sector:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Sector Norte - Lote 12"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operador Responsable:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Téc. Roberto Sánchez"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nivel de Llenado Inicial: {currentLevelPercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentLevelPercent}
                  onChange={(e) => setCurrentLevelPercent(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Guardar Tanque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
