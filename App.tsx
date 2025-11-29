
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
  const [showInfo, setShowInfo] = useState(false);
  
  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneNodesRef = useRef<AudioNode[]>([]);
  const melodyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // --- Audio Logic ---
  
  // E Lydian Scale frequencies for the generative melody
  // E, F#, G#, A#, B, C#, D#
  const MELODY_NOTES = [
    329.63, // E4
    369.99, // F#4
    415.30, // G#4
    466.16, // A#4 (Lydian 4th)
    493.88, // B4
    622.25, // D#5
    659.25, // E5
    739.99, // F#5
  ];

  const playRandomNote = (ctx: AudioContext, output: AudioNode) => {
    if (ctx.state === 'closed') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();

    // Configure Oscillator
    osc.type = Math.random() > 0.6 ? 'sine' : 'triangle';
    const note = MELODY_NOTES[Math.floor(Math.random() * MELODY_NOTES.length)];
    osc.frequency.value = note;

    // Random Pan (-0.8 to 0.8)
    panner.pan.value = (Math.random() * 1.6) - 0.8;

    // Envelope (Bell/Glass shape)
    const now = ctx.currentTime;
    const duration = 2 + Math.random() * 3; // 2s to 5s tail
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05); // Fast attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Long exponential decay

    // Connect graph
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(output);

    osc.start();
    osc.stop(now + duration + 1);

    // Schedule next note (random interval 2s to 7s)
    const nextInterval = 2000 + Math.random() * 5000;
    melodyTimeoutRef.current = setTimeout(() => playRandomNote(ctx, output), nextInterval);
  };

  /**
   * Initializes the generative audio engine.
   * Creates a spatial environment with delay lines and random melodic triggers.
   */
  const startAudio = () => {
    // 1. Init Context
    if (!audioCtxRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // 2. Master Output & Dynamics
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5; // Base volume
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.ratio.value = 12;
    
    masterGain.connect(compressor);
    compressor.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // 3. Spatial Effects (Delay/Echo Line) to simulate Gallery Hall
    const delayNode = ctx.createDelay();
    delayNode.delayTime.value = 0.4; // 400ms echo
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.3;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 2000; // Dampen high freq on echoes

    // Connect Delay Loop
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayFilter);
    delayFilter.connect(delayNode);
    // Connect Delay to Master
    delayNode.connect(masterGain);

    // 4. Drone Layers (Background Atmosphere)
    const drones: AudioNode[] = [];
    
    // Drone 1: Deep E2 Sine with Drift
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 82.41; // E2
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.3;
    
    // LFO for Pitch Drift (Organic feel)
    const lfo1 = ctx.createOscillator();
    lfo1.frequency.value = 0.1; // Very slow
    const lfo1Gain = ctx.createGain();
    lfo1Gain.gain.value = 1.5; // +/- 1.5 Hz
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(osc1.frequency);
    lfo1.start();
    
    osc1.connect(osc1Gain);
    osc1Gain.connect(masterGain);
    osc1Gain.connect(delayNode); // Send some drone to delay for space
    osc1.start();
    
    drones.push(osc1, osc1Gain, lfo1, lfo1Gain);

    // Drone 2: Higher B2 Triangle (Glassy Texture)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 123.47; // B2
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.1;
    
    // LFO for Volume Swell (Breathing)
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.05; 
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 0.05; 
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(osc2Gain.gain);
    lfo2.start();

    osc2.connect(osc2Gain);
    osc2Gain.connect(masterGain);
    osc2.start();

    drones.push(osc2, osc2Gain, lfo2, lfo2Gain);
    
    // Store refs for cleanup
    droneNodesRef.current = drones;

    // 5. Start Generative Melody Loop
    // Send notes to both master and delay for space
    const melodyOutput = ctx.createGain();
    melodyOutput.connect(masterGain);
    melodyOutput.connect(delayNode);
    playRandomNote(ctx, melodyOutput);

    setIsAudioPlaying(true);
  };

  const stopAudio = () => {
    // Stop Melody Loop
    if (melodyTimeoutRef.current) {
      clearTimeout(melodyTimeoutRef.current);
      melodyTimeoutRef.current = null;
    }

    // Stop Drones
    droneNodesRef.current.forEach(node => {
        try { 
            if (node instanceof OscillatorNode) node.stop();
            node.disconnect();
        } catch(e) {}
    });
    droneNodesRef.current = [];

    // Close/Suspend Context
    if (audioCtxRef.current) {
       audioCtxRef.current.suspend();
    }
    
    setIsAudioPlaying(false);
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
          <div className="flex items-center gap-2 md:gap-4">
             {isAutoPlaying && (
               <div className={`hidden sm:flex items-center gap-2 text-xs font-medium animate-pulse px-3 py-1 rounded-full border ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                 Live Curating
               </div>
             )}
             
             {/* Info/Docs */}
             <button 
               onClick={() => setShowInfo(true)}
               className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600'}`}
               title="Documentation"
             >
                <Icons.Info className="w-5 h-5" />
             </button>

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

      {/* Info/Documentation Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
           <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[85vh] overflow-y-auto animate-fade-in-up ${theme === 'dark' ? 'bg-[#1a1a1f] text-neutral-200 border border-white/10' : 'bg-white text-neutral-900'}`}>
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
              >
                <Icons.Close className="w-6 h-6 opacity-60" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-neutral-900 text-white rounded-md flex items-center justify-center">
                    <Icons.Palette className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-serif font-bold">About the Gallery</h2>
                    <p className="text-xs uppercase tracking-widest opacity-60">Cubist Avant-Garde • v2.1</p>
                 </div>
              </div>

              <div className="space-y-6 text-sm leading-relaxed opacity-90">
                <section>
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Icons.Sparkles className="w-4 h-4 text-blue-500" /> AI Art Generation
                   </h3>
                   <p>
                      Powered by the <strong>Gemini 2.5 Flash</strong> model, this engine generates unique Cubist masterpieces by deconstructing subjects into geometric planes.
                      Use the <strong>Settings</strong> button in the control panel to curate specific subjects or artistic periods.
                   </p>
                </section>

                <section>
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Icons.Activity className="w-4 h-4 text-green-500" /> Auction Simulation
                   </h3>
                   <p>
                      Every piece is minted with simulated commercial data, including:
                      <ul className="list-disc pl-5 mt-1 space-y-1 opacity-80">
                         <li>Algorithmic ETH pricing based on "hype" factors.</li>
                         <li>Mock bidder identities and expert critic ratings.</li>
                         <li>Live countdown timers and bid history.</li>
                      </ul>
                   </p>
                </section>

                <section>
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Icons.VolumeOn className="w-4 h-4 text-purple-500" /> Generative Ambient Audio
                   </h3>
                   <p>
                      Experience a fully <strong>generative soundscape</strong> that evolves over time. 
                      An algorithm plays random notes from an <em>E Lydian</em> scale at organic intervals to create a wind-chime effect, 
                      blended with shifting drone layers and spatial reverb to simulate a large gallery hall.
                   </p>
                </section>

                <div className={`p-4 rounded-lg mt-4 text-xs ${theme === 'dark' ? 'bg-white/5' : 'bg-neutral-100'}`}>
                   <strong>Tip:</strong> Enable "Auto" mode to sit back and watch the AI curate a never-ending exhibition while you listen to the ambient score.
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
