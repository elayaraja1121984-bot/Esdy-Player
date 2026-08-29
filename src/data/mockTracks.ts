import { Track, EqualizerPreset, SoundFXState } from '../types';

export const initialTracks: Track[] = [
  {
    id: 'track-1',
    title: 'Rasathi Unna Kanatha Nenju :: isaimini.one',
    artist: 'P. Jayachandran',
    album: 'Vaidehi Kathirunthal',
    year: 1984,
    duration: 263,
    durationStr: '4:23',
    audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    genre: 'Tamil • Melody',
    language: 'Tamil',
    bitrate: 'Hi-Res FLAC 24-bit/96kHz',
    isOffline: true,
    isFavorite: true,
    playCount: 142,
    tapeSide: 'A',
    tapeLabelText: "P. Jayachandran '84"
  },
  {
    id: 'track-2',
    title: 'Araikka Vaichcha - MassTamilan',
    artist: 'Mano, S. Janaki',
    album: 'Maharasan',
    year: 1993,
    duration: 305,
    durationStr: '5:05',
    audioUrl: 'https://cdn.freesound.org/previews/676/676392_14234057-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    genre: 'Tamil • Folk Pop',
    language: 'Tamil',
    bitrate: '320 kbps MP3',
    isOffline: false,
    isFavorite: true,
    playCount: 98,
    tapeSide: 'A',
    tapeLabelText: 'Maharasan 93'
  },
  {
    id: 'track-3',
    title: 'Azhagana Manchapura :: isaimini.one',
    artist: 'Mano, S. Janaki, Ilaiyaraaja',
    album: 'Ellame En Rasathan',
    year: 1995,
    duration: 302,
    durationStr: '5:02',
    audioUrl: 'https://cdn.freesound.org/previews/615/615099_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    genre: 'Tamil • Ilaiyaraaja Classic',
    language: 'Tamil',
    bitrate: '320 kbps MP3',
    isOffline: true,
    isFavorite: false,
    playCount: 67,
    tapeSide: 'A',
    tapeLabelText: 'Ellame En Rasathan'
  },
  {
    id: 'track-4',
    title: 'Poovana :: isaimini.one',
    artist: 'Mano, Vani Jayaram',
    album: 'Ponmana Selvan',
    year: 1989,
    duration: 277,
    durationStr: '4:37',
    audioUrl: 'https://cdn.freesound.org/previews/568/568285_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
    genre: 'Tamil • Retro Duet',
    language: 'Tamil',
    bitrate: '320 kbps MP3',
    isOffline: false,
    isFavorite: true,
    playCount: 84,
    tapeSide: 'A',
    tapeLabelText: 'Ponmana Selvan'
  },
  {
    id: 'track-5',
    title: 'Poove Eduthu - oruTamilsong.com',
    artist: 'P. Jayachandran, S. Janaki',
    album: 'Amman Kovil Kizhakale',
    year: 1986,
    duration: 272,
    durationStr: '4:32',
    audioUrl: 'https://cdn.freesound.org/previews/587/587251_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    genre: 'Tamil • Evergreen Romance',
    language: 'Tamil',
    bitrate: 'Master Audio 24-bit',
    isOffline: true,
    isFavorite: true,
    playCount: 215,
    tapeSide: 'B',
    tapeLabelText: 'Amman Kovil Hit'
  },
  {
    id: 'track-6',
    title: 'Chinnamani Kuyile - oruTamilsong.com',
    artist: 'S P Balasubrahmanyam',
    album: 'Amman Kovil Kizhakale',
    year: 1986,
    duration: 265,
    durationStr: '4:25',
    audioUrl: 'https://cdn.freesound.org/previews/608/608752_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80',
    genre: 'Tamil • SPB Legendary',
    language: 'Tamil',
    bitrate: '320 kbps MP3',
    isOffline: true,
    isFavorite: true,
    playCount: 310,
    tapeSide: 'B',
    tapeLabelText: 'SPB - Chinnamani'
  },
  {
    id: 'track-7',
    title: 'Retro Chrome Super Bass Wave',
    artist: 'Cassette Master Studio',
    album: 'Analog Synth Journey',
    year: 1988,
    duration: 245,
    durationStr: '4:05',
    audioUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80',
    genre: 'Synthwave • Hi-Fi Bass',
    language: 'Instrumental',
    bitrate: 'Lossless FLAC 96kHz',
    isOffline: true,
    isFavorite: false,
    playCount: 178,
    tapeSide: 'A',
    tapeLabelText: 'RAKS Super Chrome 90'
  },
  {
    id: 'track-8',
    title: 'Karutha Machan - oruTamilsong.com',
    artist: 'S. Janaki',
    album: 'Pudhu Nellu Pudhu Naathu',
    year: 1991,
    duration: 280,
    durationStr: '4:40',
    audioUrl: 'https://cdn.freesound.org/previews/490/490899_10747441-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=300&auto=format&fit=crop&q=80',
    genre: 'Tamil • Rural Folk Melodies',
    language: 'Tamil',
    bitrate: '320 kbps MP3',
    isOffline: false,
    isFavorite: false,
    playCount: 45,
    tapeSide: 'B',
    tapeLabelText: 'Janaki Classic'
  }
];

