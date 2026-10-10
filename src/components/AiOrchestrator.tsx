import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Cpu, FileText, Calendar, CheckCircle2, MessageSquare, Volume2, VolumeX, FolderKanban, Brain, Target } from 'lucide-react';

interface OrchestratorMessage {
  id: string;
  sender: 'user' | 'orchestrator';
  agent?: string;
  text: string;
  actionTaken?: string;
  timestamp: string;
  isVoice?: boolean;
}

const API_BASE = 'http://localhost:5001/api';

export const AiOrchestrator: React.FC = () => {
  const [messages, setMessages] = useState<OrchestratorMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSubAgent, setActiveSubAgent] = useState<string>('ChatAgent');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hydrate chat history & database on mount
  useEffect(() => {
    fetch(`${API_BASE}/chat/history`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
        }
      })
      .catch(() => {
        // Fallback default message if backend offline
        setMessages([
          {
            id: 'o1',
            sender: 'orchestrator',
            agent: 'ChatAgent',
            text: "Hello my friend! 😊 I'm your AI companion. I'm connected to your backend server database with specialized agents (ChatAgent, ProjectAgent, NotepadAgent, TaskAgent, MemoryAgent). How can I assist you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Clean text helper for SpeechSynthesis voice
  const cleanTextForSpeech = (rawText: string): string => {
    return rawText
      .replace(/```[\s\S]*?```/g, 'Here is the code block.')
      .replace(/[*#_`>]/g, '')
      .replace(/•/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  };

  const speakAsFriend = (textToSpeak: string) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const spokenText = cleanTextForSpeech(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(spokenText);

    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => 
      (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Guy') || v.name.includes('Zira')))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (friendlyVoice) utterance.voice = friendlyVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech Recognition API is not supported in this browser. Please use Chrome/Edge or type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      stopSpeaking();
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        processOrchestratorQuery(transcript, true);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const processOrchestratorQuery = async (queryText: string, isVoice: boolean = false) => {
    if (!queryText.trim()) return;

    const tempUserMsg: OrchestratorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, isVoice })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.orchestratorMessage) {
          setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), data.userMessage, data.orchestratorMessage]);
          if (data.orchestratorMessage.agent) {
            setActiveSubAgent(data.orchestratorMessage.agent);
          }
        }
      }
    } catch (err) {
      // Fallback offline message
      const fallbackMsg: OrchestratorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'orchestrator',
        agent: 'ChatAgent',
        text: `I'm glad to connect with you! I'm here to chat, answer questions, or help out whenever you need me. What's on your mind? 😊`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVoice
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAgentBadge = (agentName?: string) => {
    switch (agentName) {
      case 'ProjectAgent':
        return <span className="badge-purple font-mono" style={{ fontSize: '0.65rem' }}><FolderKanban size={11} /> ProjectAgent</span>;
      case 'NotepadAgent':
        return <span className="badge-cyan font-mono" style={{ fontSize: '0.65rem' }}><FileText size={11} /> NotepadAgent</span>;
      case 'TaskAgent':
        return <span className="badge-amber font-mono" style={{ fontSize: '0.65rem' }}><Target size={11} /> TaskAgent</span>;
      case 'MemoryAgent':
        return <span className="badge-emerald font-mono" style={{ fontSize: '0.65rem' }}><Brain size={11} /> MemoryAgent</span>;
      default:
        return <span className="badge-cyan font-mono" style={{ fontSize: '0.65rem' }}><Sparkles size={11} /> ChatAgent</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} className="text-cyan-glow" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI Orchestrator & Backend Multi-Agent System</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Active Agent Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ACTIVE ROUTE:</span>
            {getAgentBadge(activeSubAgent)}
          </div>

          {/* AI Voice Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setIsSpeechEnabled(!isSpeechEnabled);
            }}
            className={`btn-secondary ${isSpeechEnabled ? 'text-cyan-glow' : ''}`}
            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
            title={isSpeechEnabled ? "AI Voice Active (Speaks back)" : "AI Voice Muted"}
          >
            {isSpeechEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>{isSpeechEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>

          <button 
            onClick={() => processOrchestratorQuery("Summarize my dashboard", false)}
            className="btn-secondary font-mono"
            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
          >
            <FileText size={11} /> Summarize
          </button>
          <button 
            onClick={() => processOrchestratorQuery("Plan my day", false)}
            className="btn-secondary font-mono"
            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
          >
            <Calendar size={11} /> Plan Day
          </button>
        </div>
      </div>

      {/* Suggested Friendly Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px' }}>
        {[
          "What is Quantum Computing?",
          "Write Python Reverse String",
          "5 Productivity Tips",
          "Explain AGI"
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => processOrchestratorQuery(chip, false)}
            className="btn-secondary"
            style={{ fontSize: '0.72rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
          >
            <MessageSquare size={11} style={{ display: 'inline', marginRight: '4px' }} /> {chip}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px', minHeight: '220px' }}>
        {messages.map(msg => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '92%',
              background: msg.sender === 'user' ? 'rgba(0, 243, 255, 0.12)' : 'rgba(15, 23, 42, 0.85)',
              border: msg.sender === 'user' ? '1px solid rgba(0, 243, 255, 0.4)' : '1px solid var(--border-glow)',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.68rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: msg.sender === 'user' ? 'var(--cyan)' : 'var(--purple)', fontWeight: 600 }}>
                  {msg.sender === 'user' ? (msg.isVoice ? 'YOU (VOICE 🎤)' : 'YOU') : 'AI ORCHESTRATOR'}
                </span>
                {msg.sender === 'orchestrator' && getAgentBadge(msg.agent)}
              </div>
              <span style={{ color: 'var(--text-muted)' }}>{msg.timestamp}</span>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>

            {msg.sender === 'orchestrator' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                {msg.actionTaken ? (
                  <div style={{ fontSize: '0.7rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '4px' }} className="font-mono">
                    <CheckCircle2 size={12} /> {msg.actionTaken}
                  </div>
                ) : <div />}

                <button
                  onClick={() => speakAsFriend(msg.text)}
                  className="btn-secondary"
                  style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'transparent', border: 'none', color: 'var(--cyan)' }}
                  title="Speak message out loud"
                >
                  <Volume2 size={12} style={{ display: 'inline', marginRight: '2px' }} /> Speak
                </button>
              </div>
            )}
          </div>
        ))}

        {isSpeaking && (
          <div style={{ fontSize: '0.75rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '6px' }} className="font-mono animate-pulse">
            <Volume2 size={14} className="animate-bounce" /> AI Friend is speaking to you...
            <button onClick={stopSpeaking} style={{ fontSize: '0.68rem', color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Stop
            </button>
          </div>
        )}

        {isProcessing && (
          <div style={{ fontSize: '0.75rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '6px' }} className="font-mono animate-pulse">
            <Cpu size={14} className="animate-spin" /> Routing sub-agent & querying database...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Voice Controls */}
      <form onSubmit={(e) => { e.preventDefault(); processOrchestratorQuery(inputQuery, false); }} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button 
          type="button"
          onClick={toggleVoiceInput}
          className={`btn-icon ${isListening ? 'btn-primary text-rose' : ''}`}
          style={{ width: '42px', height: '42px', flexShrink: 0, borderColor: isListening ? 'var(--rose)' : undefined }}
          title={isListening ? "Listening... Speak your question to your AI Friend" : "Click to speak voice command"}
        >
          {isListening ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
        </button>

        <input 
          type="text" 
          placeholder="Talk to your AI Friend or type command... (e.g. 'Hey friend, how are you?')"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="agi-input"
          style={{ fontSize: '0.85rem' }}
        />

        <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
          <Send size={16} />
        </button>
      </form>

    </div>
  );
};
