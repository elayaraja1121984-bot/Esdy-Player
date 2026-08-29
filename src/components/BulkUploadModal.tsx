import React, { useState, useRef } from 'react';
import { X, Upload, Plus, FileText, Music, Sparkles } from 'lucide-react';
import { Track } from '../types';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTracks: (newTracks: Track[]) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onAddTracks
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'urls' | 'retro-packs'>('files');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file uploads
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const added: Track[] = [];

    Array.from(files).forEach((file: File, idx: number) => {
      const objUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const parts = cleanName.split('-');
      const artistOrTitle = parts[0] || 'User Audio';
      const maybeTitle = parts[1];

      added.push({
        id: `upload-${Date.now()}-${idx}`,
        title: maybeTitle ? maybeTitle.trim() : artistOrTitle.trim(),
        artist: maybeTitle ? artistOrTitle.trim() : 'Local Audio File',
        album: 'My Cassette Uploads',
        year: 2024,
        genre: 'User Audio',
        language: 'Custom',
        duration: 210,
        durationStr: '3:30',
        audioUrl: objUrl,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
        isOffline: true,
        isFavorite: false,
        playCount: 0,
        tapeSide: 'A',
        tapeLabelText: cleanName.slice(0, 30),
        bitrate: '320 kbps MP3'
      });
    });

    setTimeout(() => {
      onAddTracks(added);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  // Handle stream URL or M3U list
  const handleImportUrls = () => {
    if (!urlInput.trim()) return;

    const lines = urlInput.split('\n').filter(l => l.trim().length > 0);
    const added: Track[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') && !trimmed.startsWith('#EXTINF')) return;

      const title = `Stream #${idx + 1}`;
      added.push({
        id: `stream-${Date.now()}-${idx}`,
        title: title,
        artist: 'Online Radio / Stream',
        album: 'M3U Web Stream',
        year: 2024,
        genre: 'Web Audio',
        language: 'Various',
        duration: 300,
        durationStr: '5:00',
        audioUrl: trimmed,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
        isOffline: false,
        isFavorite: false,
        playCount: 0,
        tapeSide: 'A',
        tapeLabelText: `Web Stream ${idx + 1}`,
        bitrate: 'Hi-Fi Stream'
      });
    });

    onAddTracks(added);
    setUrlInput('');
    onClose();
  };

  // Quick retro packs
  const loadCuratedPack = (packType: 'synthwave' | 'tamil80s' | 'ambientLoFi') => {
    let packTracks: Track[] = [];

    if (packType === 'synthwave') {
      packTracks = [
        {
          id: `synth-1-${Date.now()}`,
          title: 'Nightcall Overdrive',
          artist: 'Kavinsky Vibe',
          album: 'Neon Horizon 1984',
          year: 1984,
          genre: 'Synthwave',
          language: 'Electronic',
          duration: 254,
          durationStr: '4:14',
          audioUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
          coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
          isOffline: true,
          isFavorite: false,
          playCount: 0,
          tapeSide: 'A',
          tapeLabelText: 'NEON 1984 - SIDE A',
          bitrate: '320 kbps'
        },
        {
          id: `synth-2-${Date.now()}`,
          title: 'Cyber Highway Sunset',
          artist: 'Lazerhawk Echo',
          album: 'Retro Future',
          year: 1986,
          genre: 'Outrun',
          language: 'Electronic',
          duration: 215,
          durationStr: '3:35',
          audioUrl: 'https://cdn.freesound.org/previews/615/615099_11861866-lq.mp3',
          coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
          isOffline: true,
          isFavorite: true,
          playCount: 0,
          tapeSide: 'A',
          tapeLabelText: 'CYBER HIGHWAY 86',
          bitrate: '320 kbps'
        }
      ];
    } else if (packType === 'tamil80s') {
      packTracks = [
        {
          id: `tamil-1-${Date.now()}`,
          title: 'Shenbagame Shenbagame',
          artist: 'Asha Bhosle & S.P.B.',
          album: 'Enga Ooru Pattukaran',
          year: 1987,
          genre: 'Tamil Golden Folk',
          language: 'Tamil',
          duration: 270,
          durationStr: '4:30',
          audioUrl: 'https://cdn.freesound.org/previews/608/608752_11861866-lq.mp3',
          coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80',
          isOffline: true,
          isFavorite: true,
          playCount: 0,
          tapeSide: 'A',
          tapeLabelText: 'SHENBAGAME 87',
          bitrate: '320 kbps'
        },
        {
          id: `tamil-2-${Date.now()}`,
          title: 'Ilaya Nila Pozhigirathe',
          artist: 'S.P. Balasubrahmanyam',
          album: 'Payanangal Mudivathillai',
          year: 1982,
          genre: 'Acoustic Guitar Classic',
          language: 'Tamil',
          duration: 288,
          durationStr: '4:48',
          audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
          coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
          isOffline: true,
          isFavorite: true,
          playCount: 0,
          tapeSide: 'B',
          tapeLabelText: 'ILAYA NILA GUITAR',
          bitrate: '320 kbps'
        }
      ];
    } else {
      packTracks = [
        {
          id: `lofi-1-${Date.now()}`,
          title: 'Midnight Cassette Beats',
          artist: 'ChillHop Master',
          album: 'Tape Hiss Dreams',
          year: 2023,
          genre: 'Lo-Fi Chill',
          language: 'Instrumental',
          duration: 190,
          durationStr: '3:10',
          audioUrl: 'https://cdn.freesound.org/previews/568/568285_11861866-lq.mp3',
          coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80',
          isOffline: true,
          isFavorite: false,
          playCount: 0,
          tapeSide: 'A',
          tapeLabelText: 'LO-FI STUDY MIX',
          bitrate: '320 kbps'
        }
      ];
    }

    onAddTracks(packTracks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 border-2 border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-red-500" />
            <h3 className="font-retro-header text-base font-bold text-zinc-100 uppercase tracking-wider">
              Bulk Playlist & Audio Importer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-950/60 p-2 gap-2">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 py-2 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'files' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Audio Files (MP3 / WAV / FLAC)
          </button>

          <button
            onClick={() => setActiveTab('urls')}
            className={`flex-1 py-2 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'urls' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            M3U / Stream URLs
          </button>

          <button
            onClick={() => setActiveTab('retro-packs')}
            className={`flex-1 py-2 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'retro-packs' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Retro Packs
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {activeTab === 'files' && (
            <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-xl bg-zinc-950/60 text-center transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*,.mp3,.wav,.flac,.m4a,.ogg"
                onChange={handleFilesSelected}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
                <Music className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100 font-tech uppercase">
                  Drag & Drop Audio Files Here
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Supports bulk selection of MP3, FLAC, WAV, AAC, and OGG formats.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-tech font-bold uppercase tracking-wider shadow"
              >
                {isProcessing ? 'Processing Audio Files...' : 'Browse Local Files'}
              </button>
            </div>
          )}

          {activeTab === 'urls' && (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-tech text-zinc-300 font-semibold">
                Paste direct MP3 / FLAC stream URLs or M3U playlist text (one per line):
              </label>
              <textarea
                rows={6}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/stream.mp3&#10;https://radiostream.org/live.flac"
                className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-red-500"
              />
              <button
                onClick={handleImportUrls}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-tech font-bold uppercase tracking-wider self-end"
              >
                Import Streams
              </button>
            </div>
          )}

          {activeTab === 'retro-packs' && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-tech text-zinc-400">
                Click any curated collection to instantly add it to your cassette library:
              </span>

              {/* Pack 1 */}
              <div
                onClick={() => loadCuratedPack('tamil80s')}
                className="p-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/80 rounded-xl cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-100 font-tech">
                      80s Ilaiyaraaja Golden Cassette Classics
                    </h5>
                    <span className="text-[10px] text-zinc-400">
                      2 Remastered Tracks • High Fidelity
                    </span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-amber-400" />
              </div>

              {/* Pack 2 */}
              <div
                onClick={() => loadCuratedPack('synthwave')}
                className="p-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-fuchsia-500/80 rounded-xl cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-600/30 border border-fuchsia-500/50 flex items-center justify-center text-fuchsia-400">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-100 font-tech">
                      1984 Synthwave & Outrun Master Tape
                    </h5>
                    <span className="text-[10px] text-zinc-400">
                      2 Heavy Bass Tracks • Neon Future
                    </span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-fuchsia-400" />
              </div>

              {/* Pack 3 */}
              <div
                onClick={() => loadCuratedPack('ambientLoFi')}
                className="p-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-cyan-500/80 rounded-xl cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-100 font-tech">
                      Lo-Fi Tape Hiss & Chill Study Mixtape
                    </h5>
                    <span className="text-[10px] text-zinc-400">
                      1 Warm Analog Track
                    </span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
