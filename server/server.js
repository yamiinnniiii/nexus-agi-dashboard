import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './db.js';
import { routeUserQuery } from './agentRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Status
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', service: 'Nexus AGI Backend', timestamp: new Date() });
});

// Fetch full DB data for state hydration
app.get('/api/data', (req, res) => {
  res.json(Database.getAllData());
});

// Fetch chat history
app.get('/api/chat/history', (req, res) => {
  res.json(Database.getChatHistory());
});

// Multi-Turn Chat & Agent Routing Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { query, isVoice } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    // Save user message to persistent DB
    const userMsg = Database.addChatMessage({
      sender: 'user',
      text: query,
      isVoice: !!isVoice
    });

    // Get multi-turn history context for agent
    const history = Database.getChatHistory();

    // Route query to sub-agent (ChatAgent, ProjectAgent, NotepadAgent, TaskAgent, MemoryAgent)
    const agentResult = await routeUserQuery(query, history, !!isVoice);

    // Save orchestrator response to persistent DB
    const orchestratorMsg = Database.addChatMessage({
      sender: 'orchestrator',
      agent: agentResult.agent,
      text: agentResult.text,
      actionTaken: agentResult.actionTaken,
      isVoice: !!isVoice
    });

    res.json({
      userMessage: userMsg,
      orchestratorMessage: orchestratorMsg,
      data: Database.getAllData()
    });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
});

// Projects Endpoints
app.get('/api/projects', (req, res) => {
  res.json(Database.getProjects());
});
app.post('/api/projects', (req, res) => {
  const { title, description, tags } = req.body;
  const proj = Database.addProject(title, description, tags);
  res.json(proj);
});

// Notes Endpoints
app.get('/api/notes', (req, res) => {
  res.json(Database.getNotes());
});
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  const note = Database.addNote(title, content);
  res.json(note);
});

// Memories Endpoints
app.get('/api/memories', (req, res) => {
  res.json(Database.getMemories());
});
app.post('/api/memories', (req, res) => {
  const { fact, category } = req.body;
  const mem = Database.addMemory(fact, category);
  res.json(mem);
});

// Tasks Endpoints
app.get('/api/tasks', (req, res) => {
  res.json(Database.getTasks());
});
app.post('/api/tasks', (req, res) => {
  const { title, category } = req.body;
  const task = Database.addTask(title, category);
  res.json(task);
});

app.listen(PORT, () => {
  console.log(`🚀 Nexus AGI Backend Server running on http://localhost:${PORT}`);
});
