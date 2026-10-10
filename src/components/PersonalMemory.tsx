import React, { useState, useEffect } from 'react';
import { Brain, Plus, Trash2, Sparkles } from 'lucide-react';
import { loadMemories, saveMemories } from '../utils/storage';
import type { MemoryItem } from '../utils/storage';

export const PersonalMemory: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>(loadMemories());
  const [newFact, setNewFact] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('Preference');

  useEffect(() => {
    saveMemories(memories);
  }, [memories]);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;

    const item: MemoryItem = {
      id: Date.now().toString(),
      category: newCategory,
      fact: newFact,
      createdAt: new Date().toLocaleDateString()
    };

    setMemories(prev => [item, ...prev]);
    setNewFact('');
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={18} className="text-cyan-glow" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Personal Memory Bank</h3>
        </div>
        <span className="badge-cyan font-mono" style={{ fontSize: '0.65rem' }}>
          <Sparkles size={10} /> AGI RECALL SYNCHRONIZED
        </span>
      </div>

      {/* Add Memory Form */}
      <form onSubmit={handleAddMemory} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <input 
          type="text" 
          placeholder="Share a detail for AGI to remember (e.g. 'I prefer 45-min focus blocks')"
          value={newFact}
          onChange={(e) => setNewFact(e.target.value)}
          className="agi-input"
          style={{ fontSize: '0.85rem' }}
        />
        <select 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="agi-input font-mono"
          style={{ width: '130px', fontSize: '0.75rem' }}
        >
          <option value="Preference">Preference</option>
          <option value="Goal">Goal</option>
          <option value="Tech Stack">Tech Stack</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>
        <button type="submit" className="btn-primary" style={{ padding: '0 12px', fontSize: '0.8rem' }}>
          <Plus size={16} /> Remember
        </button>
      </form>

      {/* Memory List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
        {memories.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
            No personal memories stored yet. Share details to personalize AGI responses!
          </div>
        ) : (
          memories.map(mem => (
            <div 
              key={mem.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span className="badge-purple font-mono" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                    {mem.category}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }} className="font-mono">
                    Added {mem.createdAt}
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  "{mem.fact}"
                </div>
              </div>

              <button 
                onClick={() => handleDeleteMemory(mem.id)}
                className="btn-icon"
                style={{ width: '26px', height: '26px', border: 'none' }}
                title="Forget Memory"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
