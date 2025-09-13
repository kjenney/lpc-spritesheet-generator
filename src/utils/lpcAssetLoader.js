/**
 * LPC Asset Loading System
 * Manages loading and caching of Universal LPC Spritesheet assets
 */

// Base URL for LPC assets from GitHub
const LPC_BASE_URL = 'https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/master/spritesheets';

// LPC asset configuration mapping our app's character parts to LPC paths
export const LPC_ASSET_CONFIG = {
  body: {
    male: {
      path: 'body/bodies/male',
      animations: [
        'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
        'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
        'hurt.png', 'climb.png'
      ]
    },
    female: {
      path: 'body/bodies/female',
      animations: [
        'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
        'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
        'hurt.png', 'climb.png'
      ]
    }
  },
  head: {
    male: {
      path: 'head/heads/human/male',
      animations: [
        'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
        'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
        'hurt.png', 'climb.png'
      ]
    },
    female: {
      path: 'head/heads/human/female',
      animations: [
        'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
        'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
        'hurt.png', 'climb.png'
      ]
    }
  },
  hair: {
    plain: {
      path: 'hair/plain/adult',
      animations: [
        'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
        'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
        'hurt.png', 'climb.png'
      ]
    }
  },
  torso: {
    longsleeve: {
      male: {
        path: 'torso/clothes/longsleeve/longsleeve/male',
        animations: [
          'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
          'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
          'hurt.png', 'climb.png'
        ]
      },
      female: {
        path: 'torso/clothes/longsleeve/longsleeve/female',
        animations: [
          'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
          'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
          'hurt.png', 'climb.png'
        ]
      }
    }
  },
  legs: {
    pants: {
      male: {
        path: 'legs/pants/male',
        animations: [
          'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
          'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
          'hurt.png', 'climb.png'
        ]
      },
      female: {
        path: 'legs/pants/female',
        animations: [
          'walk.png', 'run.png', 'jump.png', 'idle.png', 'sit.png',
          'spellcast.png', 'slash.png', 'thrust.png', 'shoot.png',
          'hurt.png', 'climb.png'
        ]
      }
    }
  },
  accessories: {
    hats: {
      path: 'hat',
      items: ['cap.png']
    }
  }
};

// Animation name mapping from our app to LPC file names
export const ANIMATION_FILE_MAP = {
  walk: 'walk.png',
  run: 'run.png',
  jump: 'jump.png',
  idle: 'idle.png',
  sit: 'sit.png',
  cast: 'spellcast.png',
  slash: 'slash.png',
  thrust: 'thrust.png',
  shoot: 'shoot.png',
  hurt: 'hurt.png',
  climb: 'climb.png'
};

// Cache for loaded images
const imageCache = new Map();
const loadPromises = new Map();

/**
 * Load an LPC sprite image from GitHub
 * @param {string} assetPath - Path relative to spritesheets directory
 * @returns {Promise<HTMLImageElement>} Loaded image
 */
export const loadLPCAsset = async (assetPath) => {
  const fullUrl = `${LPC_BASE_URL}/${assetPath}`;

  // Return cached image if available
  if (imageCache.has(fullUrl)) {
    return imageCache.get(fullUrl);
  }

  // Return existing promise if already loading
  if (loadPromises.has(fullUrl)) {
    return loadPromises.get(fullUrl);
  }

  // Create new loading promise
  const loadPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for GitHub assets

    img.onload = () => {
      imageCache.set(fullUrl, img);
      loadPromises.delete(fullUrl);
      resolve(img);
    };

    img.onerror = () => {
      loadPromises.delete(fullUrl);
      reject(new Error(`Failed to load LPC asset: ${fullUrl}`));
    };

    img.src = fullUrl;
  });

  loadPromises.set(fullUrl, loadPromise);
  return loadPromise;
};

/**
 * Load a character body sprite for a specific animation
 * @param {string} gender - 'male' or 'female'
 * @param {string} animation - Animation name (from ANIMATION_FILE_MAP)
 * @returns {Promise<HTMLImageElement>} Body sprite image
 */
export const loadBodySprite = async (gender = 'male', animation = 'walk') => {
  const bodyConfig = LPC_ASSET_CONFIG.body[gender];
  if (!bodyConfig) {
    throw new Error(`Unsupported gender: ${gender}`);
  }

  const fileName = ANIMATION_FILE_MAP[animation];
  if (!fileName) {
    throw new Error(`Unsupported animation: ${animation}`);
  }

  const assetPath = `${bodyConfig.path}/${fileName}`;
  return loadLPCAsset(assetPath);
};

/**
 * Load multiple body sprites for all animations
 * @param {string} gender - 'male' or 'female'
 * @returns {Promise<Object>} Object mapping animation names to loaded images
 */
