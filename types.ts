
/**
 * Represents the auction and commercial data for an art piece.
 */
export interface AuctionData {
  /** Current highest bid in ETH/Ξ */
  currentBid: number;
  /** The starting price set by the house */
  startingBid: number;
  /** Total number of active bids */
  bidCount: number;
  /** Number of community likes/favorites */
  likes: number;
  /** Expert critic score (0.0 to 10.0) */
  rating: number;
  /** Timestamp when the auction closes */
  endTime: number;
  /** Pseudonym of the AI artist persona */
  artistName: string;
}

/**
 * Represents a single generated art piece in the gallery.
 */
export interface ArtPiece {
  /** Unique identifier for the piece */
  id: string;
  /** Base64 data URL of the generated image */
  url: string;
  /** Generated title of the artwork */
  title: string;
  /** Brief description of the artwork's composition */
  description: string;
  /** The main subject matter (e.g., 'a bustling city street') */
  subject: string;
  /** The artistic period/palette style used */
  period: PeriodType;
  /** Unix timestamp of creation */
  timestamp: number;
  /** The full text prompt sent to the AI */
  prompt: string;
  /** Commercial auction details */
  auction: AuctionData;
}

/**
 * Available color palettes and artistic periods.
 */
export type PeriodType = 
  | 'Azure' 
  | 'Scarlet' 
  | 'Turquoise' 
  | 'Mustard' 
  | 'Plumber' 
  | 'Rust' 
  | 'Peach' 
  | 'Charcoal' 
  | 'Jade' 
  | 'Cobalt'
  | 'Indigo'
  | 'Coral'
  | 'Saffron'
  | 'Teal'
  | 'Mint'
  | 'Umber'
  | 'Lavender'
  | 'Blue'
  | 'Rose'
  | 'Earth';

/**
 * Parameters required to generate a new art piece.
 */
export interface GenerationParams {
  /** The chosen subject to depict */
  subject: string;
  /** The color palette/period to apply */
  period: PeriodType;
}
