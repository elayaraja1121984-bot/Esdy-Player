import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ArrowLeft, 
  MoreVertical, 
  Music, 
  CheckCircle2, 
  Download, 
  Trash2, 
  Heart, 
  Play, 
  Wifi, 
  HardDrive,
  Filter
} from 'lucide-react';
import { Track, Translations } from '../types';

interface PlaylistViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  t: Translations;
  onSelectTrack: (track: Track) => void;
  onBackToPlayer: () => void;
  onOpenBulkUpload: () => void;
  onToggleFavorite: (trackId: string) => void;
  onToggleOffline: (trackId: string) => void;
  onDeleteTrack: (trackId: string) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  t,
  onSelectTrack,
  onBackToPlayer,
  onOpenBulkUpload,
  onToggleFavorite,
  onToggleOffline,
  onDeleteTrack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'online' | 'offline' | 'favorites'>('all');
  const [menuOpenTrackId, setMenuOpenTrackId] = useState<string | null>(null);

  // Filtered tracks
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'online') return !track.isOffline;
    if (activeFilter === 'offline') return track.isOffline;
    if (activeFilter === 'favorites') return track.isFavorite;
    return true;
  });

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-3 pb-20 select-none">
      {/* Header Bar (Matching Screenshot 2) */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/90 border-b border-zinc-800 rounded-t-xl shadow-md">
        <button
          onClick={onBackToPlayer}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-red-500" />
          <h2 className="font-retro-header text-lg font-bold text-zinc-100 uppercase tracking-wider">
            {t.playlist}
          </h2>
        </div>

        <button
          onClick={onOpenBulkUpload}
          title="Import / Export"
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 shadow-sm transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative px-2">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-950/90 text-zinc-200 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs: All / Online Hi-Fi / Offline / Favorites */}
      <div className="flex items-center gap-1.5 px-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
            activeFilter === 'all'
              ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <span>{t.allTracks}</span>
          <span className="text-[10px] opacity-80">({tracks.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('online')}
          className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
            activeFilter === 'online'
              ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>{t.onlineStreaming}</span>
        </button>

        <button
          onClick={() => setActiveFilter('offline')}
          className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
            activeFilter === 'offline'
              ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>{t.offlineTracks}</span>
        </button>

        <button
          onClick={() => setActiveFilter('favorites')}
          className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
            activeFilter === 'favorites'
              ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{t.favorites}</span>
        </button>
      </div>

      {/* Song List (Screenshot 2 faithful layout) */}
      <div className="flex flex-col gap-1.5 px-2">
        {filteredTracks.map((track) => {
          const isSelected = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              className={`relative rounded-xl p-2.5 transition-all flex items-center justify-between gap-3 border ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600/90 via-rose-600/90 to-red-700 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-300 border-zinc-800/80'
              }`}
            >
              {/* Cover Art Thumbnail */}
              <div 
                onClick={() => onSelectTrack(track)}
                className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow border border-zinc-700 bg-black"
              >
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isSelected && isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex items-end gap-0.5 h-4">
                      <div className="w-1 bg-white animate-bounce h-3 rounded-full" />
                      <div className="w-1 bg-white animate-bounce delay-75 h-4 rounded-full" />
                      <div className="w-1 bg-white animate-bounce delay-150 h-2 rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title, Artist, Album Info */}
              <div 
                onClick={() => onSelectTrack(track)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-zinc-100'}`}>
                  {track.title}
                </h4>
                <p className={`text-xs truncate ${isSelected ? 'text-red-100' : 'text-zinc-400'}`}>
                  {track.album} - {track.artist}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-digital ${isSelected ? 'text-red-200' : 'text-amber-400/90'}`}>
                    [{track.durationStr}]
                  </span>
                  {track.isOffline && (
                    <span className={`text-[9px] px-1 rounded flex items-center gap-0.5 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Offline
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons & 3-Dot Options Dropdown */}
              <div className="flex items-center gap-1 relative flex-shrink-0">
                <button
                  onClick={() => onToggleFavorite(track.id)}
                  className={`p-1.5 rounded-full hover:bg-black/20 transition-colors ${
                    track.isFavorite 
                      ? (isSelected ? 'text-white' : 'text-red-500') 
                      : (isSelected ? 'text-red-200' : 'text-zinc-500 hover:text-zinc-300')
                  }`}
                >
                  <Heart className={`w-4 h-4 ${track.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => setMenuOpenTrackId(menuOpenTrackId === track.id ? null : track.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-zinc-700 text-zinc-400'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {menuOpenTrackId === track.id && (
                  <div className="absolute right-0 top-8 z-30 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-1 flex flex-col gap-0.5 text-xs text-zinc-200">
                    <button
                      onClick={() => {
                        onSelectTrack(track);
                        setMenuOpenTrackId(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 text-green-400" />
                      Play Now
                    </button>

                    <button
                      onClick={() => {
                        onToggleOffline(track.id);
                        setMenuOpenTrackId(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      {track.isOffline ? 'Remove Offline Cache' : 'Download for Offline'}
                    </button>

                    <button
                      onClick={() => {
                        onDeleteTrack(track.id);
                        setMenuOpenTrackId(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-950/60 text-red-400 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove from Library
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredTracks.length === 0 && (
          <div className="text-center py-12 text-zinc-500 font-tech">
            <p className="text-sm">No songs match your search or filter.</p>
            <button
              onClick={onOpenBulkUpload}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold font-tech uppercase tracking-wider shadow"
            >
              Upload Tracks Now
            </button>
          </div>
        )}
      </div>

      {/* Floating Glowing Coral "+" Button for Bulk Upload (Screenshot 2 bottom right) */}
      <button
        onClick={onOpenBulkUpload}
        title={t.bulkUpload}
        className="fixed bottom-20 right-6 sm:right-10 w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(244,63,94,0.6)] active:scale-95 transition-transform z-20 border-2 border-rose-300"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};