export const loadAllBodySprites = async (gender = 'male') => {
  const sprites = {};
  const loadPromises = [];

  for (const [animationKey] of Object.entries(ANIMATION_FILE_MAP)) {
    const promise = loadBodySprite(gender, animationKey)
      .then(img => { sprites[animationKey] = img; })
      .catch(err => {
        console.warn(`Failed to load ${animationKey} sprite for ${gender}:`, err);
        sprites[animationKey] = null;
      });
    loadPromises.push(promise);
  }

  await Promise.all(loadPromises);
  return sprites;
};

/**
 * Load a head sprite for a specific animation
 * @param {string} gender - 'male' or 'female'
 * @param {string} animation - Animation name
 * @returns {Promise<HTMLImageElement>} Head sprite image
 */
export const loadHeadSprite = async (gender = 'male', animation = 'walk') => {
  const headConfig = LPC_ASSET_CONFIG.head[gender];
  if (!headConfig) {
    throw new Error(`Unsupported gender for head: ${gender}`);
  }

  const fileName = ANIMATION_FILE_MAP[animation];
  if (!fileName) {
    throw new Error(`Unsupported animation for head: ${animation}`);
  }

  const assetPath = `${headConfig.path}/${fileName}`;
  return loadLPCAsset(assetPath);
};

/**
 * Load multiple head sprites for all animations
 * @param {string} gender - 'male' or 'female'
 * @returns {Promise<Object>} Object mapping animation names to loaded images
 */
export const loadAllHeadSprites = async (gender = 'male') => {
  const sprites = {};
  const loadPromises = [];

  for (const [animationKey] of Object.entries(ANIMATION_FILE_MAP)) {
    const promise = loadHeadSprite(gender, animationKey)
      .then(img => { sprites[animationKey] = img; })
      .catch(err => {
        console.warn(`Failed to load ${animationKey} head sprite for ${gender}:`, err);
        sprites[animationKey] = null;
      });
    loadPromises.push(promise);
  }

  await Promise.all(loadPromises);
  return sprites;
};

/**
 * Load a hair sprite for a specific animation
 * @param {string} style - Hair style (e.g., 'plain')
 * @param {string} animation - Animation name
 * @returns {Promise<HTMLImageElement>} Hair sprite image
 */
export const loadHairSprite = async (style = 'plain', animation = 'walk') => {
  const hairConfig = LPC_ASSET_CONFIG.hair[style];
  if (!hairConfig) {
    throw new Error(`Unsupported hair style: ${style}`);
  }

  const fileName = ANIMATION_FILE_MAP[animation];
  if (!fileName) {
    throw new Error(`Unsupported animation for hair: ${animation}`);
  }

  const assetPath = `${hairConfig.path}/${fileName}`;
  return loadLPCAsset(assetPath);
};

/**
 * Load multiple hair sprites for all animations
 * @param {string} style - Hair style (e.g., 'plain')
 * @returns {Promise<Object>} Object mapping animation names to loaded images
 */
export const loadAllHairSprites = async (style = 'plain') => {
  const sprites = {};
  const loadPromises = [];

  for (const [animationKey] of Object.entries(ANIMATION_FILE_MAP)) {
    const promise = loadHairSprite(style, animationKey)
      .then(img => { sprites[animationKey] = img; })
      .catch(err => {
        console.warn(`Failed to load ${animationKey} hair sprite for ${style}:`, err);
        sprites[animationKey] = null;
      });
    loadPromises.push(promise);
  }

  await Promise.all(loadPromises);
  return sprites;
};

/**
 * Load a torso sprite for a specific animation
 * @param {string} type - Clothing type (e.g., 'longsleeve')
 * @param {string} gender - 'male' or 'female'
 * @param {string} animation - Animation name
 * @returns {Promise<HTMLImageElement>} Torso sprite image
 */
export const loadTorsoSprite = async (type = 'longsleeve', gender = 'male', animation = 'walk') => {
  const torsoConfig = LPC_ASSET_CONFIG.torso[type]?.[gender];
  if (!torsoConfig) {
    throw new Error(`Unsupported torso type/gender: ${type}/${gender}`);
  }

  const fileName = ANIMATION_FILE_MAP[animation];
  if (!fileName) {
    throw new Error(`Unsupported animation for torso: ${animation}`);
  }

  const assetPath = `${torsoConfig.path}/${fileName}`;
  return loadLPCAsset(assetPath);
};

/**
 * Load multiple torso sprites for all animations
 * @param {string} type - Clothing type (e.g., 'longsleeve')
 * @param {string} gender - 'male' or 'female'
 * @returns {Promise<Object>} Object mapping animation names to loaded images
 */
