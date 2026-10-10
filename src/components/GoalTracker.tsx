import React, { useState } from 'react';
import { Target } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'g1',
      title: 'AGI Research Hours',
      current: 18,
      target: 25,
      unit: 'hrs',
      color: '#00f3ff'
    },
    {
      id: 'g2',
      title: 'Deep Code Commits',
      current: 42,
      target: 50,
      unit: 'commits',
      color: '#a855f7'
    },
    {
      id: 'g3',
      title: 'Mindfulness & Meditation',
      current: 5,
      target: 7,
      unit: 'sessions',
      color: '#10b981'
    }
  ]);

  const incrementGoal = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, current: Math.min(g.target, g.current + 1) };
      }
      return g;
    }));
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} className="text-purple-glow" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Weekly Milestones</h3>
        </div>
        <span className="badge-purple font-mono" style={{ fontSize: '0.65rem' }}>
          TRACKER ACTIVE
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map(goal => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <div 
              key={goal.id}
              onClick={() => incrementGoal(goal.id)}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Click to increment goal progress (+1)"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{goal.title}</span>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: goal.color, fontWeight: 700 }}>
                  {goal.current} / {goal.target} {goal.unit} ({pct}%)
                </span>
              </div>

              {/* Liquid Progress Bar */}
              <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: goal.color,
                    boxShadow: `0 0 10px ${goal.color}`,
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
