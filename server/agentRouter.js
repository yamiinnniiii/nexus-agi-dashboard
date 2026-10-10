import { Database } from './db.js';

export async function routeUserQuery(query, history = [], isVoice = false) {
  const lower = query.toLowerCase().trim();
  const memories = Database.getMemories();
  const projects = Database.getProjects();
  const notes = Database.getNotes();

  // 1. Explicit Memory Intent -> MemoryAgent (Only on explicit request)
  if (lower.startsWith('remember ') || lower.startsWith('store fact ') || lower.startsWith('save memory ')) {
    const factContent = query.replace(/remember|store fact|save memory/gi, '').trim() || query;
    const mem = Database.addMemory(factContent);
    return {
      agent: 'MemoryAgent',
      text: `I've saved that in your memories: "${mem.fact}".`,
      actionTaken: 'Saved Memory'
    };
  }

  // 2. Explicit Project Intent -> ProjectAgent (Only on explicit request)
  if (lower.startsWith('create project') || lower.startsWith('add project')) {
    const projTitle = query.replace(/create project|add project/gi, '').trim() || 'New Project';
    const proj = Database.addProject(projTitle);
    return {
      agent: 'ProjectAgent',
      text: `I've created the project **${proj.title}** for you!`,
      actionTaken: `Created Project: ${proj.title}`
    };
  }

  // 3. Explicit Note Intent -> NotepadAgent (Only on explicit request)
  if (lower.startsWith('create note') || lower.startsWith('add note') || lower.startsWith('write note')) {
    const noteTitle = query.replace(/create note|add note|write note/gi, '').trim() || 'Quick Note';
    const note = Database.addNote(noteTitle);
    return {
      agent: 'NotepadAgent',
      text: `I've created your note **"${note.title}"** in your Scratchpad.`,
      actionTaken: `Saved Note: ${note.title}`
    };
  }

  // 4. Explicit Task Intent -> TaskAgent (Only on explicit request)
  if (lower.startsWith('create task') || lower.startsWith('add task')) {
    const taskTitle = query.replace(/create task|add task/gi, '').trim() || 'New Task';
    const task = Database.addTask(taskTitle);
    return {
      agent: 'TaskAgent',
      text: `I've added **"${task.title}"** to your Task Board.`,
      actionTaken: `Added Task: ${task.title}`
    };
  }

  // 5. Dashboard Overview / Day Plan (Only when requested)
  if (lower.includes('summarize my dashboard') || lower.includes('dashboard summary')) {
    const activeProjs = projects.filter(p => p.status !== 'Archived');
    return {
      agent: 'ChatAgent',
      text: `Here's a quick summary of your dashboard:\n\n• **Active Projects (${activeProjs.length})**: Top priority is *${activeProjs[0]?.title || 'Nexus AGI'}* (${activeProjs[0]?.progress || 85}% complete).\n• **Notes (${notes.length})**: Latest note is *${notes[0]?.title || 'Architecture Notes'}*.\n• **Saved Memories**: ${memories.length} preferences stored.\n• **Cognitive Status**: 88% Focus Index (Flow Window Active).`,
      actionTaken: 'Dashboard Summary'
    };
  }

  if (lower.includes('plan my day') || lower.includes('schedule today')) {
    return {
      agent: 'ChatAgent',
      text: `Here's your schedule for today:\n\n• **10:30 AM – 12:30 PM**: Deep work focus on *${projects[0]?.title || 'AGI Project'}*.\n• **12:30 PM – 01:00 PM**: Tasks & notes review.\n• **01:00 PM – 01:30 PM**: Lunch break & hydration.\n• **02:00 PM – 04:00 PM**: Development & review.`,
      actionTaken: 'Day Plan'
    };
  }

  // 6. Conversational ChatAgent (Natural ChatGPT-style responses without robotic metadata)

  // Casual Conversations & Greetings
  if (lower.includes("doing good") || lower.includes("doing well") || lower.includes("doing great") || lower.includes("how are you")) {
    if (lower.includes("what about you") || lower.includes("how about you") || lower.includes("and you")) {
      return {
        agent: 'ChatAgent',
        text: "I'm glad to hear that! I'm doing well too 😊 What have you been up to?"
      };
    }
    return {
      agent: 'ChatAgent',
      text: "I'm doing great, thank you for asking! 😊 How is your day going so far?"
    };
  }

  if (lower === 'hi' || lower === 'hello' || lower === 'hey') {
    return {
      agent: 'ChatAgent',
      text: "Hey! 😊 How are you doing today? What's on your mind?"
    };
  }

  if (lower.includes("thank you") || lower.includes("thanks")) {
    return {
      agent: 'ChatAgent',
      text: "You're very welcome! I'm always happy to help. Let me know if you need anything else 😊"
    };
  }

  // Coding & Technical Queries
  if (lower.includes('python') || lower.includes('javascript') || lower.includes('typescript') || lower.includes('code') || lower.includes('function')) {
    if (lower.includes('reverse') && lower.includes('string')) {
      return {
        agent: 'ChatAgent',
        text: "Here is how you can reverse a string in Python and TypeScript:\n\n```python\n# Python 3\ndef reverse_string(text: str) -> str:\n    return text[::-1]\n\nprint(reverse_string('Hello'))  # Output: olleH\n```\n\n```typescript\n// TypeScript\nconst reverseString = (text: string): string => text.split('').reverse().join('');\n\nconsole.log(reverseString('Hello'));\n```\n\nLet me know if you have any questions about how this works!"
      };
    }
    return {
      agent: 'ChatAgent',
      text: "I can help with coding! I work with TypeScript, Python, React, C++, SQL, and algorithm design. What code or feature are you working on?"
    };
  }

  // Quantum Computing & Science
  if (lower.includes('quantum computing') || lower.includes('quantum computer')) {
    return {
      agent: 'ChatAgent',
      text: "Quantum computing processes complex information using quantum physics instead of classical bits.\n\n• **Qubits**: Unlike classical bits (0 or 1), qubits can exist in superposition (0, 1, or both at once).\n• **Entanglement**: Qubits can link together so changing one instantly impacts another.\n• **Applications**: Excellent for molecular simulation, cryptography, and complex optimization.\n\nIs there a specific quantum concept you'd like to explore?"
    };
  }

  // AGI
  if (lower.includes('agi') || lower.includes('artificial general intelligence')) {
    return {
      agent: 'ChatAgent',
      text: "AGI (Artificial General Intelligence) refers to AI systems that can learn, reason, and apply intelligence across virtually any domain — similar to human cognition.\n\nUnlike specialized narrow AI, AGI can generalize knowledge, adapt to unprecedented situations, and solve cross-domain problems autonomously."
    };
  }

  // Productivity
  if (lower.includes('productivity') || lower.includes('focus') || lower.includes('burnout')) {
    return {
      agent: 'ChatAgent',
      text: "Here are 4 solid focus strategies:\n\n1. **Focus Sprints**: Work in 30-45 minute blocks with 5-minute true breaks.\n2. **Single-Tasking**: Pick one priority task to avoid cognitive switching overhead.\n3. **Hydration & Physical Rest**: Drink water and step away from screens periodically.\n4. **Clear Environment**: Keep your workspace minimal and distraction-free."
    };
  }

  // Natural Conversational Fallback
  return {
    agent: 'ChatAgent',
    text: `That's an interesting point regarding "${query}". I'd love to chat more about it or help you explore ideas. What are your thoughts on it?`
  };
}
