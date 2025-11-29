
import { PeriodType } from './types';

/**
 * List of available subjects for the randomizer and selection dropdown.
 * These themes are curated to work well with the Cubist/Avant-Garde prompt style.
 */
export const SUBJECTS = [
  'a bustling city street',
  'a musician playing guitar',
  'a family at a table',
  'random animals intertwined',
  'a woman in an armchair',
  'still life with bottle and fruit',
  'portrait of a weeping woman',
  'three musicians',
  'the studio window',
  'figures on a beach',
  'man with a pipe',
  'seated harlequin',
  'girl before a mirror',
  'violin and grapes',
  'head of a bull',
  'the dream',
  'still life with skull',
  'geometric landscape',
  'two women reading',
  'painter and model',
  'whispers in a neon arcade',
  'a lone lighthouse keepers midnight snack',
  'children chasing fireflies in a rain-soaked alley',
  'ancient map unfurling on a café table',
  'robotic violinist under a falling leaf',
  'market stalls illuminated by a solar eclipse',
  'elderly couple sharing a silent dance',
  'ink-splattered poet on a floating island',
  'steampunk carousel at sunrise',
  'hidden garden of glass flowers',
  'astronomer gazing at a painted sky',
  'vintage typewriter with a single rose',
  'cobblestone courtyard with a stray cat conductor',
  'golden hour on a deserted train station',
  'marionette theater behind a veil of mist',
  'abstract cityscape made of coffee beans',
  'woman in a bubble bath of stars',
  'forgotten library with levitating books',
  'jazz trio playing on a moving elevator',
  'mythical creature sipping tea in a library',
  'rain-killed lanterns on a cobblestone lane',
  'a saxophonist beneath a waterfall of neon',
  'children building sand-castles with clock gears',
  'a stray dog conducting an invisible orchestra',
  'vintage pocket watch melting into a puddle',
  'silhouette of a cyclist against a sunrise skyline',
  'a tea set perched on a floating iceberg',
  'graffiti-covered piano on a subway platform',
  'elderly man feeding pigeons in a cathedral courtyard',
  'a moth drawn to a glowing compass rose',
  'marble statue of a cat with a ruby eye',
  'street vendor selling clouds in glass jars',
  'a lone violin resting on a stack of old letters',
  'butterflies made of stained-glass perched on a fence',
  'a child’s drawing of a dragon that’s actually a kite',
  'silk scarves fluttering from a balcony at dusk',
  'a broken mirror reflecting a different season',
  'fish swimming through a city traffic jam',
  'a baker shaping dough into tiny constellations',
  'a wind-up toy soldier marching across a desk',
  'twilight market with stalls of glowing fruit',
  'a librarian shelving books that whisper',
  'a lone piano key glowing under moonlight',
  'a pair of gloves knitted from moonbeams',
  'a vintage carousel horse with a compass for a mane',
  'a street poet writing with ink that evaporates',
  'a cat perched on a telescope aimed at a painted sky',
  'a garden of clocks blooming at midnight',
  'a child’s shadow dancing on a wall of graffiti',
  'a brass compass sprouting vines instead of a needle',
  'a baker’s apron splattered with starlight',
  'a solitary lighthouse keeper feeding seagulls with breadcrumbs of light',
  'a cracked porcelain doll holding a rose made of glass',
  'a jazz trio playing on a floating raft',
  'a map of the world drawn in sand that’s being washed away',
  'a violin made of driftwood and sea-glass',
  'a rooftop garden where the flowers sing',
  'a streetlamp that casts shadows of birds',
  'a child’s hand holding a handful of fireflies',
  'a vintage radio broadcasting whispers of the past',
  'a marble bust wearing a pair of sunglasses',
  'a carousel of paper boats on a city fountain',
  'a painter’s palette filled with miniature storms',
  'a solitary tree whose leaves are tiny clocks',
  'a cobblestone path that leads into a painting',
  'a wind-chime made from old keys that play a melody',
  'a baker shaping a loaf that looks like a mountain range',
  'a silhouette of a woman holding a lantern made of stars',
  'a street performer juggling glowing marbles',
  'a quiet attic where forgotten toys tell stories'
];

/**
 * Defines the artistic periods and their corresponding prompt descriptions.
 * Used to guide the AI on the color palette and mood.
 */
export const PERIODS: Record<PeriodType, string> = {
  'Azure': 'clear‑sky clarity with a hint of distant horizon',
  'Scarlet': 'fiery passion that crackles like a summer blaze',
  'Turquoise': 'tropical sea‑foam that feels both cool and vibrant',
  'Mustard': 'golden‑amber warmth reminiscent of late‑afternoon light',
  'Plumber': 'soft, muted teal that whispers of quiet workshops',
  'Rust': 'deep, earthy orange that evokes aged metal and adventure',
  'Peach': 'gentle, sweet blush that feels like a sunrise kiss',
  'Charcoal': 'dark, grounded depth that anchors any palette',
  'Jade': 'fresh, verdant green that sparks renewal',
  'Cobalt': 'intense, midnight‑blue intensity that commands attention',
  'Indigo': 'mysterious deep violet combining stability and energy',
  'Coral': 'vibrant reddish-orange life force from the sea',
  'Saffron': 'rich golden yellow bringing exotic warmth',
  'Teal': 'sophisticated blue-green blend of ocean and forest',
  'Mint': 'cool and refreshing pale green breeziness',
  'Umber': 'natural brown pigment of raw earthiness',
  'Lavender': 'delicate floral purple invoking calm nostalgia',
  'Blue': 'classic primary coolness and vast depth',
  'Rose': 'soft romantic pink with gentle elegance',
  'Earth': 'grounded spectrum of browns, greens, and grays'
};

/**
 * Fictional AI artist personas for the auction metadata.
 */
export const ARTIST_NAMES = [
  "Algorithmic Vance", "Neural Chen", "Cubist Thorne", "Echo Construct", 
  "Flux Virtuoso", "Synapse Dali", "Pixel Picasso", "Quantum Braque",
  "Vector Miró", "Digital Gris"
];

/**
 * The master prompt template used for Gemini generation.
 * Contains placeholders [SUBJECT] and [PALETTE] for dynamic replacement.
 */
export const BASE_PROMPT_TEMPLATE = `
Theme of the Exibition is Cubist‑style abstract masterpiece, inspired by early 20th‑century avant‑garde painting but not copying any existing artwork, featuring a complex composition of overlapping geometric planes, fractured forms, and multiple viewpoints of the same subject in a single image. 

The scene shows [SUBJECT], all deconstructed into angular facets, intersecting diagonals, and simplified volumes that suggest faces, bodies, and objects without clear outlines. 

Use a limited, harmonized color palette based on Cubist traditions: [PALETTE], with carefully placed high‑contrast accents to guide the eye.

Arrange elements in a dynamic, slightly off‑kilter composition: foreground and background interlock like a puzzle, forms partially transparent or overlapping so that profiles, eyes, instruments, bottles, tables, and architecture merge into one continuous planar structure. Light is suggested more by color shifts and value contrasts than by realistic shadows, giving a flat yet rhythmic surface. 

Include hints of texture such as rough brushwork, visible strokes, and subtle canvas grain, and optionally add collage‑like touches (paper edges, simplified letters, or newspaper‑style blocks) without any readable text or logos. 

The overall effect should be that of a museum‑worthy Cubist masterpiece: bold, experimental, emotionally resonant, and clearly ‘Picasso‑inspired’ rather than an imitation, rendered as high‑resolution digital art with a neutral background wall so it looks like a framed painting in a modern gallery.
`;
