import React from 'react';
import { useAnimation } from '../hooks/useAnimation';

const AnimationSettings = () => {
  const {
    selectedAnimation,
    selectedDirection,
    scale,
    ANIMATIONS,
    DIRECTIONS,
    handleAnimationChange,
    handleDirectionChange,
    handleScaleChange
  } = useAnimation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Animation Type Selection */}
      <div className="form-group">
        <label htmlFor="animation-select" className="form-label">
          Animation Type
        </label>
        <select
          id="animation-select"
          value={selectedAnimation}
          onChange={(e) => handleAnimationChange(e.target.value)}
          className="form-select"
        >
          {Object.entries(ANIMATIONS).map(([key, anim]) => (
            <option key={key} value={key}>
              {anim.name} ({anim.frames} frames)
            </option>
          ))}
        </select>
      </div>

      {/* Direction Selection */}
      <div className="form-group">
        <label htmlFor="direction-select" className="form-label">
          Direction
        </label>
        <select
          id="direction-select"
          value={selectedDirection}
          onChange={(e) => handleDirectionChange(e.target.value)}
          className="form-select"
        >
          {Object.entries(DIRECTIONS).map(([key, dir]) => (
            <option key={key} value={key}>
              {dir.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scale Control */}
      <div className="form-group">
        <label htmlFor="scale-control" className="form-label">
          Scale: {scale}x
        </label>
        <input
          id="scale-control"
          type="range"
          min="1"
          max="8"
          step="1"
          value={scale}
          onChange={(e) => handleScaleChange(Number(e.target.value))}
          className="form-input"
          style={{ width: '100%' }}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.75rem', 
          color: '#6b7280',
          marginTop: '0.25rem'
        }}>
          <span>1x</span>
          <span>4x</span>
          <span>8x</span>
        </div>
      </div>
    </div>
  );
};

export default AnimationSettings;
