import React, { useState } from 'react';
import { Rss, Bookmark } from 'lucide-react';

interface FeedItem {
  id: string;
  title: string;
  source: string;
  category: 'AI & ML' | 'Tech' | 'Strategy';
  tldr: string;
  timestamp: string;
  impact: 'HIGH' | 'MEDIUM' | 'TRENDING';
  bookmarked?: boolean;
}

export const AgiIntelligenceFeed: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 'f1',
      title: 'Multimodal Reasoning Models Achieve Breakthrough in Autonomous Coding',
      source: 'AI Research Daily',
      category: 'AI & ML',
      tldr: 'New benchmark shows 45% reduction in hallucination rates during complex full-stack codebase refactoring.',
      timestamp: '15m ago',
      impact: 'HIGH'
    },
    {
      id: 'f2',
      title: 'Quantum-Inspired Optimization Algorithms for Local Neural Synthesis',
      source: 'DeepTech Quarterly',
      category: 'Tech',
      tldr: 'On-device neural inference efficiency improved by 3.2x without loss in precision.',
      timestamp: '1h ago',
      impact: 'TRENDING'
    },
    {
      id: 'f3',
      title: 'Circadian Flow State Optimization Protocols for Knowledge Workers',
      source: 'NeuroPerformance Tech',
      category: 'Strategy',
      tldr: 'Structuring deep work around 90-minute ultradian cycles increases daily throughput by 34%.',
      timestamp: '3h ago',
      impact: 'MEDIUM'
    }
  ]);

  const [activeTab, setActiveTab] = useState<string>('ALL');

  const toggleBookmark = (id: string) => {
    setFeedItems(prev => prev.map(item => item.id === id ? { ...item, bookmarked: !item.bookmarked } : item));
  };

  const filtered = feedItems.filter(item => activeTab === 'ALL' || item.category === activeTab);

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rss size={18} className="text-cyan-glow" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AGI Intelligence Feed</h3>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {['ALL', 'AI & ML', 'Tech', 'Strategy'].map(tab => (
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
      </div>

      {/* Feed List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
        {filtered.map(item => (
          <div 
            key={item.id}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '12px 14px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`badge-${item.impact === 'HIGH' ? 'amber' : item.impact === 'TRENDING' ? 'cyan' : 'purple'}`} style={{ fontSize: '0.65rem' }}>
                  {item.impact === 'HIGH' ? '⚡ HIGH IMPACT' : item.impact === 'TRENDING' ? '🚀 TRENDING' : '💡 STRATEGY'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }} className="font-mono">
                  {item.source} • {item.timestamp}
                </span>
              </div>

              <button 
                onClick={() => toggleBookmark(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.bookmarked ? 'var(--cyan)' : 'var(--text-muted)' }}
                title="Bookmark article"
              >
                <Bookmark size={14} />
              </button>
            </div>

            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {item.title}
            </h4>

            {/* AGI TLDR */}
            <div style={{
              background: 'rgba(0, 243, 255, 0.04)',
              borderLeft: '2px solid var(--cyan)',
              padding: '6px 10px',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginTop: '6px'
            }}>
              <span className="font-mono text-cyan-glow" style={{ fontSize: '0.68rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                AGI SYNTHESIS:
              </span>
              {item.tldr}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
