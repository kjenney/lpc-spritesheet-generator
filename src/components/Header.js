import React from 'react';

const Header = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          LPC Animation Generator
        </h1>
        <p style={{
          fontSize: '1.1rem',
          textAlign: 'center',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Create and preview character animations using the Liberated Pixel Cup (LPC) format.
          Supports walk, run, jump, combat moves, and more with customizable characters.
        </p>
      </div>
    </header>
  );
};

export default Header;