export const loadAllTorsoSprites = async (type = 'longsleeve', gender = 'male') => {
  const sprites = {};
  const loadPromises = [];

  for (const [animationKey] of Object.entries(ANIMATION_FILE_MAP)) {
    const promise = loadTorsoSprite(type, gender, animationKey)
      .then(img => { sprites[animationKey] = img; })
      .catch(err => {
        console.warn(`Failed to load ${animationKey} torso sprite for ${type}/${gender}:`, err);
        sprites[animationKey] = null;
      });
    loadPromises.push(promise);
  }

  await Promise.all(loadPromises);
  return sprites;
};

/**
 * Load a legs sprite for a specific animation
 * @param {string} type - Clothing type (e.g., 'pants')
 * @param {string} gender - 'male' or 'female'
 * @param {string} animation - Animation name
 * @returns {Promise<HTMLImageElement>} Legs sprite image
 */
export const loadLegsSprite = async (type = 'pants', gender = 'male', animation = 'walk') => {
  const legsConfig = LPC_ASSET_CONFIG.legs[type]?.[gender];
  if (!legsConfig) {
    throw new Error(`Unsupported legs type/gender: ${type}/${gender}`);
  }

  const fileName = ANIMATION_FILE_MAP[animation];
  if (!fileName) {
    throw new Error(`Unsupported animation for legs: ${animation}`);
  }

  const assetPath = `${legsConfig.path}/${fileName}`;
  return loadLPCAsset(assetPath);
};

/**
 * Load multiple legs sprites for all animations
 * @param {string} type - Clothing type (e.g., 'pants')
 * @param {string} gender - 'male' or 'female'
 * @returns {Promise<Object>} Object mapping animation names to loaded images
 */
export const loadAllLegsSprites = async (type = 'pants', gender = 'male') => {
  const sprites = {};
  const loadPromises = [];

  for (const [animationKey] of Object.entries(ANIMATION_FILE_MAP)) {
    const promise = loadLegsSprite(type, gender, animationKey)
      .then(img => { sprites[animationKey] = img; })
      .catch(err => {
        console.warn(`Failed to load ${animationKey} legs sprite for ${type}/${gender}:`, err);
        sprites[animationKey] = null;
      });
    loadPromises.push(promise);
  }

  await Promise.all(loadPromises);
  return sprites;
};

/**
 * Create a character frame from LPC sprites with proper layering
 * @param {Object} allSprites - Object containing all loaded sprite collections
 * @param {string} animation - Current animation name
 * @param {number} frame - Frame number within animation
 * @param {string} direction - Direction (up, down, left, right)
 * @param {Object} characterParts - Which parts to include
 * @returns {HTMLCanvasElement} Composed character frame
 */
export const createLPCCharacterFrame = (allSprites, animation, frame, direction, characterParts) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.clearRect(0, 0, 64, 64);
  ctx.imageSmoothingEnabled = false;

  // LPC direction mapping (row indices in spritesheets)
  const directionRows = {
    up: 0,
    left: 1,
    down: 2,
    right: 3
  };

  const directionRow = directionRows[direction] || 2; // Default to down

  // Calculate source rectangle for this frame and direction
  const sourceX = frame * 64; // Each frame is 64px wide
  const sourceY = directionRow * 64; // Each direction row is 64px tall

  // LPC layering order: body -> head -> hair -> clothing -> accessories
  let hasAnySprite = false;

  // Layer 1: Draw body if enabled and sprite is available
  if (characterParts.body && allSprites.body && allSprites.body[animation]) {
    const bodySprite = allSprites.body[animation];
    try {
      ctx.drawImage(
        bodySprite,
        sourceX, sourceY, 64, 64, // Source rectangle
        0, 0, 64, 64 // Destination rectangle
      );
      hasAnySprite = true;
    } catch (error) {
      console.warn(`Failed to draw body frame ${frame} for ${animation}:`, error);
    }
  }

  // Layer 2: Draw head if enabled and sprite is available
  if (characterParts.head && allSprites.head && allSprites.head[animation]) {
    const headSprite = allSprites.head[animation];
    try {
      ctx.drawImage(
        headSprite,
        sourceX, sourceY, 64, 64, // Source rectangle
        0, 0, 64, 64 // Destination rectangle
      );
      hasAnySprite = true;
    } catch (error) {
      console.warn(`Failed to draw head frame ${frame} for ${animation}:`, error);
    }
  }

  // Layer 3: Draw hair if enabled and sprite is available
  if (characterParts.hair && allSprites.hair && allSprites.hair[animation]) {
    const hairSprite = allSprites.hair[animation];
    try {
      ctx.drawImage(
        hairSprite,
        sourceX, sourceY, 64, 64, // Source rectangle
        0, 0, 64, 64 // Destination rectangle
      );
      hasAnySprite = true;
    } catch (error) {
      console.warn(`Failed to draw hair frame ${frame} for ${animation}:`, error);
    }
  }

  // Layer 4: Draw torso/clothing if enabled and sprite is available
  if (characterParts.clothing && allSprites.torso && allSprites.torso[animation]) {
    const torsoSprite = allSprites.torso[animation];
    try {
      ctx.drawImage(
        torsoSprite,
        sourceX, sourceY, 64, 64, // Source rectangle
        0, 0, 64, 64 // Destination rectangle
      );
      hasAnySprite = true;
    } catch (error) {
      console.warn(`Failed to draw torso frame ${frame} for ${animation}:`, error);
    }
  }

  // Layer 5: Draw legs/pants if enabled and sprite is available
  if (characterParts.clothing && allSprites.legs && allSprites.legs[animation]) {
    const legsSprite = allSprites.legs[animation];
    try {
      ctx.drawImage(
        legsSprite,
        sourceX, sourceY, 64, 64, // Source rectangle
        0, 0, 64, 64 // Destination rectangle
      );
      hasAnySprite = true;
    } catch (error) {
      console.warn(`Failed to draw legs frame ${frame} for ${animation}:`, error);
    }
  }

  // Fall back to placeholder if no sprites were successfully drawn
  if (!hasAnySprite) {
    drawPlaceholderCharacter(ctx, characterParts, direction);
  }

  return canvas;
};

