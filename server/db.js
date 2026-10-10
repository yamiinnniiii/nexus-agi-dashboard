import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DEFAULT_DB = {
  chat_history: [
    {
      id: 'msg-1',
      sender: 'orchestrator',
      agent: 'ChatAgent',
      text: "Hello! I'm your AI companion. I'm here to chat naturally about anything you'd like, answer questions, help you code, or assist with your projects, notes, and tasks whenever you ask me to.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  memories: [
    {
      id: 'm1',
      category: 'Preference',
      fact: 'Prefers deep work sprints and clean TypeScript / React code.',
      createdAt: new Date().toLocaleDateString()
    }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Nexus AGI Personal OS',
      description: 'Full-stack AI command center with persistent backend & specialized sub-agents.',
      status: 'In Progress',
      progress: 90,
      targetDate: 'Oct 2026',
      tags: ['React', 'Express', 'AGI']
    }
  ],
  notes: [
    {
      id: 'n1',
      title: 'System Architecture & Agent Routing',
      content: 'Multi-agent orchestration architecture: ChatAgent handles general conversation & multi-turn memory; specialized agents manage domain modules only when requested.',
      updatedAt: 'Today',
      pinned: true,
      tags: ['Architecture']
    }
  ],
  tasks: [
    {
      id: 't1',
      title: 'Deploy Express Backend & Database Persistence Layer',
      category: 'AGI',
      priority: 'P0 - Critical',
      estimatedMins: 20,
      completed: true,
      agiWeight: 98
    }
  ]
};

export class Database {
  static load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }

  static save(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error writing to db.json:", err);
    }
  }

  static getChatHistory() {
    return this.load().chat_history;
  }

  static addChatMessage(msg) {
    const db = this.load();
    const fullMsg = {
      id: msg.id || Date.now().toString(),
      sender: msg.sender,
      agent: msg.agent || 'ChatAgent',
      text: msg.text,
      actionTaken: msg.actionTaken,
      timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: msg.isVoice || false
    };
    db.chat_history.push(fullMsg);
    this.save(db);
    return fullMsg;
  }

  static getMemories() {
    return this.load().memories;
  }

  static addMemory(fact, category = 'Preference') {
    const db = this.load();
    const mem = {
      id: Date.now().toString(),
      category,
      fact,
      createdAt: new Date().toLocaleDateString()
    };
    db.memories.unshift(mem);
    this.save(db);
    return mem;
  }

  static getProjects() {
    return this.load().projects;
  }

  static addProject(title, description = 'Created via ProjectAgent.', tags = ['General']) {
    const db = this.load();
    const proj = {
      id: Date.now().toString(),
      title,
      description,
      status: 'Active',
      progress: 10,
      targetDate: 'Nov 2026',
      tags
    };
    db.projects.unshift(proj);
    this.save(db);
    return proj;
  }

  static getNotes() {
    return this.load().notes;
  }

  static addNote(title, content = 'Created via NotepadAgent.') {
    const db = this.load();
    const note = {
      id: Date.now().toString(),
      title,
      content,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: false,
      tags: ['General']
    };
    db.notes.unshift(note);
    this.save(db);
    return note;
  }

  static getTasks() {
    return this.load().tasks;
  }

  static addTask(title, category = 'AGI') {
    const db = this.load();
    const task = {
      id: Date.now().toString(),
      title,
      category,
      priority: 'P1 - High',
      estimatedMins: 30,
      completed: false,
      agiWeight: 90
    };
    db.tasks.unshift(task);
    this.save(db);
    return task;
  }

  static getAllData() {
    return this.load();
  }
}
