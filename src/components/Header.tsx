import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, Minimize2, Search, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-panel" style={{ padding: '14px 24px', marginBottom: '20px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left: Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.2), rgba(168, 85, 247, 0.2))',
            border: '1px solid rgba(0, 243, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.3)'
          }}>
            <Sparkles size={22} className="text-cyan-glow" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                NEXUS<span className="gradient-text-agi">.AGI</span>
              </h1>
              <span className="badge-cyan font-mono" style={{ fontSize: '0.65rem' }}>
                <Zap size={10} /> CORE v3.6
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Personal Intelligence & Telemetry OS
            </p>
          </div>
        </div>

        {/* Center: Live Clock & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="font-mono" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--cyan)', letterSpacing: '0.05em' }}>
              {time || '10:19:10 AM'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {dateStr || 'Saturday, Oct 10'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '20px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }}></span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              AGI SYNAPSE ONLINE
            </span>
          </div>
        </div>

        {/* Right: Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Quick Search */}
          <button 
            onClick={onOpenSearch}
            className="btn-secondary" 
            title="Cmd + K Quick Launcher"
          >
            <Search size={14} />
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cmd + K</span>
          </button>

          {/* Focus Mode Button */}
          <button 
            onClick={onToggleFocusMode}
            className={`btn-secondary ${isFocusMode ? 'btn-primary' : ''}`}
            title="Toggle Focus Mode"
          >
            {isFocusMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span style={{ fontSize: '0.8rem' }}>{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
