
import React, { useState, useEffect, useRef } from 'react';
import { ArtPiece, GenerationParams, PeriodType } from './types';
import { generateArtPiece } from './services/geminiService';
import { Gallery } from './components/Gallery';
import { Controls } from './components/Controls';
import { ArtModal } from './components/ArtModal';
import { SUBJECTS, PERIODS } from './constants';
import { Icons } from './components/Icon';

/**
 * Randomizes generation parameters for the auto-curation loop.
 */
const getRandomParams = (): GenerationParams => {
  const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const periods = Object.keys(PERIODS) as PeriodType[];
  const randomPeriod = periods[Math.floor(Math.random() * periods.length)];
  
  return {
    subject: randomSubject,
    period: randomPeriod,
  };
};

/**
 * Root Application Component.
 * Manages global state:
 * - Gallery Collection (Art pieces)
 * - Theme (Light/Dark)
 * - Audio Engine (Web Audio API)
 * - Auto-curation loop
 */
const App: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<ArtPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<ArtPiece | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // New features state
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // --- Audio Logic ---
  /**
   * Initializes the Web Audio API context and generates an ambient soundscape.
   * Uses a mix of Sine (Sub-bass) and Triangle (Mid/High) waves for a "glassy" 
   * texture suitable for a gallery environment.
   */
  const startAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop existing if any
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.0; // Start silent for fade in
    masterGain.connect(ctx.destination);
    
    // Fade in
    masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3);

    // Richer Ambient Chord (E Major 9)
    const layers = [
      { freq: 82.41, type: 'sine', vol: 0.4 },      // Sub Bass
      { freq: 164.81, type: 'sine', vol: 0.2 },     // Octave up bass
      { freq: 246.94, type: 'triangle', vol: 0.15 }, // Fifth
      { freq: 311.13, type: 'triangle', vol: 0.15 }, // Major 7th
      { freq: 369.99, type: 'sine', vol: 0.1 },      // 9th
    ];
    
    layers.forEach((layer, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = layer.type as OscillatorType;
      osc.frequency.value = layer.freq;
      
      // Detune for organic feel
      const detune = Math.random() * 6 - 3;
      osc.detune.value = detune;

      // Connect LFO for subtle amplitude modulation (breathing effect)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.03 + (Math.random() * 0.05); // Slow breath
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.15; // Depth
      lfo.connect(lfoGain.gain);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      // Base volume
      gain.gain.value = layer.vol;
      
      osc.start();
      lfo.start();
      
      oscillatorsRef.current.push(osc);
      oscillatorsRef.current.push(lfo); 
    });

    setIsAudioPlaying(true);
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      oscillatorsRef.current.forEach(osc => {
         try { osc.stop(); } catch(e){}
      });
      oscillatorsRef.current = [];
      setIsAudioPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // --- Auto-Curate Logic ---
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runAutoLoop = () => {
      if (isAutoPlaying && !isGenerating) {
        handleGenerate(getRandomParams());
      }
    };

    if (isAutoPlaying) {
      // If gallery is empty, generate immediately, otherwise wait 15s
      const delay = galleryItems.length === 0 ? 500 : 15000;
      
      if (!isGenerating) {
        timeoutId = setTimeout(runAutoLoop, delay);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [isAutoPlaying, isGenerating, galleryItems.length]);


  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newPiece = await generateArtPiece(params);
      setGalleryItems(prev => [newPiece, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError("Failed to create art. Please try again. " + (err.message || ""));
      if (isAutoPlaying) setIsAutoPlaying(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500 selection:text-white pb-32 transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0f0f13] text-neutral-100' : 'bg-[#fdfbf7] text-neutral-900'}`}>
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-30 backdrop-blur-md border-b transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f0f13]/80 border-white/10' : 'bg-[#fdfbf7]/80 border-neutral-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-sm flex items-center justify-center shadow-lg ${theme === 'dark' ? 'bg-white' : 'bg-neutral-900'}`}>
                <div className={`w-4 h-4 transform rotate-45 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}></div>
             </div>
             <div>
               <h1 className="font-serif text-2xl font-bold tracking-tight">Cubist Avant-Garde</h1>
               <p className={`text-[10px] uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>Digital Auction House</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {isAutoPlaying && (
               <div className={`flex items-center gap-2 text-xs font-medium animate-pulse px-3 py-1 rounded-full border ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                 Live Curating
               </div>
             )}
             
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`}
               title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
             >
                {theme === 'light' ? <Icons.Moon className="w-5 h-5" /> : <Icons.Sun className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 max-w-7xl mx-auto min-h-screen relative px-4">
        
        {error && (
            <div className="mx-auto max-w-2xl mb-8 p-4 bg-red-50 border border-red-100 rounded text-red-800 text-sm flex items-center justify-between shadow-sm">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="font-bold ml-4 p-1 hover:bg-red-100 rounded">✕</button>
            </div>
        )}

        <Gallery items={galleryItems} onSelect={setSelectedPiece} theme={theme} />

        <Controls 
          onGenerate={handleGenerate} 
          isGenerating={isGenerating} 
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
        />
      </main>

      <ArtModal 
        piece={selectedPiece} 
        onClose={() => setSelectedPiece(null)} 
        theme={theme}
      />
    </div>
  );
};

export default App;
