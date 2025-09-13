import React from 'react';
import AnimationPreview from './components/AnimationPreview';
import ConfigurationPanel from './components/ConfigurationPanel';
import Header from './components/Header';
import { AnimationProvider } from './hooks/useAnimation';
import './App.css';

function App() {
  return (
    <AnimationProvider>
      <div className="App">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="layout">
              <ConfigurationPanel />
              <AnimationPreview />
            </div>
          </div>
        </main>
      </div>
    </AnimationProvider>
  );
}

export default App;
