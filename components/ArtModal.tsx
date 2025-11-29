
import React from 'react';
import { ArtPiece } from '../types';
import { Icons } from './Icon';

interface ArtModalProps {
  piece: ArtPiece | null;
  onClose: () => void;
  theme: 'light' | 'dark';
}

/**
 * Detailed view modal for an artwork.
 * Displays high-res image, full prompts, and a simulated Auction/Trading interface.
 */
export const ArtModal: React.FC<ArtModalProps> = ({ piece, onClose, theme }) => {
  if (!piece) return null;
  
  const isDark = theme === 'dark';

  // Calculate time remaining (mock visual)
  const timeLeft = Math.max(0, piece.auction.endTime - Date.now());
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm transition-opacity ${isDark ? 'bg-black/90' : 'bg-neutral-900/90'}`}>
      <div className={`relative w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] ${isDark ? 'bg-[#1a1a1f] ring-1 ring-white/10' : 'bg-white'}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${isDark ? 'bg-black/50 text-white hover:bg-black' : 'bg-white/50 text-neutral-900 hover:bg-white'}`}
        >
          <Icons.Close className="w-6 h-6" />
        </button>

        {/* Image Section (Left/Top) */}
        <div className={`w-full md:w-3/5 flex items-center justify-center p-4 md:p-8 overflow-auto ${isDark ? 'bg-[#0a0a0c]' : 'bg-neutral-100'}`}>
          <img 
            src={piece.url} 
            alt={piece.title} 
            className="max-w-full max-h-[80vh] shadow-2xl object-contain rounded-sm"
          />
        </div>

        {/* Commercial/Auction Section (Right/Bottom) */}
        <div className={`w-full md:w-2/5 flex flex-col ${isDark ? 'bg-[#1a1a1f] text-neutral-200' : 'bg-white text-neutral-900'}`}>
          
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-neutral-200 dark:border-neutral-800">
             <div className="flex items-center gap-2 mb-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
                <Icons.Activity className="w-3 h-3" />
                Live Auction
             </div>
             <h2 className="text-3xl font-serif font-bold leading-tight mb-2">{piece.title}</h2>
             <div className="flex items-center gap-2 text-sm opacity-60">
                <span>By {piece.auction.artistName}</span>
                <span>•</span>
                <span>{piece.period} Period</span>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
             <div className={`p-6 ${isDark ? 'bg-[#1a1a1f]' : 'bg-white'}`}>
                <span className="block text-xs uppercase tracking-wider opacity-50 mb-1">Current Bid</span>
                <div className="text-2xl font-bold flex items-baseline gap-1">
                   <span className="text-lg opacity-50">Ξ</span>
                   {piece.auction.currentBid.toFixed(2)}
                </div>
                <div className="text-xs opacity-50 mt-1">$ {(piece.auction.currentBid * 2450).toLocaleString()}</div>
             </div>
             <div className={`p-6 ${isDark ? 'bg-[#1a1a1f]' : 'bg-white'}`}>
                <span className="block text-xs uppercase tracking-wider opacity-50 mb-1">Auction Ends</span>
                <div className="text-2xl font-bold flex items-center gap-2">
                   {hours}h {mins}m
                </div>
                <div className="text-xs opacity-50 mt-1">{piece.auction.bidCount} Bids placed</div>
             </div>
             <div className={`p-6 ${isDark ? 'bg-[#1a1a1f]' : 'bg-white'}`}>
                <span className="block text-xs uppercase tracking-wider opacity-50 mb-1">Critic Score</span>
                <div className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
                   <Icons.Star className="w-5 h-5 fill-current" />
                   {piece.auction.rating}
                </div>
             </div>
             <div className={`p-6 ${isDark ? 'bg-[#1a1a1f]' : 'bg-white'}`}>
                <span className="block text-xs uppercase tracking-wider opacity-50 mb-1">Popularity</span>
                <div className="text-2xl font-bold flex items-center gap-2 text-rose-500">
                   <Icons.Heart className="w-5 h-5 fill-current" />
                   {(piece.auction.likes / 1000).toFixed(1)}k
                </div>
             </div>
          </div>

          {/* Scrollable Description */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
             <h4 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-70">Curator's Note</h4>
             <p className="opacity-80 leading-relaxed text-sm mb-6">
               {piece.description}
               <br/><br/>
               The composition explores the tension between {piece.period.toLowerCase()} tones and geometric abstraction. 
               Typical of {piece.auction.artistName}'s recent algorithm, it deconstructs the subject into a rhythmic visual puzzle.
             </p>

             <h4 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-70">Prompt DNA</h4>
             <div className={`text-xs p-3 rounded leading-relaxed font-mono ${isDark ? 'bg-black/30 text-neutral-400' : 'bg-neutral-100 text-neutral-600'}`}>
                {piece.prompt.substring(0, 150)}...
             </div>
          </div>

          {/* Footer Actions */}
          <div className={`p-6 md:p-8 border-t ${isDark ? 'border-neutral-800 bg-[#0f0f13]' : 'border-neutral-100 bg-neutral-50'}`}>
             <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                   <Icons.Gavel className="w-5 h-5" />
                   Place Bid
                </button>
                <a 
                   href={piece.url} 
                   download={`auction-${piece.id}.png`}
                   className={`px-6 py-4 rounded-full border font-bold flex items-center gap-2 transition-all ${isDark ? 'border-neutral-700 hover:bg-white/10' : 'border-neutral-300 hover:bg-neutral-200'}`}
                >
                   <Icons.Download className="w-5 h-5" />
                </a>
             </div>
             <p className="text-center text-[10px] opacity-40 mt-3 uppercase tracking-widest">
                Verified on Blockchain • Gas Fees Apply
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};
