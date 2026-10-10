import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface TaskItem {
  id: string;
  title: string;
  category: 'Code' | 'Research' | 'Life' | 'AGI';
  priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Normal';
  estimatedMins: number;
  completed: boolean;
  agiWeight: number; // 1-100 AGI recommendation score
}

export const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: '1',
      title: 'Deploy Personal AGI Dashboard to Local Server',
      category: 'AGI',
      priority: 'P0 - Critical',
      estimatedMins: 25,
      completed: false,
      agiWeight: 98
    },
    {
      id: '2',
      title: 'Refactor Neural Audio Synthesizer (Alpha & Rain)',
      category: 'Code',
      priority: 'P1 - High',
      estimatedMins: 40,
      completed: false,
      agiWeight: 85
    },
    {
      id: '3',
      title: 'Synthesize Weekly AI Research & LLM Benchmarks',
      category: 'Research',
      priority: 'P1 - High',
      estimatedMins: 30,
      completed: true,
      agiWeight: 72
    },
    {
      id: '4',
      title: 'Cognitive Recovery: 15-min Meditative Walk',
      category: 'Life',
      priority: 'P2 - Normal',
      estimatedMins: 15,
      completed: false,
      agiWeight: 65
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Code' | 'Research' | 'Life' | 'AGI'>('AGI');
  const [newPriority] = useState<'P0 - Critical' | 'P1 - High' | 'P2 - Normal'>('P1 - High');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          // Trigger celebratory confetti effect
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      estimatedMins: 30,
      completed: false,
      agiWeight: Math.floor(Math.random() * 30) + 70 // Random AGI weight between 70-99
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
  };

  const filteredTasks = tasks.filter(t => filterCategory === 'ALL' || t.category === filterCategory);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Task Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Task Intelligence Board</h3>
            <span className="badge-cyan font-mono" style={{ fontSize: '0.65rem' }}>
              AGI PRIORITIZED
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {completedCount} of {tasks.length} tasks finished ({progressPercent}%)
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {['ALL', 'AGI', 'Code', 'Research', 'Life'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="btn-secondary font-mono"
              style={{
                fontSize: '0.7rem',
                padding: '4px 8px',
                background: filterCategory === cat ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                borderColor: filterCategory === cat ? 'var(--cyan)' : 'var(--border-subtle)',
                color: filterCategory === cat ? 'var(--cyan)' : 'var(--text-muted)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: 'linear-gradient(90deg, var(--cyan) 0%, var(--purple) 100%)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 10px var(--cyan)'
          }}
        />
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <input 
          type="text" 
          placeholder="+ Add new objective..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="agi-input"
          style={{ fontSize: '0.85rem', padding: '8px 12px' }}
        />
        <select 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="agi-input font-mono"
          style={{ width: '110px', fontSize: '0.75rem', padding: '8px 6px' }}
        >
          <option value="AGI">AGI</option>
          <option value="Code">Code</option>
          <option value="Research">Research</option>
          <option value="Life">Life</option>
        </select>
        <button type="submit" className="btn-primary" style={{ padding: '0 12px', fontSize: '0.8rem' }}>
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Task Items List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
            No objectives found in this category.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: task.completed ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)',
                border: task.completed ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid var(--border-subtle)',
                borderRadius: '10px',
                opacity: task.completed ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <button 
                  onClick={() => toggleTask(task.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--emerald)' : 'var(--text-muted)' }}
                >
                  {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                  }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <Clock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                      {task.estimatedMins}m
                    </span>
                    <span className={`badge-${task.priority.startsWith('P0') ? 'amber' : 'purple'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                      {task.priority}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--cyan)' }} className="font-mono">
                      AGI Weight: {task.agiWeight}%
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="btn-icon"
                style={{ width: '28px', height: '28px', border: 'none' }}
                title="Delete Objective"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
