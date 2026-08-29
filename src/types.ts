export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: number; // in seconds
  durationStr: string; // e.g. "4:23"
  audioUrl: string;
  coverUrl: string;
  genre: string;
  language: string;
  bitrate: string; // e.g. "320 kbps" or "Hi-Res FLAC 24-bit"
  isOffline: boolean;
  isFavorite: boolean;
  playCount: number;
  tapeSide: 'A' | 'B';
  tapeLabelText?: string;
  customUploaded?: boolean;
}

export type TabType = 
  | 'player' 
  | 'playlist' 
  | 'equalizer' 
  | 'vumeters' 
  | 'cassettes' 
  | 'skins' 
  | 'analytics' 
  | 'settings';

export type ThemeId = 
  | 'dark-titanium' 
  | 'brushed-silver' 
  | 'brushed-metal' 
  | 'deep-onyx' 
  | 'vintage-wood' 
  | 'champagne-gold' 
  | 'cyber-neon';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'es' | 'fr' | 'ja' | 'de';
export type LanguageId = LanguageCode;

export type VUMeterStyle = 
  | 'analog-green' 
  | 'analog-integra-blue' 
  | 'analog-tcd-red' 
  | 'led-tri-color' 
  | 'lcd-vintage-blue' 
  | 'lcd-amber-matrix' 
  | 'boombox-spectrum';

export type CassetteSkinId = 
  | 'raks-chrome' 
  | 'studio52-reel' 
  | 'type4-metal' 
  | '70s-gold' 
  | '80s-transparent' 
  | '90s-neon' 
  | 'custom-diy';

export type TapeType = 'TYPE I' | 'TYPE II' | 'TYPE IV';

export interface SoundFXState {
  bassBoostEnabled: boolean;
  bassBoostLevel: number; // 0 to 10
  subBass3dB: boolean; // +3dB sub bass expansion
  trebleLevel: number; // -10 to +10
  balance: number; // -10 to +10 (left to right)
  surround3D: boolean;
  tapeHissNoise: boolean;
  tapeHissVolume: number; // 0 to 100
  tapeFlutter?: boolean;
  eqPreset: string;
  eqBands: number[]; // 10 bands gains in dB (-12 to +12)
  stereoMode: string;
  tapeType: TapeType;
  dolbyNR: boolean;
  volume: number; // 0 to 100
}

export interface UserAnalytics {
  totalListeningSeconds: number;
  totalSessions: number;
  tracksPlayed: number;
  tapeCounterMileage: number;
  topArtists: { name: string; plays: number; duration: number }[];
  topGenres: { genre: string; percentage: number; color: string }[];
  hourlyHabits: number[]; // 24 values
  audioQualityDistribution: { quality: string; count: number }[];
  bassLoverScore: number; // 0-100%
  streakDays: number;
  offlineTracksCount: number;
}

export interface EqualizerPreset {
  name: string;
  bands: number[]; // 10 band gains
}

export interface Translations {
  player: string;
  playlist: string;
  bassBoost: string;
  vumeters: string;
  cassettes: string;
  analytics: string;
  settings: string;
  stereoCassetteDeck: string;
  tapeCounter: string;
  volume: string;
  bass: string;
  treble: string;
  balance: string;
  tapeSelector: string;
  enableSoundFX: string;
  subBassMode: string;
  preset: string;
  bassEnhanceEngine: string;
  surround3D: string;
  tapeHissSim: string;
  allTracks: string;
  onlineStreaming: string;
  offlineTracks: string;
  favorites: string;
  bulkUpload: string;
  searchPlaceholder: string;
  analogMeters: string;
  digitalMeters: string;
  moreCassettesHeading: string;
  standardPacks: string;
  expansionPacks: string;
  themeOptions: string;
  languageOptions: string;
  hourlyHabits: string;
  topGenres: string;
}
