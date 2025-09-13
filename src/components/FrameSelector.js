import React from 'react';
import { useAnimation } from '../hooks/useAnimation';

const FrameSelector = () => {
  const { 
    currentFrame, 
    selectedAnimation, 
    ANIMATIONS, 
    handleFrameChange 
  } = useAnimation();

  const totalFrames = ANIMATIONS[selectedAnimation].frames;

  return (
    <div className="frame-selector">
      <label className="form-label">
        Frames ({totalFrames} total)
      </label>
      <div className="frame-grid">
        {Array.from({ length: totalFrames }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleFrameChange(index)}
            className={`frame-button ${currentFrame === index ? 'active' : ''}`}
            title={`Frame ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrameSelector;
