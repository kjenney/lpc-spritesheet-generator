/**
 * Character rendering utilities for LPC sprites
 * Updated to use actual Universal LPC Spritesheet assets
 */

import { createLPCCharacterFrame, preloadEssentialAssets } from './lpcAssetLoader';

// Animation frame variations for different animations
export const getFrameOffset = (animation, frame, direction) => {
  const baseOffsets = {
    walk: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 },
      { x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 0 }
    ],
    run: [
      { x: 0, y: -1 }, { x: 2, y: -1 }, { x: 0, y: 0 }, { x: -2, y: -1 },
      { x: 0, y: -1 }, { x: -2, y: -1 }, { x: 0, y: 0 }, { x: 2, y: -1 }
    ],
    jump: [
      { x: 0, y: 0 }, { x: 0, y: -2 }, { x: 0, y: -4 }, { x: 0, y: -6 },
      { x: 0, y: -6 }, { x: 0, y: -4 }, { x: 0, y: -2 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ],
    idle: [
      { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 0, y: 1 },
      { x: 0, y: 0 }, { x: 0, y: 1 }
    ],
    sit: [{ x: 0, y: 4 }],
    cast: [
      { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: -2 },
      { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ],
    slash: [
      { x: 0, y: 0 }, { x: 1, y: -1 }, { x: 2, y: -2 }, { x: 1, y: -1 },
      { x: 0, y: 0 }, { x: 0, y: 0 }
    ],
    thrust: [
      { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: -3 },
      { x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ],
    shoot: [
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
      { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -1 }, { x: 0, y: -1 },
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ],
    hurt: [
      { x: -2, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: 0, y: 0 }
    ],
    climb: [
      { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }
    ]
  };

  const offsets = baseOffsets[animation] || [{ x: 0, y: 0 }];
  return offsets[frame % offsets.length] || { x: 0, y: 0 };
};

// Global asset cache for loaded LPC sprites
let lpcAssets = null;
let loadingPromise = null;

/**
 * Initialize LPC assets (call this once when the app starts)
 * @returns {Promise<void>}
 */
export const initializeLPCAssets = async () => {
  if (lpcAssets) return lpcAssets;

  if (loadingPromise) return loadingPromise;

  loadingPromise = preloadEssentialAssets('male', 'plain', 'longsleeve', 'pants')
    .then(sprites => {
      lpcAssets = sprites;
      return lpcAssets;
    })
    .catch(error => {
      console.warn('Failed to load LPC assets, using fallback:', error);
      lpcAssets = { body: {}, head: {}, hair: {}, torso: {}, legs: {} };
      return lpcAssets;
    });

  return loadingPromise;
};

/**
 * Create character sprite using real LPC assets when available
 * @param {Object} characterParts - Character parts configuration
 * @param {string} direction - Direction (up, down, left, right)
 * @param {string} animation - Current animation
 * @param {number} frame - Current frame number
 * @returns {HTMLCanvasElement} Character sprite
 */
export const createLPCCharacterSprite = (characterParts, direction = 'down', animation = 'walk', frame = 0) => {
  // If LPC assets are loaded, use them
  if (lpcAssets && (lpcAssets.body || lpcAssets.head || lpcAssets.hair || lpcAssets.torso || lpcAssets.legs)) {
    try {
      return createLPCCharacterFrame(
        lpcAssets,
        animation,
        frame,
        direction,
        characterParts
      );
    } catch (error) {
      console.warn('Failed to create LPC character frame, using fallback:', error);
    }
  }

  // Fallback to placeholder character
  return createPlaceholderCharacterSprite(characterParts, direction);
};

// Create a simple character sprite (placeholder for actual LPC sprites)
export const createCharacterSprite = (characterParts, direction = 'down') => {
  return createPlaceholderCharacterSprite(characterParts, direction);
};

// Renamed original function to be explicit about being a placeholder
export const createPlaceholderCharacterSprite = (characterParts, direction = 'down') => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, 64, 64);
  
  // Direction-based adjustments
  const isProfile = direction === 'left' || direction === 'right';
  const isBack = direction === 'up';
  const flipX = direction === 'left';
  
  if (flipX) {
    ctx.scale(-1, 1);
    ctx.translate(-64, 0);
  }
  
  // Draw body
  if (characterParts.body) {
    ctx.fillStyle = '#8B4513'; // Brown for body
    if (isProfile) {
      ctx.fillRect(24, 40, 16, 20); // Narrower profile body
    } else {
      ctx.fillRect(22, 40, 20, 20); // Front/back body
    }
  }
  
  // Draw head
  if (characterParts.head) {
    ctx.fillStyle = '#FFDBAC'; // Skin tone for head
    if (isProfile) {
      ctx.fillRect(26, 20, 12, 18); // Profile head
      
      // Add simple facial features for profile
      if (!isBack) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(30, 26, 1, 1); // Eye
        ctx.fillRect(29, 30, 2, 1); // Mouth
      }
    } else {
      ctx.fillRect(24, 20, 16, 18); // Front/back head
      
      // Add simple facial features for front view
      if (!isBack) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(28, 26, 1, 1); // Left eye
        ctx.fillRect(35, 26, 1, 1); // Right eye
        ctx.fillRect(30, 30, 4, 1); // Mouth
      }
    }
  }
  
  // Draw hair
  if (characterParts.hair) {
    ctx.fillStyle = '#654321'; // Dark brown for hair
    if (isProfile) {
      ctx.fillRect(25, 20, 14, 10); // Profile hair
    } else {
      ctx.fillRect(24, 20, 16, 8); // Front/back hair
    }
  }
  
  // Draw clothing
  if (characterParts.clothing) {
    ctx.fillStyle = '#4169E1'; // Blue for shirt
    if (isProfile) {
      ctx.fillRect(22, 38, 20, 15); // Profile shirt
    } else {
      ctx.fillRect(20, 38, 24, 15); // Front/back shirt
    }
    
    ctx.fillStyle = '#2F4F4F'; // Dark gray for pants
    if (isProfile) {
      ctx.fillRect(24, 50, 16, 14); // Profile pants
    } else {
      ctx.fillRect(22, 50, 20, 14); // Front/back pants
    }
  }
  
  // Draw accessories
  if (characterParts.accessories) {
    // Simple cape for back view
    if (isBack) {
      ctx.fillStyle = '#8B0000'; // Dark red cape
      ctx.fillRect(18, 35, 28, 20);
    }
    
    // Simple hat
    ctx.fillStyle = '#8B4513';
    if (isProfile) {
      ctx.fillRect(25, 18, 14, 4);
    } else {
      ctx.fillRect(24, 18, 16, 4);
    }
  }
  
  return canvas;
};