/**
 * Fallback placeholder character drawing (simplified version of original)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} characterParts - Character parts configuration
 * @param {string} direction - Character direction
 */
const drawPlaceholderCharacter = (ctx, characterParts, direction) => {
  const isProfile = direction === 'left' || direction === 'right';
  const isBack = direction === 'up';
  const flipX = direction === 'left';

  ctx.save();

  if (flipX) {
    ctx.scale(-1, 1);
    ctx.translate(-64, 0);
  }

  // Draw simple placeholder body
  if (characterParts.body) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(isProfile ? 24 : 22, 40, isProfile ? 16 : 20, 20);
  }

  // Draw simple placeholder head
  if (characterParts.head) {
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(isProfile ? 26 : 24, 20, isProfile ? 12 : 16, 18);

    // Simple facial features
    if (!isBack) {
      ctx.fillStyle = '#000000';
      if (isProfile) {
        ctx.fillRect(30, 26, 1, 1);
        ctx.fillRect(29, 30, 2, 1);
      } else {
        ctx.fillRect(28, 26, 1, 1);
        ctx.fillRect(35, 26, 1, 1);
        ctx.fillRect(30, 30, 4, 1);
      }
    }
  }

  // Draw simple placeholder hair
  if (characterParts.hair) {
    ctx.fillStyle = '#654321';
    ctx.fillRect(isProfile ? 25 : 24, 20, isProfile ? 14 : 16, isProfile ? 10 : 8);
  }

  ctx.restore();
};

/**
 * Preload essential LPC assets for immediate use
 * @param {string} gender - Gender for body, head, torso, and legs sprites
 * @param {string} hairStyle - Hair style to load
 * @param {string} torsoType - Torso clothing type
 * @param {string} legsType - Legs clothing type
 * @returns {Promise<Object>} Preloaded asset collection
 */
export const preloadEssentialAssets = async (gender = 'male', hairStyle = 'plain', torsoType = 'longsleeve', legsType = 'pants') => {
  try {
    const [bodySprites, headSprites, hairSprites, torsoSprites, legsSprites] = await Promise.all([
      loadAllBodySprites(gender),
      loadAllHeadSprites(gender),
      loadAllHairSprites(hairStyle),
      loadAllTorsoSprites(torsoType, gender),
      loadAllLegsSprites(legsType, gender)
    ]);

    return {
      body: bodySprites,
      head: headSprites,
      hair: hairSprites,
      torso: torsoSprites,
      legs: legsSprites
    };
  } catch (error) {
    console.warn('Failed to preload some LPC assets:', error);
    return {
      body: {},
      head: {},
      hair: {},
      torso: {},
      legs: {}
    };
  }
};

/**
 * Get available asset paths for debugging/exploration
 * @returns {Object} Asset paths configuration
 */
export const getAssetPaths = () => {
  return LPC_ASSET_CONFIG;
};

/**
 * Check if an asset is cached
 * @param {string} assetPath - Path to check
 * @returns {boolean} Whether asset is cached
 */
export const isAssetCached = (assetPath) => {
  const fullUrl = `${LPC_BASE_URL}/${assetPath}`;
  return imageCache.has(fullUrl);
};

/**
 * Clear the asset cache (useful for development/debugging)
 */
export const clearAssetCache = () => {
  imageCache.clear();
  loadPromises.clear();
};