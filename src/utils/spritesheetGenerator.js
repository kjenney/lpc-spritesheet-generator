/**
 * Spritesheet generation utilities for LPC format
 * Creates complete spritesheets with all animations and directions
 */

import { ANIMATIONS, DIRECTIONS } from '../hooks/useAnimation';
import { createLPCCharacterSprite, createCharacterSprite, getFrameOffset, initializeLPCAssets } from './characterRenderer';

// LPC spritesheet dimensions
export const SPRITESHEET_CONFIG = {
  frameWidth: 64,
  frameHeight: 64,
  padding: 0, // LPC standard has no padding
  maxFramesPerRow: 13, // Max frames across all animations (shoot has 13 frames)
  totalRows: 4 * Object.keys(ANIMATIONS).length, // 4 directions × number of animations
};

/**
 * Generate a complete spritesheet for a character
 * @param {Object} characterParts - Character customization options
 * @param {Array} selectedAnimations - Array of animation names to include (default: all)
 * @param {Object} options - Additional options for generation
 * @returns {HTMLCanvasElement} Complete spritesheet canvas
 */
export const generateSpritesheet = (
  characterParts,
  selectedAnimations = Object.keys(ANIMATIONS),
  options = {}
) => {
  const {
    frameWidth = SPRITESHEET_CONFIG.frameWidth,
    frameHeight = SPRITESHEET_CONFIG.frameHeight,
    includeFrameNumbers = false,
    backgroundColor = 'transparent'
  } = options;

  // Calculate canvas dimensions
  const maxFrames = Math.max(...selectedAnimations.map(anim => ANIMATIONS[anim].frames));
  const canvasWidth = maxFrames * frameWidth;
  const canvasHeight = selectedAnimations.length * 4 * frameHeight; // 4 directions per animation

  // Create main canvas
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Set background
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Disable smoothing for pixel art
  ctx.imageSmoothingEnabled = false;

  let currentRow = 0;

  // Generate each animation
  selectedAnimations.forEach(animationName => {
    const animation = ANIMATIONS[animationName];

    // Generate each direction for this animation
    Object.keys(DIRECTIONS).forEach(directionName => {
      const y = currentRow * frameHeight;

      // Generate each frame for this animation/direction combination
      for (let frame = 0; frame < animation.frames; frame++) {
        const x = frame * frameWidth;

        // Create character sprite for this frame
        // First try to use LPC assets, fallback to placeholder
        let characterSprite;
        let spriteX = x;
        let spriteY = y;

        try {
          // Try to use LPC character sprite (this will use actual sprites if loaded)
          characterSprite = createLPCCharacterSprite(characterParts, directionName, animationName, frame);
          // LPC sprites already have correct frames, no offset needed
        } catch (error) {
          // Fallback to placeholder sprite with offset
          characterSprite = createCharacterSprite(characterParts, directionName);
          const offset = getFrameOffset(animationName, frame, directionName);
          spriteX = x + offset.x;
          spriteY = y + offset.y;
        }

        ctx.drawImage(characterSprite, spriteX, spriteY, frameWidth, frameHeight);

        // Add frame numbers if requested
        if (includeFrameNumbers) {
          drawFrameNumber(ctx, x, y, frame + 1, frameWidth, frameHeight);
        }
      }

      currentRow++;
    });
  });

  return canvas;
};

/**
 * Generate a spritesheet for a specific animation
 * @param {Object} characterParts - Character customization options
 * @param {string} animationName - Name of the animation
 * @param {Object} options - Additional options
 * @returns {HTMLCanvasElement} Animation spritesheet canvas
 */
export const generateAnimationSpritesheet = (characterParts, animationName, options = {}) => {
  const animation = ANIMATIONS[animationName];
  if (!animation) {
    throw new Error(`Animation "${animationName}" not found`);
  }

  const {
    frameWidth = SPRITESHEET_CONFIG.frameWidth,
    frameHeight = SPRITESHEET_CONFIG.frameHeight,
    includeFrameNumbers = false,
    backgroundColor = 'transparent'
  } = options;

  // Canvas dimensions: animation frames × 4 directions
  const canvasWidth = animation.frames * frameWidth;
  const canvasHeight = 4 * frameHeight;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Set background
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  ctx.imageSmoothingEnabled = false;

  // Generate each direction (row)
  Object.keys(DIRECTIONS).forEach((directionName, directionIndex) => {
    const y = directionIndex * frameHeight;

    // Generate each frame (column)
    for (let frame = 0; frame < animation.frames; frame++) {
      const x = frame * frameWidth;

      // Create character sprite
      let characterSprite;
      let spriteX = x;
      let spriteY = y;

      try {
        // Try to use LPC character sprite
        characterSprite = createLPCCharacterSprite(characterParts, directionName, animationName, frame);
        // LPC sprites already have correct frames, no offset needed
      } catch (error) {
        // Fallback to placeholder sprite with offset
        characterSprite = createCharacterSprite(characterParts, directionName);
        const offset = getFrameOffset(animationName, frame, directionName);
        spriteX = x + offset.x;
        spriteY = y + offset.y;
      }

      // Draw sprite
      ctx.drawImage(characterSprite, spriteX, spriteY, frameWidth, frameHeight);

      if (includeFrameNumbers) {
        drawFrameNumber(ctx, x, y, frame + 1, frameWidth, frameHeight);
      }
    }
  });

  return canvas;
};

