import React from 'react';
import { useAnimation } from '../hooks/useAnimation';

const AnimationInfo = () => {
  const {
    selectedAnimation,
    selectedDirection,
    animationSpeed,
    currentFrame,
    ANIMATIONS,
    DIRECTIONS
  } = useAnimation();

  const currentAnimation = ANIMATIONS[selectedAnimation];
  const currentDirection = DIRECTIONS[selectedDirection];
  const fps = Math.round(1000 / animationSpeed);
  const totalDuration = (currentAnimation.frames * animationSpeed) / 1000;

  return (
    <div className="info-panel">
      <h3>Animation Information</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '0.5rem',
        fontSize: '0.875rem'
      }}>
        <div>
          <strong>Animation:</strong><br />
          {currentAnimation.name}
        </div>
        <div>
          <strong>Direction:</strong><br />
          {currentDirection.name}
        </div>
        <div>
          <strong>Current Frame:</strong><br />
          {currentFrame + 1} of {currentAnimation.frames}
        </div>
        <div>
          <strong>Frame Rate:</strong><br />
          {fps} FPS
        </div>
        <div>
          <strong>Duration:</strong><br />
          {totalDuration.toFixed(1)}s per cycle
        </div>
        <div>
          <strong>Frame Size:</strong><br />
          64x64 pixels (LPC standard)
        </div>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #bfdbfe' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Animation Details:
        </h4>
        <ul style={{ 
          fontSize: '0.75rem', 
          lineHeight: 1.4, 
          paddingLeft: '1rem',
          margin: 0
        }}>
          {selectedAnimation === 'walk' && (
            <li>9-frame walk cycle with subtle vertical movement</li>
          )}
          {selectedAnimation === 'run' && (
            <li>8-frame run with more pronounced vertical bounce</li>
          )}
          {selectedAnimation === 'jump' && (
            <li>9-frame jump sequence with peak height in middle frames</li>
          )}
          {selectedAnimation === 'idle' && (
            <li>6-frame breathing/idle animation with gentle movement</li>
          )}
          {selectedAnimation === 'sit' && (
            <li>Single frame sitting pose (static)</li>
          )}
          {selectedAnimation === 'cast' && (
            <li>7-frame spellcasting with upward arm movement</li>
          )}
          {selectedAnimation === 'slash' && (
            <li>6-frame melee attack with diagonal swing motion</li>
          )}
          {selectedAnimation === 'thrust' && (
            <li>8-frame thrusting attack with forward lunge</li>
          )}
          {selectedAnimation === 'shoot' && (
            <li>13-frame bow shooting sequence</li>
          )}
          {selectedAnimation === 'hurt' && (
            <li>6-frame damage reaction with recoil movement</li>
          )}
          {selectedAnimation === 'climb' && (
            <li>3-frame climbing animation (vertical movement only)</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AnimationInfo;
