import React from 'react';

const AttributionNotice = () => {
  return (
    <div className="warning-panel">
      <h3>LPC Attribution Required</h3>
      <p>
        When using LPC (Liberated Pixel Cup) sprites in your projects, you must 
        provide proper attribution to all contributing artists. The sprites are 
        available under various Creative Commons licenses.
      </p>
      
      <div style={{ marginTop: '0.75rem' }}>
        <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
          Required Attribution:
        </p>
        <ul style={{ paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
          <li>Credit all contributing artists</li>
          <li>Include license information (CC-BY-SA, CC-BY, etc.)</li>
          <li>Link to the original LPC project when possible</li>
          <li>Provide credits in an accessible location in your game/app</li>
        </ul>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <p>
          <strong>Resources:</strong>
        </p>
        <ul style={{ paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
          <li>
            <a 
              href="https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Attribution Guide
            </a>
          </li>
          <li>
            <a 
              href="https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/blob/master/CREDITS.csv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Complete Credits File
            </a>
          </li>
          <li>
            <a 
              href="https://lpc.opengameart.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              LPC Project Homepage
            </a>
          </li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '0.75rem', 
        padding: '0.5rem', 
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderRadius: '0.25rem' 
      }}>
        <p style={{ fontSize: '0.7rem', margin: 0, fontStyle: 'italic' }}>
          This demo uses placeholder sprites. Real LPC sprites have extensive 
          attribution requirements that must be followed for commercial or 
          public use.
        </p>
      </div>
    </div>
  );
};

export default AttributionNotice;