/**
 * Generate metadata for the spritesheet
 * @param {Array} selectedAnimations - Animations included in spritesheet
 * @param {Object} options - Generation options used
 * @returns {Object} Metadata object
 */
export const generateSpritesheetMetadata = (selectedAnimations, options = {}) => {
  const metadata = {
    format: 'LPC',
    version: '1.0',
    frameSize: {
      width: options.frameWidth || SPRITESHEET_CONFIG.frameWidth,
      height: options.frameHeight || SPRITESHEET_CONFIG.frameHeight
    },
    animations: {},
    directions: Object.keys(DIRECTIONS).map(dir => ({
      name: dir,
      displayName: DIRECTIONS[dir].name,
      row: DIRECTIONS[dir].row
    })),
    generatedAt: new Date().toISOString()
  };

  // Add animation data
  let currentRow = 0;
  selectedAnimations.forEach(animationName => {
    const animation = ANIMATIONS[animationName];
    metadata.animations[animationName] = {
      name: animation.name,
      frames: animation.frames,
      rows: {
        up: currentRow,
        left: currentRow + 1,
        down: currentRow + 2,
        right: currentRow + 3
      }
    };
    currentRow += 4;
  });

  return metadata;
};

/**
 * Export spritesheet with metadata as a ZIP-like structure
 * @param {HTMLCanvasElement} canvas - The spritesheet canvas
 * @param {Object} metadata - Spritesheet metadata
 * @param {string} filename - Base filename (without extension)
 */
export const exportSpritesheetWithMetadata = (canvas, metadata, filename = 'lpc-spritesheet') => {
  // Export the image
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  // Export metadata as JSON
  setTimeout(() => {
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    });
    const metadataLink = document.createElement('a');
    metadataLink.download = `${filename}-metadata.json`;
    metadataLink.href = URL.createObjectURL(metadataBlob);
    metadataLink.click();
    URL.revokeObjectURL(metadataLink.href);
  }, 100);
};

/**
 * Generate a preview grid showing all animations
 * @param {Object} characterParts - Character customization options
 * @param {Object} options - Preview options
 * @returns {HTMLCanvasElement} Preview grid canvas
 */
export const generatePreviewGrid = (characterParts, options = {}) => {
  const {
    scale = 2,
    showLabels = true,
    backgroundColor = '#f0f0f0',
    gridSpacing = 10
  } = options;

  const animationNames = Object.keys(ANIMATIONS);
  const cols = 4; // 4 animations per row
  const rows = Math.ceil(animationNames.length / cols);

  const cellWidth = (SPRITESHEET_CONFIG.frameWidth * scale) + gridSpacing;
  const cellHeight = (SPRITESHEET_CONFIG.frameHeight * scale) + (showLabels ? 30 : 0) + gridSpacing;

  const canvasWidth = cols * cellWidth;
  const canvasHeight = rows * cellHeight;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.imageSmoothingEnabled = false;

  animationNames.forEach((animationName, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const x = col * cellWidth + gridSpacing / 2;
    const y = row * cellHeight + gridSpacing / 2;

    // Create character sprite (frame 0, down direction)
    const characterSprite = createCharacterSprite(characterParts, 'down');

    // Draw scaled sprite
    ctx.drawImage(
      characterSprite,
      x,
      y,
      SPRITESHEET_CONFIG.frameWidth * scale,
      SPRITESHEET_CONFIG.frameHeight * scale
    );

    // Add label
    if (showLabels) {
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        ANIMATIONS[animationName].name,
        x + (SPRITESHEET_CONFIG.frameWidth * scale) / 2,
        y + (SPRITESHEET_CONFIG.frameHeight * scale) + 20
      );
    }
  });

  return canvas;
};

/**
 * Helper function to draw frame numbers on sprites
 * @private
 */
const drawFrameNumber = (ctx, x, y, frameNumber, frameWidth, frameHeight) => {
  ctx.save();

  // Background circle
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.arc(x + frameWidth - 12, y + 12, 8, 0, Math.PI * 2);
  ctx.fill();

  // Frame number
  ctx.fillStyle = 'white';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(frameNumber.toString(), x + frameWidth - 12, y + 12);

  ctx.restore();
};

/**
 * Validate spritesheet parameters
 * @param {Object} params - Parameters to validate
 * @returns {Object} Validation result
 */
export const validateSpritesheetParams = (params) => {
  const errors = [];
  const warnings = [];

  if (!params.characterParts || Object.keys(params.characterParts).length === 0) {
    errors.push('Character parts configuration is required');
  }

  if (params.selectedAnimations && params.selectedAnimations.length === 0) {
    warnings.push('No animations selected, will use default set');
  }

  if (params.selectedAnimations) {
    params.selectedAnimations.forEach(animName => {
      if (!ANIMATIONS[animName]) {
        errors.push(`Unknown animation: ${animName}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};