// Get character colors based on direction for variety
export const getDirectionColors = (direction) => {
  const colorSchemes = {
    up: {
      clothing: '#4169E1', // Blue
      pants: '#2F4F4F', // Dark slate gray
      hair: '#654321' // Dark brown
    },
    down: {
      clothing: '#4169E1', // Blue
      pants: '#2F4F4F', // Dark slate gray
      hair: '#654321' // Dark brown
    },
    left: {
      clothing: '#32CD32', // Lime green
      pants: '#556B2F', // Dark olive green
      hair: '#8B4513' // Saddle brown
    },
    right: {
      clothing: '#FF6347', // Tomato
      pants: '#8B4513', // Saddle brown
      hair: '#2F4F4F' // Dark slate gray
    }
  };
  
  return colorSchemes[direction] || colorSchemes.down;
};

// Draw frame info overlay
export const drawFrameInfo = (ctx, animationName, currentFrame, totalFrames) => {
  const padding = 10;
  const textHeight = 20;
  const textWidth = 200;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(padding, padding, textWidth, textHeight + 10);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = '14px monospace';
  ctx.fillText(
    `${animationName} - Frame ${currentFrame + 1}/${totalFrames}`, 
    padding + 5, 
    padding + textHeight
  );
};

// Export current frame as image
export const exportFrame = (canvas, animationName, direction, frame) => {
  if (!canvas) return;
  
  const link = document.createElement('a');
  link.download = `lpc-${animationName}-${direction}-frame${frame + 1}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

// Validate animation frame count
export const validateAnimation = (animationType, frameCount) => {
  const expectedFrames = {
    walk: 9, run: 8, jump: 9, idle: 6, sit: 1,
    cast: 7, slash: 6, thrust: 8, shoot: 13, hurt: 6, climb: 3
  };
  
  return expectedFrames[animationType] === frameCount;
};
