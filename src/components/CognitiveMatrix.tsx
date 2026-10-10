import React, { useState, useEffect } from 'react';
import { Activity, Zap, Play, Pause, RotateCcw, Droplets, Moon, ShieldCheck } from 'lucide-react';

export const CognitiveMatrix: React.FC = () => {
  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hydration, setHydration] = useState<number>(1.8);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const addHydration = () => {
    setHydration(prev => Math.min(3.5, parseFloat((prev + 0.25).toFixed(2))));
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} className="text-cyan-glow" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Cognitive Telemetry</h3>
        </div>
        <span className="badge-emerald font-mono" style={{ fontSize: '0.65rem' }}>
          FLOW STATE ACTIVE
        </span>
      </div>

      {/* Focus Meter & Pomodoro Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        
        {/* Focus Score Gauge Card */}
        <div style={{
          background: 'rgba(0, 243, 255, 0.04)',
          border: '1px solid rgba(0, 243, 255, 0.2)',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            COGNITIVE FOCUS INDEX
          </span>
          <div className="font-heading font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cyan)' }}>
            88<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--emerald)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Zap size={10} /> +12% above average
          </span>
        </div>

        {/* Deep Work Timer Card */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
            DEEP WORK SPRINT
          </span>
          <div className="font-mono text-purple-glow" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            {formatTimer(timerSeconds)}
          </div>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="btn-secondary"
              style={{ padding: '3px 10px', fontSize: '0.72rem' }}
            >
              {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={resetTimer}
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              title="Reset Timer"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* Circadian Energy Rhythm Graph */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px 14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Daily Circadian Rhythm Forecast
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--cyan)' }} className="font-mono">
            Peak: 10:30 AM
          </span>
        </div>

        {/* Hourly Energy Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '45px', gap: '4px' }}>
          {[
            { hour: '8A', energy: 65, peak: false },
            { hour: '9A', energy: 82, peak: false },
            { hour: '10A', energy: 96, peak: true },
            { hour: '11A', energy: 90, peak: true },
            { hour: '12P', energy: 75, peak: false },
            { hour: '1P', energy: 55, peak: false },
            { hour: '2P', energy: 70, peak: false },
            { hour: '3P', energy: 85, peak: false },
            { hour: '4P', energy: 78, peak: false }
          ].map((bar, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div 
                style={{
                  width: '100%',
                  height: `${bar.energy * 0.38}px`,
                  background: bar.peak ? 'linear-gradient(to top, var(--purple), var(--cyan))' : 'rgba(255,255,255,0.15)',
                  borderRadius: '3px',
                  boxShadow: bar.peak ? '0 0 8px var(--cyan)' : 'none'
                }}
              />
              <span className="font-mono" style={{ fontSize: '0.6rem', color: bar.peak ? 'var(--cyan)' : 'var(--text-muted)' }}>
                {bar.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Life Telemetry Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        
        {/* Hydration */}
        <div 
          onClick={addHydration}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '8px 10px',
            cursor: 'pointer'
          }}
          title="Click to add +0.25L water"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cyan)', fontSize: '0.7rem' }}>
            <Droplets size={12} /> Hydration
          </div>
          <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>
            {hydration}L <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/ 2.5L</span>
          </div>
        </div>

        {/* Sleep */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '8px 10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--purple)', fontSize: '0.7rem' }}>
            <Moon size={12} /> Sleep
          </div>
          <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>
            7h 45m <span style={{ fontSize: '0.65rem', color: 'var(--emerald)' }}>88%</span>
          </div>
        </div>

        {/* Stress */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '8px 10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald)', fontSize: '0.7rem' }}>
            <ShieldCheck size={12} /> Recovery
          </div>
          <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>
            OPTIMAL
          </div>
        </div>

      </div>

    </div>
  );
};
