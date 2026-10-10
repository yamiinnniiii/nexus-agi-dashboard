import React, { useState, useEffect } from 'react';
import { FileText, Plus, Pin, Trash2, Save, Search } from 'lucide-react';
import { loadNotes, saveNotes } from '../utils/storage';
import type { Note } from '../utils/storage';

export const Notepad: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(loadNotes());
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: false,
      tags: ['General']
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateActiveNote = (field: 'title' | 'content' | 'tags', value: any) => {
    if (!activeNote) return;
    setNotes(prev => prev.map(n => {
      if (n.id === activeNote.id) {
        return {
          ...n,
          [field]: value,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return n;
    }));

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 1200);
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const handleDeleteNote = (id: string) => {
    const nextNotes = notes.filter(n => n.id !== id);
    setNotes(nextNotes);
    if (activeNoteId === id && nextNotes.length > 0) {
      setActiveNoteId(nextNotes[0].id);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="glass-panel" style={{ padding: '16px', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} className="text-cyan-glow" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Notepad & Scratchpad</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isSavedNotice && (
            <span style={{ fontSize: '0.7rem', color: 'var(--emerald)' }} className="font-mono">
              <Save size={10} style={{ display: 'inline', marginRight: '3px' }} /> Auto-Saved
            </span>
          )}
          <button onClick={handleCreateNote} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            <Plus size={14} /> New Note
          </button>
        </div>
      </div>

      {/* Main 2-column Notepad Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* Left List of Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid var(--border-subtle)', paddingRight: '10px', height: '100%', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ position: 'relative', marginBottom: '4px', flexShrink: 0 }}>
            <Search size={12} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="agi-input"
              style={{ fontSize: '0.75rem', padding: '6px 6px 6px 26px' }}
            />
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '2px' }}>
            {filteredNotes.map(n => (
              <div 
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: n.id === activeNote?.id ? 'rgba(0, 243, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: n.id === activeNote?.id ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: n.id === activeNote?.id ? 'var(--cyan)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {n.title || 'Untitled'}
                  </span>
                  {n.pinned && <Pin size={10} style={{ color: 'var(--amber)' }} />}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }} className="font-mono">
                  {n.updatedAt}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Note Editor */}
        {activeNote ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', minHeight: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
              <input 
                type="text" 
                value={activeNote.title}
                onChange={(e) => handleUpdateActiveNote('title', e.target.value)}
                placeholder="Note Title..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  width: '100%'
                }}
              />
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => togglePin(activeNote.id)} 
                  className="btn-icon" 
                  style={{ width: '28px', height: '28px', color: activeNote.pinned ? 'var(--amber)' : 'var(--text-muted)' }}
                  title="Pin Note"
                >
                  <Pin size={13} />
                </button>
                <button 
                  onClick={() => handleDeleteNote(activeNote.id)} 
                  className="btn-icon" 
                  style={{ width: '28px', height: '28px', color: 'var(--rose)' }}
                  title="Delete Note"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Note Content Textarea */}
            <textarea 
              value={activeNote.content}
              onChange={(e) => handleUpdateActiveNote('content', e.target.value)}
              placeholder="Write your scratchpad thoughts, code snippets, or ideas..."
              className="agi-input font-mono"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                resize: 'none',
                lineHeight: '1.6',
                fontSize: '0.85rem'
              }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Select or create a note to begin.
          </div>
        )}

      </div>

    </div>
  );
};
