import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, Clock, Edit2, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadTasks, saveTasks, type TaskItem } from '../utils/storage';

export const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Form states for adding new task
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Code' | 'Research' | 'Life' | 'AGI'>('AGI');
  const [newPriority, setNewPriority] = useState<'P0 - Critical' | 'P1 - High' | 'P2 - Normal'>('P1 - High');
  const [newEstimatedMins, setNewEstimatedMins] = useState<number>(25);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TaskItem | null>(null);

  // Filters & Sorting
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'agiWeight' | 'priority' | 'mins'>('agiWeight');

  // Mark loaded on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-save to localStorage whenever tasks change after initial load
  useEffect(() => {
    if (isLoaded) {
      setSaveStatus('saving');
      saveTasks(tasks);
      const timer = setTimeout(() => setSaveStatus('saved'), 400);
      return () => clearTimeout(timer);
    }
  }, [tasks, isLoaded]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          confetti({
            particleCount: 45,
            spread: 65,
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
    if (editingId === id) {
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: 'task_' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      estimatedMins: Number(newEstimatedMins) || 20,
      completed: false,
      agiWeight: Math.floor(Math.random() * 25) + 75 // 75-99% AGI priority recommendation score
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
    setNewEstimatedMins(25);
  };

  const startEditing = (task: TaskItem) => {
    setEditingId(task.id);
    setEditForm({ ...task });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEditing = () => {
    if (!editForm || !editForm.title.trim()) return;
    setTasks(prev => prev.map(t => t.id === editForm.id ? editForm : t));
    setEditingId(null);
    setEditForm(null);
  };

  // Filtered and sorted tasks
  const filteredTasks = tasks.filter(t => filterCategory === 'ALL' || t.category === filterCategory);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'agiWeight') {
      return b.agiWeight - a.agiWeight;
    } else if (sortBy === 'mins') {
      return a.estimatedMins - b.estimatedMins;
    } else {
      const priorityOrder = { 'P0 - Critical': 0, 'P1 - High': 1, 'P2 - Normal': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const totalMinsRemaining = tasks.filter(t => !t.completed).reduce((sum, t) => sum + (t.estimatedMins || 0), 0);

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Task Intelligence Board</h3>
            <span className="badge-cyan font-mono" style={{ fontSize: '0.65rem' }}>
              AGI PRIORITIZED
            </span>
            {/* Auto Save Status Indicator */}
            <span style={{ 
              fontSize: '0.65rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px',
              color: saveStatus === 'saved' ? 'var(--emerald)' : 'var(--amber)',
              background: 'rgba(255,255,255,0.03)',
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)'
            }} className="font-mono">
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: saveStatus === 'saved' ? 'var(--emerald)' : 'var(--amber)',
                boxShadow: saveStatus === 'saved' ? '0 0 6px var(--emerald)' : 'none'
              }} />
              {saveStatus === 'saved' ? 'Auto-Saved' : 'Saving...'}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {completedCount} of {tasks.length} tasks finished ({progressPercent}%) • {totalMinsRemaining} mins work remaining
          </p>
        </div>

        {/* Filters & Sorting */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {['ALL', 'AGI', 'Code', 'Research', 'Life'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="btn-secondary font-mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '3px 7px',
                  background: filterCategory === cat ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                  borderColor: filterCategory === cat ? 'var(--cyan)' : 'var(--border-subtle)',
                  color: filterCategory === cat ? 'var(--cyan)' : 'var(--text-muted)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="agi-input font-mono"
            style={{ fontSize: '0.68rem', padding: '3px 6px', width: 'auto' }}
          >
            <option value="agiWeight">Sort: AGI Weight</option>
            <option value="priority">Sort: Priority</option>
            <option value="mins">Sort: Est. Time</option>
          </select>
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
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="+ Add new objective..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="agi-input"
          style={{ flex: 1, minWidth: '180px', fontSize: '0.85rem', padding: '8px 12px' }}
        />
        <select 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="agi-input font-mono"
          style={{ width: '100px', fontSize: '0.75rem', padding: '8px 6px' }}
        >
          <option value="AGI">AGI</option>
          <option value="Code">Code</option>
          <option value="Research">Research</option>
          <option value="Life">Life</option>
        </select>
        <select 
          value={newPriority} 
          onChange={(e) => setNewPriority(e.target.value as any)}
          className="agi-input font-mono"
          style={{ width: '110px', fontSize: '0.75rem', padding: '8px 6px' }}
        >
          <option value="P0 - Critical">P0 - Critical</option>
          <option value="P1 - High">P1 - High</option>
          <option value="P2 - Normal">P2 - Normal</option>
        </select>
        <input 
          type="number"
          min="5"
          max="480"
          value={newEstimatedMins}
          onChange={(e) => setNewEstimatedMins(Number(e.target.value))}
          className="agi-input font-mono"
          style={{ width: '70px', fontSize: '0.75rem', padding: '8px 6px' }}
          title="Estimated minutes"
          placeholder="Mins"
        />
        <button type="submit" className="btn-primary" style={{ padding: '0 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Task Items List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
        {sortedTasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '30px 0' }}>
            No objectives found in this category.
          </div>
        ) : (
          sortedTasks.map(task => {
            const isEditing = editingId === task.id;

            if (isEditing && editForm) {
              // Editable Task Card Form
              return (
                <div 
                  key={task.id}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(0, 243, 255, 0.05)',
                    border: '1px solid var(--cyan)',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 0 12px rgba(0, 243, 255, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="agi-input"
                      style={{ flex: 1, fontSize: '0.85rem', padding: '6px 10px' }}
                      placeholder="Task objective..."
                      autoFocus
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cat:</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                      className="agi-input font-mono"
                      style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                    >
                      <option value="AGI">AGI</option>
                      <option value="Code">Code</option>
                      <option value="Research">Research</option>
                      <option value="Life">Life</option>
                    </select>

                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Priority:</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                      className="agi-input font-mono"
                      style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                    >
                      <option value="P0 - Critical">P0 - Critical</option>
                      <option value="P1 - High">P1 - High</option>
                      <option value="P2 - Normal">P2 - Normal</option>
                    </select>

                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Time(m):</label>
                    <input
                      type="number"
                      value={editForm.estimatedMins}
                      onChange={(e) => setEditForm({ ...editForm, estimatedMins: Number(e.target.value) })}
                      className="agi-input font-mono"
                      style={{ width: '65px', fontSize: '0.75rem', padding: '4px 6px' }}
                    />

                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AGI %:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editForm.agiWeight}
                      onChange={(e) => setEditForm({ ...editForm, agiWeight: Number(e.target.value) })}
                      className="agi-input font-mono"
                      style={{ width: '65px', fontSize: '0.75rem', padding: '4px 6px' }}
                    />

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                      <button 
                        type="button"
                        onClick={saveEditing}
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        <Check size={14} /> Save
                      </button>
                      <button 
                        type="button"
                        onClick={cancelEditing}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Normal Task Card Display
            return (
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
                  opacity: task.completed ? 0.65 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <button 
                    onClick={() => toggleTask(task.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--emerald)' : 'var(--text-muted)' }}
                    title={task.completed ? "Mark incomplete" : "Mark completed"}
                  >
                    {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                  
                  <div style={{ flex: 1 }}>
                    <div 
                      onClick={() => startEditing(task)}
                      title="Click to edit task"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {task.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                      <span className="badge-cyan font-mono" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                        {task.category}
                      </span>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button 
                    onClick={() => startEditing(task)}
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', border: 'none' }}
                    title="Edit Task"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', border: 'none' }}
                    title="Delete Objective"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
