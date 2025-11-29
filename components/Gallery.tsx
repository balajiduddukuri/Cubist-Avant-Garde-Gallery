
import React, { useState, useEffect, useMemo } from 'react';
import { ArtPiece } from '../types';
import { Icons } from './Icon';

interface GalleryProps {
  items: ArtPiece[];
  onSelect: (piece: ArtPiece) => void;
  theme: 'light' | 'dark';
}

/**
 * Masonry grid gallery component.
 * Displays artwork in a responsive layout with auction metrics (Price, Likes).
 * Handles chronological left-to-right distribution.
 */
export const Gallery: React.FC<GalleryProps> = ({ items, onSelect, theme }) => {
  const isDark = theme === 'dark';
  const [numCols, setNumCols] = useState(1);

  // Responsive column calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setNumCols(3);
      else if (width >= 768) setNumCols(2);
      else setNumCols(1);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute items into columns chronologically (Left-to-Right distribution)
  const columns = useMemo(() => {
    const cols: ArtPiece[][] = Array.from({ length: numCols }, () => []);
    items.forEach((item, index) => {
      cols[index % numCols].push(item);
    });
    return cols;
  }, [items, numCols]);

  if (items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-32 text-center transition-colors duration-500 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
        <Icons.Palette className="w-16 h-16 mb-4 opacity-20" />
        <h3 className={`text-xl font-serif mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>The Gallery is Empty</h3>
        <p className="max-w-md mx-auto text-sm opacity-80">
          Commission a new Cubist masterpiece using the controls below.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 px-4 md:px-12 pb-32 items-start justify-center">
      {columns.map((colItems, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-6 min-w-0">
          {colItems.map((piece, pieceIndex) => {
            const isNewest = piece.id === items[0].id;
            
            return (
              <div 
                key={piece.id} 
                className="animate-fade-in-up break-inside-avoid group relative cursor-pointer"
                style={{ animationDelay: `${pieceIndex * 0.1}s` }}
                onClick={() => onSelect(piece)}
              >
                {/* Frame/Card */}
                <div className={`
                  p-2 md:p-4 shadow-md transition-all duration-500 rounded-sm
                  ${isDark ? 'bg-[#1a1a1f] shadow-black/50' : 'bg-white shadow-neutral-200'}
                  ${isNewest 
                    ? (isDark ? 'ring-1 ring-blue-500/40 shadow-xl shadow-blue-900/10' : 'ring-2 ring-blue-500/20 shadow-xl') 
                    : 'group-hover:-translate-y-1 group-hover:shadow-xl'}
                `}>
                  
                  {isNewest && (
                    <div className="absolute -top-2 -right-2 z-20 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-lg animate-pulse">
                      Live Auction
                    </div>
                  )}

                  {/* Image Container */}
                  <div className={`relative overflow-hidden aspect-[3/4] ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
                    <img 
                      src={piece.url} 
                      alt={piece.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Floating Price Tag on Image */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                       <span className="text-neutral-300">Bid</span>
                       <span className="font-bold">Ξ {piece.auction.currentBid.toFixed(2)}</span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-colors duration-300 flex items-center justify-center">
                       <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-3">
                          <span className="bg-white/90 backdrop-blur text-neutral-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center hover:bg-white transition-colors">
                            <Icons.Gavel className="w-3 h-3 mr-2" />
                            Place Bid
                          </span>
                       </div>
                    </div>
                  </div>
                  
                  {/* Meta Data */}
                  <div className="mt-4 px-1 pb-1 flex justify-between items-start">
                    <div>
                        <h3 className={`font-serif text-lg leading-tight truncate max-w-[150px] ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>{piece.title}</h3>
                        <p className={`text-xs mt-1 uppercase tracking-wide ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        {piece.auction.artistName}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                        <Icons.Heart className="w-3 h-3 fill-current text-rose-500" />
                        <span>{piece.auction.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
