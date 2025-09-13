import React from 'react';
import { useAnimation } from '../hooks/useAnimation';

const AnimationControls = () => {
  const { animationSpeed, handleSpeedChange } = useAnimation();

  return (
    <div className="control-group">
      <label htmlFor="speed-control" className="form-label" style={{ margin: 0, marginRight: '0.5rem' }}>
        Speed:
      </label>
      <input
        id="speed-control"
        type="range"
        min="50"
        max="1000"
        step="50"
        value={animationSpeed}
        onChange={(e) => handleSpeedChange(Number(e.target.value))}
        style={{ width: '100px' }}
      />
      <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '60px' }}>
        {animationSpeed}ms
      </span>
    </div>
  );
};

export default AnimationControls;
