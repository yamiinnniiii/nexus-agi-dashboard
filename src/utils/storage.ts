export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  pinned?: boolean;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'In Progress' | 'Archived' | 'Planning';
  progress: number; // 0-100
  targetDate: string;
  tags: string[];
}

export interface MemoryItem {
  id: string;
  category: 'Preference' | 'Goal' | 'Tech Stack' | 'Lifestyle';
  fact: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'Code' | 'Research' | 'Life' | 'AGI';
  priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Normal';
  estimatedMins: number;
  completed: boolean;
  agiWeight: number; // 1-100 AGI recommendation score
}

const STORAGE_KEYS = {
  NOTES: 'nexus_agi_notes',
  PROJECTS: 'nexus_agi_projects',
  MEMORIES: 'nexus_agi_memories',
  TASKS: 'nexus_agi_tasks',
};

export const DEFAULT_TASKS: TaskItem[] = [
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
];

// Initial Seed Data
const DEFAULT_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'AGI System Architecture & Memory Retrieval',
    content: 'Key idea: Combine vector embeddings with explicit user memory facts stored in key-value pairs for zero-hallucination recall.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pinned: true,
    tags: ['Architecture', 'AGI']
  },
  {
    id: 'n2',
    title: 'Daily High-Energy Protocol',
    content: '1. Hydrate 500ml upon waking\n2. 25-min Deep Work Sprint before opening email\n3. Take 15-min walk at 1 PM',
    updatedAt: 'Yesterday',
    pinned: false,
    tags: ['Life', 'Focus']
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Nexus AGI Personal OS',
    description: 'Autonomous personal command center with natural language orchestration and voice interaction.',
    status: 'In Progress',
    progress: 85,
    targetDate: 'Oct 2026',
    tags: ['React', 'TypeScript', 'AGI']
  },
  {
    id: 'p2',
    title: 'Quantum Neural Compiler',
    description: 'Optimizing low-bit LLM quantization algorithms for edge deployment.',
    status: 'Active',
    progress: 45,
    targetDate: 'Nov 2026',
    tags: ['Quantum', 'AI', 'C++']
  },
  {
    id: 'p3',
    title: 'Autonomous Data Engine',
    description: 'Self-cleaning ETL pipelines built with BigQuery and Apache Beam.',
    status: 'Planning',
    progress: 15,
    targetDate: 'Dec 2026',
    tags: ['Data', 'GCP']
  }
];

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'm1',
    category: 'Preference',
    fact: 'Prefers 25-minute deep focus sprints (Pomodoro) and alpha wave ambient sound.',
    createdAt: '2026-10-01'
  },
  {
    id: 'm2',
    category: 'Tech Stack',
    fact: 'Primary tech stack is TypeScript, React, Python, and Google Cloud BigQuery.',
    createdAt: '2026-10-05'
  },
  {
    id: 'm3',
    category: 'Goal',
    fact: 'Targeting 25 hours of dedicated AGI research per week.',
    createdAt: '2026-10-08'
  }
];

export const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : DEFAULT_NOTES;
  } catch {
    return DEFAULT_NOTES;
  }
};

export const saveNotes = (notes: Note[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch {
    // ignore
  }
};

export const loadProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
};

export const saveProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch {
    // ignore
  }
};

export const loadMemories = (): MemoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    return data ? JSON.parse(data) : DEFAULT_MEMORIES;
  } catch {
    return DEFAULT_MEMORIES;
  }
};

export const saveMemories = (memories: MemoryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  } catch {
    // ignore
  }
};

export const loadTasks = (): TaskItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
};

export const saveTasks = (tasks: TaskItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch {
    // ignore
  }
};
