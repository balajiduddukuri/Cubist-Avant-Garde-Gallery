
import React, { useState } from 'react';
import { Button } from './Button';
import { Icons } from './Icon';
import { SUBJECTS, PERIODS } from '../constants';
import { GenerationParams, PeriodType } from '../types';

interface ControlsProps {
  onGenerate: (params: GenerationParams) => void;
  isGenerating: boolean;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

/**
 * Main floating control panel.
 * Allows users to manually commission art, toggle auto-curation, 
 * control audio, and configure specific subject/period settings.
 */
export const Controls: React.FC<ControlsProps> = ({ 
  onGenerate, 
  isGenerating, 
  isAutoPlaying,
  onToggleAutoPlay,
  isAudioPlaying,
  onToggleAudio
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('random');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('random');
  
  const handleGenerateClick = () => {
    let subject = selectedSubject;
    let period = selectedPeriod;

    if (subject === 'random') {
      subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    }
    
    if (period === 'random') {
      const periods = Object.keys(PERIODS) as PeriodType[];
      period = periods[Math.floor(Math.random() * periods.length)];
    }
    
    const params: GenerationParams = {
      subject: subject,
      period: period as PeriodType,
    };

    onGenerate(params);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none flex flex-col items-center gap-3">
       
       {/* Settings Panel (Popover) */}
       {showSettings && (
         <div className="pointer-events-auto w-full bg-white/95 backdrop-blur-xl border border-neutral-200 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 animate-fade-in-up">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-1 tracking-wider">Subject</label>
              <div className="relative">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full appearance-none bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8"
                >
                  <option value="random">✨ Surprise Me (Random)</option>
                  {SUBJECTS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <Icons.ChevronDown className="absolute right-2 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-1 tracking-wider">Period / Palette</label>
              <div className="relative">
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full appearance-none bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8"
                >
                  <option value="random">✨ Surprise Me (Random)</option>
                  {Object.keys(PERIODS).map(p => (
                    <option key={p} value={p}>{p} Period</option>
                  ))}
                </select>
                <Icons.ChevronDown className="absolute right-2 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
         </div>
       )}

       <div className="pointer-events-auto w-full bg-white/95 backdrop-blur-xl border border-neutral-200 p-3 rounded-full shadow-2xl flex items-center justify-between gap-2 md:gap-4">
          
          {/* Auto-Curate Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleAutoPlay}
            className={`flex items-center gap-2 transition-colors ${isAutoPlaying ? 'text-blue-600 bg-blue-50' : 'text-neutral-500'}`}
          >
            {isAutoPlaying ? <Icons.Pause className="w-4 h-4" /> : <Icons.Play className="w-4 h-4" />}
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Auto</span>
          </Button>

          {/* Settings Toggle */}
          <button 
             onClick={() => setShowSettings(!showSettings)}
             className={`p-3 rounded-full transition-colors flex-shrink-0 ${showSettings ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50'}`}
             title="Customize Generation"
             disabled={isAutoPlaying}
          >
             <Icons.Settings className="w-5 h-5" />
          </button>

          {/* Main Action */}
          <div className="flex-1">
            <Button 
              onClick={handleGenerateClick} 
              loading={isGenerating} 
              disabled={isGenerating || isAutoPlaying}
              size="md"
              className="w-full shadow-md"
            >
              {isGenerating ? (
                'Painting...'
              ) : isAutoPlaying ? (
                <span className="flex items-center animate-pulse">
                   <Icons.Sparkles className="w-4 h-4 mr-2" />
                   Curating...
                </span>
              ) : (
                <>
                  <Icons.Palette className="w-4 h-4 mr-2" />
                  Commission Piece
                </>
              )}
            </Button>
          </div>

          {/* Audio Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleAudio}
            className={`flex items-center gap-2 transition-colors ${isAudioPlaying ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-400'}`}
          >
             {isAudioPlaying ? <Icons.VolumeOn className="w-4 h-4" /> : <Icons.VolumeOff className="w-4 h-4" />}
             <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Audio</span>
          </Button>

       </div>
    </div>
  );
};
