import React from 'react';
import { Settings } from 'lucide-react';
import AnimationSettings from './AnimationSettings';
import CharacterCustomization from './CharacterCustomization';
import SpritesheetGenerator from './SpritesheetGenerator';
import AnimationInfo from './AnimationInfo';
import AttributionNotice from './AttributionNotice';

const ConfigurationPanel = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Settings size={20} />
          Animation Settings
        </h3>
        <AnimationSettings />
      </div>

      <div className="card">
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Character Customization
        </h3>
        <CharacterCustomization />
      </div>

      <SpritesheetGenerator />

      <AnimationInfo />
      <AttributionNotice />
    </div>
  );
};

export default ConfigurationPanel;
