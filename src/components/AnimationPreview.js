import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { useAnimation } from '../hooks/useAnimation';
import AnimationControls from './AnimationControls';
import FrameSelector from './FrameSelector';
import {
  createLPCCharacterSprite,
  createCharacterSprite,
  getFrameOffset,
  drawFrameInfo,
  exportFrame,
  initializeLPCAssets,
  updateHairColor
} from '../utils/characterRenderer';

const AnimationPreview = () => {
  const canvasRef = useRef(null);
  const [lpcAssetsLoaded, setLpcAssetsLoaded] = useState(false);
  const {
    isPlaying,
    currentFrame,
    animationSpeed,
    selectedAnimation,
    selectedDirection,
    scale,
    characterParts,
    hairColor,
    ANIMATIONS,
    handlePlayPause,
    handleReset,
    nextFrame
  } = useAnimation();

  // Initialize LPC assets when component mounts
  useEffect(() => {
    console.log('Starting LPC asset initialization...');
    initializeLPCAssets()
      .then((assets) => {
        console.log('LPC assets loaded successfully:', assets);
        setLpcAssetsLoaded(true);
      })
      .catch(error => {
        console.error('Failed to initialize LPC assets:', error);
        console.log('Falling back to placeholder sprites');
        setLpcAssetsLoaded(false);
      });
  }, []);

  // Update hair color when it changes
  useEffect(() => {
    if (lpcAssetsLoaded) {
      updateHairColor(hairColor);
    }
  }, [hairColor, lpcAssetsLoaded]);

  // Animation loop
  useEffect(() => {
    let animationId;
    let lastTime = 0;

    const animate = (timestamp) => {
      if (timestamp - lastTime >= animationSpeed) {
        if (isPlaying) {
          nextFrame();
        }
        lastTime = timestamp;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, animationSpeed, nextFrame]);

  // Draw current frame
  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const frameWidth = 64;
    const frameHeight = 64;
    
    // Clear canvas with checkerboard background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create character sprite using LPC assets if available
    const characterSprite = lpcAssetsLoaded
      ? createLPCCharacterSprite(characterParts, selectedDirection, selectedAnimation, currentFrame)
      : createCharacterSprite(characterParts, selectedDirection);

    // Get animation offset (only apply for placeholder sprites, LPC sprites handle frames internally)
    const offset = lpcAssetsLoaded
      ? { x: 0, y: 0 }  // LPC sprites already have the correct frame
      : getFrameOffset(selectedAnimation, currentFrame, selectedDirection);

    // Calculate position with offset and centering
    const x = (canvas.width - frameWidth * scale) / 2 + offset.x * scale;
    const y = (canvas.height - frameHeight * scale) / 2 + offset.y * scale;

    // Draw character with scaling and no smoothing for pixel art
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(characterSprite, x, y, frameWidth * scale, frameHeight * scale);
    
    // Draw frame info overlay
    drawFrameInfo(
      ctx, 
      ANIMATIONS[selectedAnimation].name, 
      currentFrame, 
      ANIMATIONS[selectedAnimation].frames
    );
  };

  // Redraw when dependencies change
  useEffect(() => {
    drawFrame();
  }, [currentFrame, selectedAnimation, selectedDirection, scale, characterParts, hairColor]);

  const handleExport = () => {
    exportFrame(canvasRef.current, selectedAnimation, selectedDirection, currentFrame);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
          Animation Preview
        </h2>
        <div style={{
          fontSize: '0.75rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          backgroundColor: lpcAssetsLoaded ? '#dcfce7' : '#fef3cd',
          color: lpcAssetsLoaded ? '#15803d' : '#a16207',
          border: `1px solid ${lpcAssetsLoaded ? '#bbf7d0' : '#fde047'}`
        }}>
          {lpcAssetsLoaded ? '✓ LPC Assets Loaded' : '⟳ Loading LPC Assets...'}
        </div>
      </div>
      
      {/* Canvas Container */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="animation-canvas"
        />
      </div>

      {/* Animation Controls */}
      <div className="animation-controls">
        <div className="control-group">
          <button onClick={handlePlayPause} className="btn btn-primary">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button onClick={handleReset} className="btn btn-secondary">
            <RotateCcw size={16} />
            Reset
          </button>
          
          <button onClick={handleExport} className="btn btn-success">
            <Download size={16} />
            Export Frame
          </button>
        </div>
        
        <AnimationControls />
      </div>

      {/* Frame Selector */}
      <FrameSelector />
    </div>
  );
};

export default AnimationPreview;
