import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen" style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--primary)',
        fontSize: '1rem',
        opacity: 0.8,
        marginBottom: '0.5rem'
      }}>
        The Portfolio of
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--text)',
        fontSize: 'clamp(1.5rem, 5vw, 3rem)',
        fontWeight: 900,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem'
      }}>
        Tamima Mollick Tuly
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--primary)',
        fontSize: '1rem',
        opacity: 0.8
      }}>
        is loading<span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
        <span className="loading-dot">.</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
