import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { TaskBoard } from './components/TaskBoard';
import { CognitiveMatrix } from './components/CognitiveMatrix';
import { AgiIntelligenceFeed } from './components/AgiIntelligenceFeed';
import { GoalTracker } from './components/GoalTracker';
import { QuickLauncherModal } from './components/QuickLauncherModal';
import { Notepad } from './components/Notepad';
import { ProjectManager } from './components/ProjectManager';
import { PersonalMemory } from './components/PersonalMemory';


import { Sparkles, Zap, Brain, Shield, LayoutGrid, FileText, FolderKanban } from 'lucide-react';

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'notepad' | 'memory'>('overview');

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'OPEN') {
      setIsSearchOpen(true);
    }
  };

  return (
    <div style={{ maxWidth: '1650px', margin: '0 auto', padding: '16px 24px 40px 24px' }}>
      
      {/* Header Bar */}
      <Header 
        onOpenSearch={() => setIsSearchOpen(true)}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
      />

      {/* Main Navigation Tabs */}
      {!isFocusMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '6px 12px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className="btn-secondary"
              style={{
                background: activeTab === 'overview' ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                borderColor: activeTab === 'overview' ? 'var(--cyan)' : 'transparent',
                color: activeTab === 'overview' ? 'var(--cyan)' : 'var(--text-secondary)'
              }}
            >
              <LayoutGrid size={15} /> Overview Command
            </button>



            <button
              onClick={() => setActiveTab('projects')}
              className="btn-secondary"
              style={{
                background: activeTab === 'projects' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                borderColor: activeTab === 'projects' ? 'var(--purple)' : 'transparent',
                color: activeTab === 'projects' ? 'var(--purple)' : 'var(--text-secondary)'
              }}
            >
              <FolderKanban size={15} /> Projects
            </button>

            <button
              onClick={() => setActiveTab('notepad')}
              className="btn-secondary"
              style={{
                background: activeTab === 'notepad' ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                borderColor: activeTab === 'notepad' ? 'var(--cyan)' : 'transparent',
                color: activeTab === 'notepad' ? 'var(--cyan)' : 'var(--text-secondary)'
              }}
            >
              <FileText size={15} /> Notepad & To-Do
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className="btn-secondary"
              style={{
                background: activeTab === 'memory' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                borderColor: activeTab === 'memory' ? 'var(--emerald)' : 'transparent',
                color: activeTab === 'memory' ? 'var(--emerald)' : 'var(--text-secondary)'
              }}
            >
              <Brain size={15} /> Personal Memory
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-cyan font-mono" style={{ fontSize: '0.7rem' }}>
              <Sparkles size={11} /> Voice & NL Connected
            </span>
          </div>
        </div>
      )}

      {/* Quick Status Bar */}
      {!isFocusMode && activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(0, 243, 255, 0.1)', color: 'var(--cyan)' }}>
              <Brain size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>COGNITIVE READINESS</div>
              <div className="font-heading font-mono text-cyan-glow" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                92% <span style={{ fontSize: '0.75rem', color: 'var(--emerald)' }}>OPTIMAL</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--purple)' }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AGI MODEL LATENCY</div>
              <div className="font-heading font-mono text-purple-glow" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                14 ms <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LOCAL</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DEEP WORK WINDOW</div>
              <div className="font-heading font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--emerald)' }}>
                10:30A - 1:00P
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)' }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PERSISTENT MEMORY</div>
              <div className="font-heading font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--amber)' }}>
                SYNCHRONIZED
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Tab Views */}

      {/* Overview View */}
      {(activeTab === 'overview' || isFocusMode) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isFocusMode ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
          alignItems: 'stretch'
        }}>
          {/* Column 1: Notepad & Goals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Notepad />
            {!isFocusMode && <GoalTracker />}
          </div>

          {/* Column 2: Editable Projects & Task Board */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ProjectManager />
            <TaskBoard />
          </div>

          {/* Column 3: Personal Memory & Telemetry Matrix */}
          {!isFocusMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <PersonalMemory />
              <CognitiveMatrix />
              <AgiIntelligenceFeed />
            </div>
          )}
        </div>
      )}

      {/* Dedicated Views */}


      {!isFocusMode && activeTab === 'projects' && (
        <div style={{ height: '700px' }}>
          <ProjectManager />
        </div>
      )}

      {!isFocusMode && activeTab === 'notepad' && (
        <div style={{ height: '700px' }}>
          <Notepad />
        </div>
      )}

      {!isFocusMode && activeTab === 'memory' && (
        <div style={{ height: '700px' }}>
          <PersonalMemory />
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '36px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <span className="font-mono" style={{ letterSpacing: '0.5px' }}>© 2026 Yamini. All rights reserved.</span>
        </div>
      </footer>

      {/* Quick Launcher Modal (Cmd + K) */}
      <QuickLauncherModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAction={handleQuickAction}
      />

      {/* Vercel Analytics */}
      <Analytics />

    </div>
  );
};

export default App;
