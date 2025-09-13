import React from 'react';
import { useAnimation } from '../hooks/useAnimation';

const CharacterCustomization = () => {
  const { characterParts, handleCharacterPartsChange } = useAnimation();

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

      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '0.375rem' 
      }}>
        <p style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.4 }}>
          <strong>Note:</strong> This is a simplified character renderer. 
          In a full LPC implementation, each part would be loaded from separate 
          spritesheet files and layered according to the LPC standard.
        </p>
      </div>
    </div>
  );
};

export default CharacterCustomization;
