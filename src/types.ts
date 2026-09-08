export type WaterSystemType =
  | 'reservorio_apoyado'
  | 'reservorio_elevado'
  | 'cisterna'
  | 'red_distribucion'
  | 'pozo_subterraneo'
  | 'otro';

export interface WaterSystem {
  id: string;
  name: string;
  type: WaterSystemType;
  capacityLiters: number;
  currentLevelPercent: number;
  location: string;
  operator: string;
  lastInspectionDate: string;
  lastChlorinePpm: number;
}

export type ProductForm = 'solid' | 'liquid' | 'tablet' | 'gas';

export interface ChlorineProduct {
  id: string;
  name: string;
  form: ProductForm;
  activeChlorinePercent: number;
  defaultUnit: 'g' | 'kg' | 'mL' | 'L';
  description: string;
  standardPackaging: string;
  safetyRating: string;
}

export type SamplingStatus = 'compliant' | 'low' | 'excess';

export interface SamplingRecord {
  id: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  systemId: string;
  systemName: string;
  measurementPoint: string;
  freeChlorinePpm: number;
  ph: number;
  turbidityNtu: number;
  temperatureC: number;
  status: SamplingStatus;
  operator: string;
  observations: string;
  correctiveAction?: string;
}

export type TankGeometry =
  | 'rectangular'
  | 'cylindrical_vert'
  | 'cylindrical_horiz'
  | 'direct_volume';

export interface DosageCalculationParams {
  geometry: TankGeometry;
  // Dimensions in meters
  length?: number;
  width?: number;
  height?: number;
  waterDepth?: number;
  diameter?: number;
  // Or direct volume
  directVolumeLiters?: number;
  
  // Product info
  productId: string;
  customActivePercent?: number;

  // Water parameters
  currentChlorinePpm: number;
  targetChlorinePpm: number;
  chlorineDemandPpm: number;
  isShockDisinfection?: boolean;
}

export interface DosageCalculationResult {
  waterVolumeLiters: number;
  waterVolumeM3: number;
  effectiveChlorineNeedPpm: number;
  pureChlorineGrams: number;
  commercialDoseAmount: number;
  commercialDoseUnit: 'g' | 'kg' | 'mL' | 'L';
  productName: string;
  concentrationPercent: number;
  contactTimeMinutes: number;
  recommendedDilutionWaterLiters: number;
  safetyAdvice: string[];
  normativeReference: string;
}

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  badge: string;
  guardianTitle: string;
  email: string;
  community: string;
  password?: string;
  avatarLetter?: string;
}