export const equalizerPresets: EqualizerPreset[] = [
  {
    name: 'Flat',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: 'Mega Bass Boost',
    bands: [10, 8.5, 6.5, 3.5, 1, 0, 1, 2.5, 4, 5]
  },
  {
    name: '80s Cassette Warmth',
    bands: [6, 7.5, 5, 2, 1, 2, 4, 1.5, -2, -4]
  },
  {
    name: 'Rock',
    bands: [6.5, 4.5, 2, -1, -2, 1, 3.5, 6, 7, 7.5]
  },
  {
    name: 'Pop',
    bands: [-1.5, 2, 5, 6, 4, -1, -2, 2, 4.5, 5.5]
  },
  {
    name: 'Jazz & Acoustic',
    bands: [4, 3, 1.5, 2, -1.5, -1.5, 1.5, 3, 4.5, 6]
  },
  {
    name: 'Vocal Clarity',
    bands: [-3, -2, 0, 3, 7, 7.5, 5, 2, 1, 0]
  },
  {
    name: 'Walkman Headphone',
    bands: [8, 6, 3, 0, -1, 1, 3, 5, 7, 8]
  }
];

export const initialAnalytics = {
  totalListeningSeconds: 48920, // ~13.5 hours
  totalSessions: 54,
  tracksPlayed: 187,
  tapeCounterMileage: 3420,
  topArtists: [
    { name: 'P. Jayachandran', plays: 64, duration: 16800 },
    { name: 'S P Balasubrahmanyam', plays: 52, duration: 13850 },
    { name: 'S. Janaki', plays: 41, duration: 10900 },
    { name: 'Ilaiyaraaja', plays: 30, duration: 7370 }
  ],
  topGenres: [
    { genre: 'Tamil Melody', percentage: 48, color: '#ef4444' },
    { genre: 'Retro Duet', percentage: 24, color: '#f59e0b' },
    { genre: 'Ilaiyaraaja Classic', percentage: 18, color: '#10b981' },
    { genre: 'Synthwave & Hi-Fi', percentage: 10, color: '#3b82f6' }
  ],
  hourlyHabits: [
    5, 2, 0, 0, 0, 1, 4, 12, 25, 18, 14, 20, 28, 22, 16, 18, 24, 38, 48, 55, 62, 45, 28, 14
  ],
  audioQualityDistribution: [
    { quality: 'Hi-Res FLAC 24-bit', count: 94 },
    { quality: '320 kbps MP3', count: 72 },
    { quality: 'Master Audio', count: 21 }
  ],
  bassLoverScore: 92,
  streakDays: 14,
  offlineTracksCount: 5
};

export const mockTracks = initialTracks;

export const defaultSoundFX: SoundFXState = {
  volume: 85,
  bassBoostLevel: 6,
  bassBoostEnabled: true,
  subBass3dB: true,
  trebleLevel: 2,
  balance: 0,
  stereoMode: 'STEREO CASSETTE DECK',
  tapeType: 'TYPE II',
  dolbyNR: true,
  eqPreset: '80s Cassette Warmth',
  eqBands: [6, 7.5, 5, 2, 1, 2, 4, 1.5, -2, -4],
  tapeHissNoise: false,
  tapeHissVolume: 25,
  surround3D: true
};
