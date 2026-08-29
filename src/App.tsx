import React, { useState, useEffect, useRef } from 'react';
import { 
  TabType, 
  Track, 
  SoundFXState, 
  VUMeterStyle, 
  CassetteSkinId, 
  ThemeId, 
  LanguageId, 
  UserAnalytics 
} from './types';
import { mockTracks, initialAnalytics, defaultSoundFX } from './data/mockTracks';
import { translations } from './utils/i18n';
import { audioEngine } from './utils/audioEngine';
import { PlayerView } from './components/PlayerView';
import { PlaylistView } from './components/PlaylistView';
import { EqualizerView } from './components/EqualizerView';
import { VUMetersGalleryView } from './components/VUMetersGalleryView';
import { CassetteSkinsView } from './components/CassetteSkinsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { BottomNavBar } from './components/BottomNavBar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { BulkUploadModal } from './components/BulkUploadModal';
import { InfoModal } from './components/InfoModal';
import { InstallModal } from './components/InstallModal';

export function App() {
  // State
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(263);
  const [progress, setProgress] = useState<number>(0);

  // Deck State
  const [soundFX, setSoundFX] = useState<SoundFXState>(defaultSoundFX);
  const [activeTab, setActiveTab] = useState<TabType>('player');
  const [vuMeterStyle, setVuMeterStyle] = useState<VUMeterStyle>('analog-green');
  const [cassetteSkin, setCassetteSkin] = useState<CassetteSkinId>('raks-chrome');
  const [customTapeTitle, setCustomTapeTitle] = useState<string>('');
  const [tapeSide, setTapeSide] = useState<'A' | 'B'>('A');
  const [tapeCounter, setTapeCounter] = useState<number>(128);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'all' | 'one' | 'off'>('all');

  // Preferences
  const [theme, setTheme] = useState<ThemeId>('dark-titanium');
  const [language, setLanguage] = useState<LanguageId>('ta');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mechanicalSounds, setMechanicalSounds] = useState<boolean>(true);
  const [autoTapeFlip, setAutoTapeFlip] = useState<boolean>(true);
  const [hiResAudio, setHiResAudio] = useState<boolean>(true);

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);

  // Analytics
  const [analytics, setAnalytics] = useState<UserAnalytics>(initialAnalytics);

  const currentTrack = tracks[currentTrackIndex] || tracks[0] || null;
  const t = translations[language] || translations['en'];

  // Initialize audio callbacks
  useEffect(() => {
    audioEngine.setOnTimeUpdate((curr, dur) => {
      setCurrentTime(curr);
      setDuration(dur);
      const ratio = dur > 0 ? curr / dur : 0;
      setProgress(ratio);
      setTapeCounter(prev => prev + 0.05);

      // Increment listening analytics
      setAnalytics(prev => ({
        ...prev,
        totalListeningSeconds: prev.totalListeningSeconds + 0.25
      }));
    });

    audioEngine.setOnEnded(() => {
      handleTrackEnded();
    });

    return () => {
      audioEngine.pause();
    };
  }, [currentTrackIndex, tracks, repeatMode, isShuffle, autoTapeFlip, tapeSide]);

  // Load track into engine when index changes
  useEffect(() => {
    if (currentTrack) {
      audioEngine.loadTrack(currentTrack.audioUrl);
      if (isPlaying) {
        audioEngine.play();
      }
    }
  }, [currentTrackIndex]);

  // Apply Sound FX to engine
  useEffect(() => {
    audioEngine.setVolume(soundFX.volume);
    audioEngine.setBass(soundFX.bassBoostEnabled ? soundFX.bassBoostLevel : 0, soundFX.subBass3dB);
    audioEngine.setTreble(soundFX.trebleLevel);
    audioEngine.setBalance(soundFX.balance);
    audioEngine.setStereoSurround(soundFX.surround3D);
    audioEngine.setTapeHiss(soundFX.tapeHissNoise, soundFX.tapeHissVolume);
    audioEngine.setDolbyNR(soundFX.dolbyNR);
    audioEngine.setEqualizer(soundFX.eqBands);
  }, [soundFX]);

  // Handle Track Ended
  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    if (autoTapeFlip) {
      setTapeSide(prev => (prev === 'A' ? 'B' : 'A'));
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
      audioEngine.play();
    } else if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      audioEngine.play();
    } else if (repeatMode === 'all') {
      setCurrentTrackIndex(0);
      audioEngine.play();
    } else {
      setIsPlaying(false);
    }
  };

  // Play / Pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      audioEngine.seek(0);
    } else {
      setCurrentTrackIndex(prev => (prev > 0 ? prev - 1 : tracks.length - 1));
      if (isPlaying) audioEngine.play();
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex(prev => (prev < tracks.length - 1 ? prev + 1 : 0));
    }
    if (isPlaying) audioEngine.play();
  };

  const handleSeek = (time: number) => {
    audioEngine.seek(time);
    setCurrentTime(time);
    if (duration > 0) setProgress(time / duration);
  };

  const handleSoundFXChange = (fx: Partial<SoundFXState>) => {
    setSoundFX(prev => ({ ...prev, ...fx }));
  };

  const handleToggleFavorite = (trackId?: string) => {
    const targetId = trackId || currentTrack?.id;
    if (!targetId) return;

    setTracks(prev =>
      prev.map(t => (t.id === targetId ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  const handleToggleOffline = (trackId: string) => {
    setTracks(prev =>
      prev.map(t => (t.id === trackId ? { ...t, isOffline: !t.isOffline } : t))
    );
  };

  const handleDeleteTrack = (trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      handleNext();
    }
  };

  const handleAddTracks = (newTracks: Track[]) => {
    setTracks(prev => [...prev, ...newTracks]);
    setActiveTab('playlist');
  };

  const handleSelectTrack = (track: Track) => {
    const idx = tracks.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setIsPlaying(true);
      setActiveTab('player');
    }
  };

  // Theme Wrapper Classes
  const getThemeClass = () => {
    switch (theme) {
      case 'brushed-silver':
        return 'bg-gradient-to-b from-slate-900 via-zinc-900 to-black text-slate-100';
      case 'deep-onyx':
        return 'bg-black text-zinc-100';
      case 'vintage-wood':
        return 'bg-gradient-to-b from-[#1c120c] via-zinc-950 to-black text-amber-100';
      case 'champagne-gold':
        return 'bg-gradient-to-b from-[#211a0c] via-zinc-950 to-black text-amber-200';
      case 'cyber-neon':
        return 'bg-gradient-to-b from-[#170524] via-zinc-950 to-black text-fuchsia-100';
      case 'dark-titanium':
      default:
        return 'bg-gradient-to-b from-[#18181b] via-[#0f0f11] to-[#09090b] text-zinc-100';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} flex flex-col font-sans transition-colors duration-300 antialiased selection:bg-red-500 selection:text-white`}>
      {/* Main Responsive Stage */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 pt-2 sm:pt-4 pb-20">
        {activeTab === 'player' && (
          <PlayerView
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            soundFX={soundFX}
            vuMeterStyle={vuMeterStyle}
            cassetteSkin={cassetteSkin}
            tapeSide={tapeSide}
            tapeCounter={tapeCounter}
            isShuffle={isShuffle}
            repeatMode={repeatMode}
            t={t}
            onPlayPause={handlePlayPause}
            onStop={handleStop}
            onPrev={handlePrev}
            onNext={handleNext}
            onSeek={handleSeek}
            onToggleShuffle={() => setIsShuffle(prev => !prev)}
            onToggleRepeat={() =>
              setRepeatMode(prev => (prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'))
            }
            onToggleFavorite={() => handleToggleFavorite()}
            onSoundFXChange={handleSoundFXChange}
            onResetTapeCounter={() => setTapeCounter(0)}
            onToggleDolby={() => setSoundFX(prev => ({ ...prev, dolbyNR: !prev.dolbyNR }))}
            onToggleTapeSide={() => setTapeSide(prev => (prev === 'A' ? 'B' : 'A'))}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenPlaylist={() => setActiveTab('playlist')}
            onOpenSettings={() => setActiveTab('settings')}
            onOpenInfo={() => setIsInfoOpen(true)}
            onOpenInstall={() => setIsInstallOpen(true)}
          />
        )}

        {activeTab === 'playlist' && (
          <PlaylistView
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            t={t}
            onSelectTrack={handleSelectTrack}
            onBackToPlayer={() => setActiveTab('player')}
            onOpenBulkUpload={() => setIsBulkUploadOpen(true)}
            onToggleFavorite={handleToggleFavorite}
            onToggleOffline={handleToggleOffline}
            onDeleteTrack={handleDeleteTrack}
          />
        )}

        {activeTab === 'equalizer' && (
          <EqualizerView
            soundFX={soundFX}
            t={t}
            onSoundFXChange={handleSoundFXChange}
            onResetEQ={() =>
              setSoundFX(prev => ({
                ...prev,
                eqPreset: 'Flat',
                eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                bassBoostLevel: 5,
                trebleLevel: 0
              }))
            }
          />
        )}

        {activeTab === 'vumeters' && (
          <VUMetersGalleryView
            currentStyle={vuMeterStyle}
            isPlaying={isPlaying}
            t={t}
            onSelectStyle={style => {
              setVuMeterStyle(style);
              audioEngine.playMechanicalSound('click');
            }}
          />
        )}

        {activeTab === 'cassettes' && (
          <CassetteSkinsView
            currentSkin={cassetteSkin}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            t={t}
            onSelectSkin={skinId => {
              setCassetteSkin(skinId);
              audioEngine.playMechanicalSound('click');
            }}
            customTapeTitle={customTapeTitle}
            onChangeCustomTapeTitle={setCustomTapeTitle}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            t={t}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currentTheme={theme}
            currentLanguage={language}
            isDarkMode={isDarkMode}
            mechanicalSounds={mechanicalSounds}
            autoTapeFlip={autoTapeFlip}
            hiResAudio={hiResAudio}
            t={t}
            onSelectTheme={th => {
              setTheme(th);
              audioEngine.playMechanicalSound('click');
            }}
            onSelectLanguage={lang => {
              setLanguage(lang);
              audioEngine.playMechanicalSound('click');
            }}
            onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
            onToggleMechanicalSounds={() => setMechanicalSounds(prev => !prev)}
            onToggleAutoTapeFlip={() => setAutoTapeFlip(prev => !prev)}
            onToggleHiResAudio={() => setHiResAudio(prev => !prev)}
            onClearCache={() => {
              setTracks(prev => prev.map(t => ({ ...t, isOffline: false })));
            }}
            onResetSettings={() => {
              setTheme('dark-titanium');
              setLanguage('ta');
              setMechanicalSounds(true);
              setAutoTapeFlip(true);
              setHiResAudio(true);
            }}
            onOpenInstall={() => setIsInstallOpen(true)}
          />
        )}
      </main>

      {/* Slide-out Retro Deck Drawer */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        activeTab={activeTab}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        t={t}
        onClose={() => setIsDrawerOpen(false)}
        onSelectTab={tab => setActiveTab(tab)}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onAddTracks={handleAddTracks}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Install / APK Modal */}
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      {/* Bottom Retro Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        t={t}
        onSelectTab={tab => {
          setActiveTab(tab);
          audioEngine.playMechanicalSound('click');
        }}
      />
    </div>
  );
}
export default App;
