const { GoogleGenerativeAI } = require('@google/generative-ai');

// Fallback QA dictionary for offline / missing API key mode
const fallbackQA = {
  normalization: `**Normalization in DBMS** is the process of organizing database tables to reduce data redundancy and improve data integrity. 

Key Normal Forms:
1. **1NF (First Normal Form)**: Ensures all column values are atomic (indivisible) and each record is unique.
2. **2NF (Second Normal Form)**: Must be in 1NF, and all non-key attributes must be fully functionally dependent on the primary key.
3. **3NF (Third Normal Form)**: Must be in 2NF, and removes transitive dependencies (non-key attributes depending on another non-key attribute).
4. **BCNF (Boyce-Codd Normal Form)**: A stricter 3NF where for every dependency X -> Y, X must be a super key.`,
  
  process: `**Process vs Thread in Operating Systems**:

- **Process**: An executing program in memory. It has its own independent address space, file handles, and memory map. Process creation is heavy and context switching is slower.
- **Thread**: A lightweight unit of execution within a process. Multiple threads of the same process share memory, data, and resources, making context switching very fast.`,

  dsa: `**Key DSA Preparation Strategy for Placements**:

1. **Master Core Data Structures**: Arrays, Strings, Hash Maps, Linked Lists, Stacks, Queues.
2. **Advanced Data Structures**: Trees (Binary Trees, BST), Graphs, Heaps, Trie.
3. **Core Algorithmic Patterns**: Two Pointers, Sliding Window, Fast & Slow Pointers, BFS/DFS, Binary Search, Dynamic Programming.
4. **Target Frequency**: Practice at least 2-3 problems daily on PlacePrep AI and track your progress!`
};

// @desc    Chat with PlacePrep AI Assistant
// @route   POST /api/ai/chat
// @access  Public (or Private)
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are "PlacePrep AI Assistant", an expert EdTech AI placement mentor for college engineering students (B.Tech CSE/IT/ECE).
Answer student questions clearly, concisely, with formatting (bullet points, code snippets, bold text) where appropriate.
Topics include: Data Structures & Algorithms (DSA), Operating Systems (OS), DBMS, Computer Networks (CN), OOP, Programming languages (Java, Python, C++, JS), Resume guidance, HR interview answers, and Aptitude problem-solving.

Student Query: "${message}"`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        return res.json({ success: true, reply });
      } catch (aiErr) {
        console.error('Gemini Chat Error:', aiErr.message);
      }
    }

    // Heuristic Fallback Answer
    const msgLower = message.toLowerCase();
    let reply = `Thank you for asking! PlacePrep AI is here to help with your placement preparation.

`;

    if (msgLower.includes('normaliz')) {
      reply += fallbackQA.normalization;
    } else if (msgLower.includes('process') || msgLower.includes('thread')) {
      reply += fallbackQA.process;
    } else if (msgLower.includes('dsa') || msgLower.includes('prepare') || msgLower.includes('roadmap')) {
      reply += fallbackQA.dsa;
    } else {
      reply += `Here is guidance regarding your question about "${message}":

1. **Understand Core Principles**: Make sure to break down complex engineering concepts into basic definitions, real-world examples, and time/space complexity comparisons.
2. **Standard Interview Format**: State the definition first, explain how it works under the hood, give a code snippet or diagram if technical, and finish with practical trade-offs.
3. **Practice Regularly**: Explore the Coding Tracker, Aptitude Practice, and AI Mock Interview modules on PlacePrep AI to strengthen your skills!

*(Note: To unlock live full Gemini AI response capabilities, set your valid \`GEMINI_API_KEY\` in your \`.env\` file).*`;
    }

    return res.json({ success: true, reply });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
