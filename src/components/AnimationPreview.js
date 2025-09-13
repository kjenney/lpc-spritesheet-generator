import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { useAnimation } from '../hooks/useAnimation';
import AnimationControls from './AnimationControls';
import FrameSelector from './FrameSelector';
import { 
  createCharacterSprite, 
  getFrameOffset, 
  drawFrameInfo, 
  exportFrame 
} from '../utils/characterRenderer';

const AnimationPreview = () => {
  const canvasRef = useRef(null);
  const {
    isPlaying,
    currentFrame,
    animationSpeed,
    selectedAnimation,
    selectedDirection,
    scale,
    characterParts,
    ANIMATIONS,
    handlePlayPause,
    handleReset,
    nextFrame
  } = useAnimation();

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
    
    // Create character sprite
    const characterSprite = createCharacterSprite(characterParts, selectedDirection);
    
    // Get animation offset
    const offset = getFrameOffset(selectedAnimation, currentFrame, selectedDirection);
    
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
  }, [currentFrame, selectedAnimation, selectedDirection, scale, characterParts]);

  const handleExport = () => {
    exportFrame(canvasRef.current, selectedAnimation, selectedDirection, currentFrame);
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
        Animation Preview
      </h2>
      
      {/* Canvas Container */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
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
