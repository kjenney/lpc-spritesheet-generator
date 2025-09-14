import React, { createContext, useContext, useState, useCallback } from 'react';

// Animation definitions based on LPC standards
export const ANIMATIONS = {
  walk: { frames: 9, name: 'Walk' },
  run: { frames: 8, name: 'Run' },
  jump: { frames: 9, name: 'Jump' },
  idle: { frames: 6, name: 'Idle' },
  sit: { frames: 1, name: 'Sit' },
  cast: { frames: 7, name: 'Cast Spell' },
  slash: { frames: 6, name: 'Slash' },
  thrust: { frames: 8, name: 'Thrust' },
  shoot: { frames: 13, name: 'Shoot Bow' },
  hurt: { frames: 6, name: 'Hurt' },
  climb: { frames: 3, name: 'Climb' }
};

export const DIRECTIONS = {
  up: { name: 'Up (North)', row: 0 },
  left: { name: 'Left (West)', row: 1 },
  down: { name: 'Down (South)', row: 2 },
  right: { name: 'Right (East)', row: 3 }
};

const AnimationContext = createContext();

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(200);
  const [selectedAnimation, setSelectedAnimation] = useState('walk');
  const [selectedDirection, setSelectedDirection] = useState('down');
  const [scale, setScale] = useState(4);
  const [characterParts, setCharacterParts] = useState({
    body: true,
    head: true,
    hair: true,
    clothing: true,
    accessories: false
  });

  const [hairColor, setHairColor] = useState('brown');

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
  }, []);

  const handleAnimationChange = useCallback((animationType) => {
    setSelectedAnimation(animationType);
    setCurrentFrame(0);
    setIsPlaying(false);
  }, []);

  const handleFrameChange = useCallback((frameIndex) => {
    setCurrentFrame(frameIndex);
    setIsPlaying(false);
  }, []);

  const handleDirectionChange = useCallback((direction) => {
    setSelectedDirection(direction);
  }, []);

  const handleScaleChange = useCallback((newScale) => {
    setScale(newScale);
  }, []);

  const handleSpeedChange = useCallback((speed) => {
    setAnimationSpeed(speed);
  }, []);

  const handleCharacterPartsChange = useCallback((parts) => {
    setCharacterParts(parts);
  }, []);

  const handleHairColorChange = useCallback((color) => {
    setHairColor(color);
  }, []);

  const nextFrame = useCallback(() => {
    setCurrentFrame(prev => (prev + 1) % ANIMATIONS[selectedAnimation].frames);
  }, [selectedAnimation]);

  const value = {
    // State
    isPlaying,
    currentFrame,
    animationSpeed,
    selectedAnimation,
    selectedDirection,
    scale,
    characterParts,
    hairColor,

    // Actions
    handlePlayPause,
    handleReset,
    handleAnimationChange,
    handleFrameChange,
    handleDirectionChange,
    handleScaleChange,
    handleSpeedChange,
    handleCharacterPartsChange,
    handleHairColorChange,
    nextFrame,

    // Constants
    ANIMATIONS,
    DIRECTIONS
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};
