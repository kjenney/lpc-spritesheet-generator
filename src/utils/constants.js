/**
 * Constants for the LPC Animation Generator
 */

// Standard LPC frame dimensions
export const LPC_FRAME_WIDTH = 64;
export const LPC_FRAME_HEIGHT = 64;

// Standard LPC spritesheet layout (rows = directions, columns = frames)
export const LPC_DIRECTIONS = {
  UP: 0,    // North
  LEFT: 1,  // West  
  DOWN: 2,  // South
  RIGHT: 3  // East
};

// Color palettes for character customization
export const CHARACTER_COLORS = {
  SKIN_TONES: [
    '#FFDBAC', // Light
    '#E6B887', // Medium Light
    '#D4A574', // Medium
    '#C19A68', // Medium Dark
    '#8B4513', // Dark
    '#654321'  // Very Dark
  ],
  
  HAIR_COLORS: [
    '#654321', // Dark Brown
    '#8B4513', // Brown
    '#DEB887', // Blonde
    '#000000', // Black
    '#FF6347', // Red
    '#A0522D', // Auburn
    '#C0C0C0', // Silver
    '#FFFFFF'  // White
  ],
  
  CLOTHING_COLORS: [
    '#4169E1', // Blue
    '#32CD32', // Green
    '#FF6347', // Red
    '#FFD700', // Gold
    '#8A2BE2', // Purple
    '#FF1493', // Pink
    '#00CED1', // Turquoise
    '#2F4F4F'  // Dark Gray
  ]
};

// Animation timing presets
export const ANIMATION_PRESETS = {
  VERY_SLOW: 500,
  SLOW: 300,
  NORMAL: 200,
  FAST: 150,
  VERY_FAST: 100
};

// Default character configuration
export const DEFAULT_CHARACTER = {
  body: true,
  head: true,
  hair: true,
  clothing: true,
  accessories: false
};

// Export format options
export const EXPORT_FORMATS = {
  PNG: 'image/png',
  GIF: 'image/gif', // For future animation export
  WEBP: 'image/webp'
};

// LPC license types for reference
export const LPC_LICENSES = {
  CC0: 'Creative Commons Zero - Public Domain',
  CC_BY: 'Creative Commons Attribution',
  CC_BY_SA: 'Creative Commons Attribution-ShareAlike',
  OGA_BY: 'OpenGameArt.org Attribution',
  GPL: 'GNU General Public License'
};
