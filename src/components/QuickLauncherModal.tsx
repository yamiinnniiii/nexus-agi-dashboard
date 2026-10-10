import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface QuickLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionName: string) => void;
}

export const QuickLauncherModal: React.FC<QuickLauncherModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('OPEN');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const actions = [
    { id: 'brief', name: '⚡ Synthesize Morning Intelligence Briefing', category: 'AGI' },
    { id: 'sound', name: '🎵 Toggle Ambient Alpha-Wave Synthesizer', category: 'Audio' },
    { id: 'focus', name: '🎯 Enter 25-Min Deep Work Focus Sprint', category: 'Timer' },
    { id: 'task', name: '➕ Create New High-Priority Objective', category: 'Tasks' },
    { id: 'water', name: '💧 Log 250ml Hydration', category: 'Biometrics' }
  ];

  const filtered = actions.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.75)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '100px'
    }}>
      <div 
        className="glass-panel-glow"
        style={{
          width: '90%',
          maxWidth: '560px',
          padding: '16px',
          borderRadius: '16px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Search size={18} className="text-cyan-glow" />
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search AGI directives..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1rem',
              width: '100%'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
          {filtered.map(act => (
            <div 
              key={act.id}
              onClick={() => {
                onSelectAction(act.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              className="hover:bg-cyan-900/30"
            >
              <span style={{ fontSize: '0.88rem' }}>{act.name}</span>
              <span className="badge-cyan font-mono" style={{ fontSize: '0.65rem' }}>{act.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
