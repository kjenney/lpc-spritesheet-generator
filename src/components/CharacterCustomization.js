import React from 'react';
import { useAnimation } from '../hooks/useAnimation';
import { HAIR_COLORS } from '../utils/lpcAssetLoader';

const CharacterCustomization = () => {
  const { characterParts, handleCharacterPartsChange, hairColor, handleHairColorChange } = useAnimation();

  const handlePartToggle = (partName) => {
    handleCharacterPartsChange({
      ...characterParts,
      [partName]: !characterParts[partName]
    });
  };

  const partDescriptions = {
    body: 'Base character body and limbs',
    head: 'Character head with basic facial features',
    hair: 'Hair styling (varies by direction)',
    clothing: 'Shirt and pants/armor',
    accessories: 'Additional items like hats, capes, etc.'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
        Toggle character parts to customize appearance:
      </p>
      
      {Object.entries(characterParts).map(([part, enabled]) => (
        <div key={part} className="checkbox-group">
          <input
            type="checkbox"
            id={`part-${part}`}
            checked={enabled}
            onChange={() => handlePartToggle(part)}
          />
          <label 
            htmlFor={`part-${part}`} 
            style={{ 
              fontSize: '0.875rem', 
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.125rem'
            }}
          >
            <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
              {part}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {partDescriptions[part]}
            </span>
          </label>
        </div>
      ))}

      {/* Hair Color Selection */}
      {characterParts.hair && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <label style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem',
            display: 'block'
          }}>
            Hair Color
          </label>
          <select
            value={hairColor}
            onChange={(e) => handleHairColorChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            {Object.entries(HAIR_COLORS).map(([colorKey, colorData]) => (
              <option key={colorKey} value={colorKey}>
                {colorData.name}
              </option>
            ))}
          </select>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            marginTop: '0.5rem'
          }}>
            {Object.entries(HAIR_COLORS).map(([colorKey, colorData]) => (
              <button
                key={colorKey}
                onClick={() => handleHairColorChange(colorKey)}
                style={{
                  width: '24px',
                  height: '24px',
                  border: hairColor === colorKey ? '2px solid #3b82f6' : '1px solid #d1d5db',
                  borderRadius: '50%',
                  backgroundColor: `rgb(${colorData.r}, ${colorData.g}, ${colorData.b})`,
                  cursor: 'pointer',
                  padding: 0,
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)'
                }}
                title={colorData.name}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.375rem'
      }}>
        <p style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.4 }}>
          <strong>LPC Integration:</strong> The app now loads actual Universal LPC
          Spritesheet assets from GitHub. When assets are loaded successfully,
          you'll see real LPC character sprites. Falls back to placeholder sprites
          if assets fail to load.
        </p>
      </div>
    </div>
  );
};

export default CharacterCustomization;
