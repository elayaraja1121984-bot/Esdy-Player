import React from 'react';
import { BarChart3, Clock, Flame, Zap, Award, Disc, Headphones, Sparkles, TrendingUp } from 'lucide-react';
import { UserAnalytics, Translations } from '../types';

interface AnalyticsViewProps {
  analytics: UserAnalytics;
  t: Translations;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, t }) => {
  const hours = Math.floor(analytics.totalListeningSeconds / 3600);
  const minutes = Math.floor((analytics.totalListeningSeconds % 3600) / 60);

  const maxHourly = Math.max(...analytics.hourlyHabits, 1);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pb-20 select-none px-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-900/90 border-b border-zinc-800 rounded-t-xl shadow-md">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-red-500" />
          <h2 className="font-retro-header text-lg font-bold text-zinc-100 uppercase tracking-wider">
            {t.analytics}
          </h2>
        </div>
        <span className="text-xs font-tech text-zinc-400">
          Engagement & Metrics
        </span>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Time */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-tech font-bold uppercase">Time Listened</span>
            <Clock className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <span className="text-xl font-bold font-digital text-zinc-100">{hours}h {minutes}m</span>
            <p className="text-[10px] text-zinc-500 mt-0.5">Total deck playback</p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-tech font-bold uppercase">Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <span className="text-xl font-bold font-digital text-orange-400">{analytics.streakDays} Days</span>
            <p className="text-[10px] text-zinc-500 mt-0.5">Daily listening habit</p>
          </div>
        </div>

        {/* Tape Mileage */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-tech font-bold uppercase">Tape Mileage</span>
            <Disc className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className="text-xl font-bold font-digital text-amber-400">{analytics.tapeCounterMileage}m</span>
            <p className="text-[10px] text-zinc-500 mt-0.5">Ribbon spooled</p>
          </div>
        </div>

        {/* Bass Score */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between shadow">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-tech font-bold uppercase">Bass Power</span>
            <Zap className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <span className="text-xl font-bold font-digital text-red-400">{analytics.bassLoverScore}%</span>
            <p className="text-[10px] text-zinc-500 mt-0.5">Sub-bass lover</p>
          </div>
        </div>
      </div>

      {/* 24-Hour Listening Activity Heatmap */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-red-500" />
            {t.hourlyHabits}
          </span>
          <span className="text-[10px] font-digital text-zinc-400">Peak: 8 PM - 10 PM</span>
        </div>

        {/* 24-Hour Bar Chart */}
        <div className="flex items-end justify-between gap-1 h-28 bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
          {analytics.hourlyHabits.map((val, hour) => {
            const heightPercent = (val / maxHourly) * 100;
            const isPeak = val >= maxHourly * 0.75;

            return (
              <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isPeak
                      ? 'bg-gradient-to-t from-red-600 to-rose-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                      : 'bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  style={{ height: `${Math.max(6, heightPercent)}%` }}
                />
                {/* Tooltip */}
                <div className="absolute -top-7 hidden group-hover:flex bg-black border border-zinc-700 text-[9px] font-digital text-white px-1 rounded z-20 whitespace-nowrap">
                  {hour}:00 ({val} tracks)
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[9px] font-digital text-zinc-500 px-1">
          <span>00:00 (Midnight)</span>
          <span>06:00</span>
          <span>12:00 (Noon)</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Top Artists & Genre Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Top Artists */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2.5 shadow">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-amber-400" />
            Top Played Artists
          </span>

          <div className="flex flex-col gap-2">
            {analytics.topArtists.map((artist, idx) => (
              <div key={artist.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center font-digital font-bold text-zinc-500">#{idx + 1}</span>
                  <span className="text-zinc-200 font-medium truncate">{artist.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-digital text-red-400 font-bold">{artist.plays} plays</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Genres */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2.5 shadow">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            {t.topGenres}
          </span>

          <div className="flex flex-col gap-2">
            {analytics.topGenres.map((genre) => (
              <div key={genre.genre} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-tech">
                  <span className="text-zinc-300">{genre.genre}</span>
                  <span className="font-digital text-zinc-400">{genre.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${genre.percentage}%`,
                      backgroundColor: genre.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Stream Quality & Bitrate Distribution */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 shadow">
        <span className="text-xs font-tech font-bold uppercase tracking-wider text-zinc-300">
          Audio Engine Stream Quality Breakdown
        </span>
        <div className="grid grid-cols-3 gap-2 text-center">
          {analytics.audioQualityDistribution.map(q => (
            <div key={q.quality} className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] font-tech text-zinc-400 block truncate">{q.quality}</span>
              <span className="text-base font-digital font-bold text-amber-400">{q.count}</span>
              <span className="text-[9px] text-zinc-500 block">Streams</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
