import React, { useState, useRef } from 'react';
import { Download, Grid, FileImage, Settings, Eye, AlertCircle } from 'lucide-react';
import { useAnimation } from '../hooks/useAnimation';
import {
  generateSpritesheet,
  generateAnimationSpritesheet,
  generateSpritesheetMetadata,
  exportSpritesheetWithMetadata,
  validateSpritesheetParams
} from '../utils/spritesheetGenerator';

const SpritesheetGenerator = () => {
  const {
    characterParts,
    ANIMATIONS
  } = useAnimation();

  const [selectedAnimations, setSelectedAnimations] = useState(Object.keys(ANIMATIONS));
  const [generationMode, setGenerationMode] = useState('complete'); // 'complete' or 'single'
  const [singleAnimation, setSingleAnimation] = useState('walk');
  const [options, setOptions] = useState({
    includeFrameNumbers: false,
    backgroundColor: 'transparent',
    includeMetadata: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewCanvasRef = useRef(null);

  // Handle animation selection toggle
  const toggleAnimation = (animationName) => {
    setSelectedAnimations(prev => {
      if (prev.includes(animationName)) {
        return prev.filter(name => name !== animationName);
      } else {
        return [...prev, animationName];
      }
    });
  };

  // Select/deselect all animations
  const toggleAllAnimations = () => {
    if (selectedAnimations.length === Object.keys(ANIMATIONS).length) {
      setSelectedAnimations([]);
    } else {
      setSelectedAnimations(Object.keys(ANIMATIONS));
    }
  };

  // Generate and preview spritesheet
  const generatePreview = () => {
    setIsGenerating(true);

    try {
      const validation = validateSpritesheetParams({
        characterParts,
        selectedAnimations: generationMode === 'complete' ? selectedAnimations : [singleAnimation]
      });

      if (!validation.isValid) {
        alert('Validation errors: ' + validation.errors.join(', '));
        return;
      }

      let canvas;
      if (generationMode === 'complete') {
        canvas = generateSpritesheet(characterParts, selectedAnimations, options);
      } else {
        canvas = generateAnimationSpritesheet(characterParts, singleAnimation, options);
      }

      // Show preview
      const previewCanvas = previewCanvasRef.current;
      if (previewCanvas && canvas) {
        const previewCtx = previewCanvas.getContext('2d');

        // Scale down for preview if needed
        const maxPreviewWidth = 600;
        const maxPreviewHeight = 400;
        let scale = 1;

        if (canvas.width > maxPreviewWidth || canvas.height > maxPreviewHeight) {
          scale = Math.min(maxPreviewWidth / canvas.width, maxPreviewHeight / canvas.height);
        }

        previewCanvas.width = canvas.width * scale;
        previewCanvas.height = canvas.height * scale;

        previewCtx.imageSmoothingEnabled = false;
        previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);

        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating preview: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export spritesheet
  const exportSpritesheet = () => {
    setIsGenerating(true);

    try {
      const validation = validateSpritesheetParams({
        characterParts,
        selectedAnimations: generationMode === 'complete' ? selectedAnimations : [singleAnimation]
      });

      if (!validation.isValid) {
        alert('Validation errors: ' + validation.errors.join(', '));
        return;
      }

      let canvas;
      let filename;
      let animationsUsed;

      if (generationMode === 'complete') {
        canvas = generateSpritesheet(characterParts, selectedAnimations, options);
        filename = `lpc-complete-spritesheet-${selectedAnimations.length}anims`;
        animationsUsed = selectedAnimations;
      } else {
        canvas = generateAnimationSpritesheet(characterParts, singleAnimation, options);
        filename = `lpc-${singleAnimation}-spritesheet`;
        animationsUsed = [singleAnimation];
      }

      if (options.includeMetadata) {
        const metadata = generateSpritesheetMetadata(animationsUsed, options);
        exportSpritesheetWithMetadata(canvas, metadata, filename);
      } else {
        // Export just the image
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }

    } catch (error) {
      console.error('Error exporting spritesheet:', error);
      alert('Error exporting spritesheet: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
        <Grid size={16} style={{ marginRight: '0.5rem' }} />
        Spritesheet Generator
      </h3>

      {/* Generation Mode */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
          Generation Mode
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setGenerationMode('complete')}
            className={`btn ${generationMode === 'complete' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem' }}
          >
            Complete Sheet
          </button>
          <button
            onClick={() => setGenerationMode('single')}
            className={`btn ${generationMode === 'single' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem' }}
          >
            Single Animation
          </button>
        </div>
      </div>

      {/* Animation Selection */}
      {generationMode === 'complete' ? (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              Select Animations ({selectedAnimations.length}/{Object.keys(ANIMATIONS).length})
            </label>
            <button onClick={toggleAllAnimations} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              {selectedAnimations.length === Object.keys(ANIMATIONS).length ? 'None' : 'All'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
            {Object.entries(ANIMATIONS).map(([key, animation]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={selectedAnimations.includes(key)}
                  onChange={() => toggleAnimation(key)}
                  style={{ marginRight: '0.5rem' }}
                />
                {animation.name}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
            Select Animation
          </label>
          <select
            value={singleAnimation}
            onChange={(e) => setSingleAnimation(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            {Object.entries(ANIMATIONS).map(([key, animation]) => (
              <option key={key} value={key}>
                {animation.name} ({animation.frames} frames)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Options */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
          <Settings size={14} style={{ marginRight: '0.25rem' }} />
          Options
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              checked={options.includeFrameNumbers}
              onChange={(e) => setOptions(prev => ({ ...prev, includeFrameNumbers: e.target.checked }))}
              style={{ marginRight: '0.5rem' }}
            />
            Include frame numbers
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              checked={options.includeMetadata}
              onChange={(e) => setOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
              style={{ marginRight: '0.5rem' }}
            />
            Include metadata file
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem' }}>Background:</label>
            <select
              value={options.backgroundColor}
              onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
              style={{
                padding: '0.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="transparent">Transparent</option>
              <option value="#ffffff">White</option>
              <option value="#000000">Black</option>
              <option value="#f0f0f0">Light Gray</option>
            </select>
          </div>
        </div>
      </div>

      {/* Warning for no animations selected */}
      {generationMode === 'complete' && selectedAnimations.length === 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem',
          backgroundColor: '#fef3cd',
          border: '1px solid #f6e05e',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          <AlertCircle size={16} style={{ color: '#d69e2e', marginRight: '0.5rem' }} />
          <span style={{ fontSize: '0.875rem', color: '#975a16' }}>
            Select at least one animation to generate spritesheet
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={generatePreview}
          disabled={isGenerating || (generationMode === 'complete' && selectedAnimations.length === 0)}
          className="btn btn-secondary"
          style={{ flex: 1 }}
        >
          <Eye size={16} />
          {isGenerating ? 'Generating...' : 'Preview'}
        </button>
        <button
          onClick={exportSpritesheet}
          disabled={isGenerating || (generationMode === 'complete' && selectedAnimations.length === 0)}
          className="btn btn-success"
          style={{ flex: 1 }}
        >
          <Download size={16} />
          {isGenerating ? 'Generating...' : 'Export'}
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              <FileImage size={14} style={{ marginRight: '0.25rem' }} />
              Preview
            </label>
            <button
              onClick={() => setShowPreview(false)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Hide
            </button>
          </div>
          <div style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            backgroundColor: '#f9fafb',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            <canvas
              ref={previewCanvasRef}
              style={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                imageRendering: 'pixelated'
              }}
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{
        fontSize: '0.75rem',
        color: '#6b7280',
        padding: '0.5rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.375rem'
      }}>
        <p style={{ margin: 0, marginBottom: '0.25rem' }}>
          <strong>LPC Format:</strong> Standard 64×64px frames, 4 directions per animation
        </p>
        <p style={{ margin: 0 }}>
          <strong>Export:</strong> PNG image{options.includeMetadata ? ' + JSON metadata' : ''} ready for game engines
        </p>
      </div>
    </div>
  );
};

export default SpritesheetGenerator;