import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Brain, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agi';
  text: string;
  thoughtProcess?: string[];
  timestamp: string;
  actionItems?: string[];
}

export const AgiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agi',
      text: "Greetings, Commander. I have analyzed your calendar, biometrics, and task queue for today. You have 4 high-priority objectives and an optimal Deep Work window between 10:30 AM and 01:00 PM.",
      thoughtProcess: [
        "Ingesting biometric telemetry (Focus Score: 88%)",
        "Cross-referencing high-impact milestones",
        "Synthesizing optimal focus schedule..."
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionItems: [
        "Draft AGI Architecture Spec",
        "Review Product Roadmap",
        "Take a 15-min Cognitive Recovery Break at 1:00 PM"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const runAgiQuery = (prompt: string, presetType?: string) => {
    if (!prompt.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    setThinkingStep(0);

    // Simulate AGI multi-step reasoning
    setTimeout(() => setThinkingStep(1), 600);
    setTimeout(() => setThinkingStep(2), 1400);

    setTimeout(() => {
      let agiResponseText = "";
      let thoughts: string[] = [];
      let items: string[] = [];

      if (presetType === 'brief') {
        thoughts = [
          "Parsing global weather, local schedule & energy metrics",
          "Evaluating high-yielding task paths",
          "Formulating strategy for peak performance"
        ];
        agiResponseText = "Here is your Morning Executive Brief:\n• High Focus State: Your cognitive clarity is at 92%.\n• Recommended Priority: Complete the 'AGI Personal Dashboard' deployment during the morning burst.\n• Alert: Schedule 20 mins for physical movement before 3 PM.";
        items = ["Focus on Dashboard Core", "Hydrate (500ml water)", "Set 45min Timer"];
      } else if (presetType === 'prioritize') {
        thoughts = [
          "Calculating urgency vs impact matrix",
          "Applying Pareto 80/20 optimization engine",
          "Re-ordering task queue"
        ];
        agiResponseText = "Task Queue Re-prioritized by AGI:\n1. [P0] Deploy Personal Dashboard to Local Dev Server\n2. [P1] Refactor Audio Synth Engine\n3. [P2] Prepare Weekly Retrospective";
        items = ["Execute Task #1", "Delegate Task #3 to Background AI"];
      } else if (presetType === 'energy') {
        thoughts = [
          "Evaluating Circadian Rhythm curve",
          "Screen time vs focus fatigue balance",
          "Generating energy restoration protocol"
        ];
        agiResponseText = "Cognitive Load Analysis:\n• Current Mental Load: Moderate (42%)\n• Recommended Action: Listen to Alpha Wave soundscape while coding to maintain flow state.";
      } else {
        thoughts = [
          "Parsing natural language prompt",
          "Querying internal knowledge graph",
          "Optimizing response clarity"
        ];
        agiResponseText = `I have processed your directive: "${prompt}". All relevant metrics have been synchronized. Shall I execute automated actions for this task?`;
      }

      const agiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agi',
        text: agiResponseText,
        thoughtProcess: thoughts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionItems: items.length > 0 ? items : undefined
      };

      setMessages(prev => [...prev, agiMsg]);
      setIsThinking(false);
    }, 2200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    runAgiQuery(inputText);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '480px', padding: '18px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(0, 243, 255, 0.15)',
            border: '1px solid var(--cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={18} className="text-cyan-glow" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AGI Copilot</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Autonomous Reasoning Engine</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge-purple">
            <Brain size={12} /> Deep Thought
          </span>
        </div>
      </div>

      {/* Quick Action Presets */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '8px' }}>
        <button 
          onClick={() => runAgiQuery('Generate Morning Briefing', 'brief')}
          className="btn-secondary" 
          style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
        >
          ⚡ Morning Brief
        </button>
        <button 
          onClick={() => runAgiQuery('Prioritize Task Queue', 'prioritize')}
          className="btn-secondary" 
          style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
        >
          🎯 Prioritize Queue
        </button>
        <button 
          onClick={() => runAgiQuery('Calculate Cognitive Load', 'energy')}
          className="btn-secondary" 
          style={{ fontSize: '0.75rem', padding: '5px 10px', whiteSpace: 'nowrap' }}
        >
          🧠 Energy Check
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: msg.sender === 'user' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.8)',
              border: msg.sender === 'user' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(0, 243, 255, 0.2)',
              borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              padding: '12px 16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Sender header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.7rem' }}>
              <span style={{ color: msg.sender === 'user' ? 'var(--purple)' : 'var(--cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {msg.sender === 'user' ? 'YOU' : <><Sparkles size={12} /> AGI CORE</>}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
            </div>

            {/* AGI Thought Chain */}
            {msg.thoughtProcess && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '6px',
                padding: '6px 10px',
                marginBottom: '8px',
                borderLeft: '2px solid var(--cyan)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cyan)', marginBottom: '3px' }}>
                  <Terminal size={12} />
                  <span className="font-mono">THOUGHT_CHAIN:</span>
                </div>
                {msg.thoughtProcess.map((tp, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '2px 0' }}>
                    <span style={{ color: 'var(--text-muted)' }}>›</span>
                    <span>{tp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Message Body */}
            <div style={{ fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>

            {/* Action Items */}
            {msg.actionItems && msg.actionItems.length > 0 && (
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  SUGGESTED ACTIONS:
                </span>
                {msg.actionItems.map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--emerald)' }} />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div style={{
            alignSelf: 'flex-start',
            background: 'rgba(0, 243, 255, 0.08)',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <RefreshCw size={16} className="animate-spin text-cyan-glow" />
            <div style={{ fontSize: '0.78rem' }} className="font-mono text-cyan-glow">
              {thinkingStep === 0 && "AGI: Neural weights initializing..."}
              {thinkingStep === 1 && "AGI: Simulating probability vectors..."}
              {thinkingStep === 2 && "AGI: Formatting output synthesis..."}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Command AGI or ask anything... (e.g. 'Optimize my morning plan')"
          className="agi-input"
          disabled={isThinking}
        />
        <button 
          type="submit" 
          disabled={isThinking || !inputText.trim()}
          className="btn-primary" 
          style={{ padding: '0 16px' }}
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
};
