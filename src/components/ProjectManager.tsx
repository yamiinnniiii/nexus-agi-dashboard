import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, Archive, Trash2, Edit3 } from 'lucide-react';
import { loadProjects, saveProjects } from '../utils/storage';
import type { Project } from '../utils/storage';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(loadProjects());
  const [activeTab, setActiveTab] = useState<string>('ALL');
  
  // New Project Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState<Project['status']>('Active');
  const [formProgress, setFormProgress] = useState(25);
  const [formTargetDate, setFormTargetDate] = useState('Nov 2026');
  const [formTags, setFormTags] = useState('AGI, React');

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const openCreateModal = () => {
    setEditingProjectId(null);
    setFormTitle('');
    setFormDesc('');
    setFormStatus('Active');
    setFormProgress(25);
    setFormTargetDate('Nov 2026');
    setFormTags('AGI, React');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProjectId(proj.id);
    setFormTitle(proj.title);
    setFormDesc(proj.description);
    setFormStatus(proj.status);
    setFormProgress(proj.progress);
    setFormTargetDate(proj.targetDate);
    setFormTags(proj.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProjectId) {
      setProjects(prev => prev.map(p => {
        if (p.id === editingProjectId) {
          return {
            ...p,
            title: formTitle,
            description: formDesc,
            status: formStatus,
            progress: formProgress,
            targetDate: formTargetDate,
            tags: parsedTags
          };
        }
        return p;
      }));
    } else {
      const newProj: Project = {
        id: Date.now().toString(),
        title: formTitle,
        description: formDesc,
        status: formStatus,
        progress: formProgress,
        targetDate: formTargetDate,
        tags: parsedTags
      };
      setProjects(prev => [newProj, ...prev]);
    }

    setIsModalOpen(false);
  };

  const toggleArchive = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus: Project['status'] = p.status === 'Archived' ? 'Active' : 'Archived';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'ALL') return p.status !== 'Archived';
    if (activeTab === 'ARCHIVED') return p.status === 'Archived';
    return p.status.toUpperCase() === activeTab;
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderKanban size={18} className="text-purple-glow" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Project Portfolio</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'ACTIVE', 'PLANNING', 'ARCHIVED'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="btn-secondary font-mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '3px 8px',
                  background: activeTab === tab ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  borderColor: activeTab === tab ? 'var(--purple)' : 'var(--border-subtle)',
                  color: activeTab === tab ? 'var(--purple)' : 'var(--text-muted)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button onClick={openCreateModal} className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', paddingRight: '4px' }}>
        {filteredProjects.map(proj => (
          <div 
            key={proj.id}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              maxHeight: '180px',
              overflow: 'hidden'
            }}
          >
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className={`badge-${proj.status === 'Active' ? 'cyan' : proj.status === 'In Progress' ? 'purple' : proj.status === 'Planning' ? 'amber' : 'emerald'}`} style={{ fontSize: '0.65rem' }}>
                  {proj.status.toUpperCase()}
                </span>
                
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => openEditModal(proj)} className="btn-icon" style={{ width: '24px', height: '24px' }} title="Edit Project">
                    <Edit3 size={11} />
                  </button>
                  <button onClick={() => toggleArchive(proj.id)} className="btn-icon" style={{ width: '24px', height: '24px' }} title={proj.status === 'Archived' ? 'Unarchive' : 'Archive'}>
                    <Archive size={11} />
                  </button>
                  <button onClick={() => handleDeleteProject(proj.id)} className="btn-icon" style={{ width: '24px', height: '24px', color: 'var(--rose)' }} title="Delete">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '4px' }}>
                {proj.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '8px', flex: 1, minHeight: 0, overflowY: 'auto', wordBreak: 'break-word' }}>
                {proj.description}
              </p>
            </div>

            <div>
              {/* Progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }} className="font-mono">
                <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                <span style={{ color: 'var(--cyan)' }}>{proj.progress}%</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ height: '100%', width: `${proj.progress}%`, background: 'var(--cyan)' }} />
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {proj.tags.map((t, idx) => (
                  <span key={idx} className="font-mono" style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 7, 12, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <form 
            onSubmit={handleSaveProject}
            className="glass-panel-glow"
            style={{ width: '90%', maxWidth: '480px', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {editingProjectId ? 'Edit Project' : 'Create New Project'}
            </h3>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Title</label>
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required className="agi-input" />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} className="agi-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status</label>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)} className="agi-input">
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planning">Planning</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Progress ({formProgress}%)</label>
                <input type="range" min={0} max={100} value={formProgress} onChange={(e) => setFormProgress(Number(e.target.value))} style={{ width: '100%', marginTop: '8px' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tags (comma-separated)</label>
              <input type="text" value={formTags} onChange={(e) => setFormTags(e.target.value)} className="agi-input" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Project</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
