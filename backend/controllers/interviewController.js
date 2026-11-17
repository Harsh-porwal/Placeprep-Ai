const { GoogleGenerativeAI } = require('@google/generative-ai');
const InterviewSession = require('../models/InterviewSession');

// Predefined question pool for fallback when Gemini API key is absent
const questionBank = {
  HR: [
    'Tell me about yourself and your academic background in B.Tech.',
    'What are your top 3 strengths and one area you are working to improve?',
    'Why do you want to join our company as a software developer?',
    'Describe a challenging project you worked on and how you handled teamwork conflicts.',
    'Where do you see yourself in 3 to 5 years after graduation?'
  ],
  Technical: [
    'Explain the concept of Object-Oriented Programming (OOP) and its 4 fundamental pillars.',
    'What is the difference between a process and a thread in operating systems?',
    'What is Indexing in Database Management Systems (DBMS) and why is it useful?',
    'Explain the OSI model 7 layers and compare TCP vs UDP protocols.',
    'What is a RESTful API and how does HTTP status code 404 differ from 500?'
  ],
  DSA: [
    'Explain the difference between Array and Linked List data structures in memory.',
    'How does Binary Search work and what is its time complexity compared to Linear Search?',
    'What is a Hash Map, how does collision handling work, and what is its average lookup time?',
    'Explain QuickSort algorithm and its worst-case vs average-case time complexity.',
    'What is the difference between Breadth-First Search (BFS) and Depth-First Search (DFS)?'
  ],
  DBMS: [
    'What is Normalization in DBMS? Explain 1NF, 2NF, and 3NF with examples.',
    'Explain ACID properties in database transactions with real-world examples.',
    'What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN in SQL?',
    'What are Primary Key, Candidate Key, and Foreign Key constraints?',
    'Explain deadlock in database transactions and how it can be prevented.'
  ],
  OS: [
    'Explain CPU Scheduling algorithms like FCFS, SJF, and Round Robin.',
    'What is Virtual Memory and Paging in Operating Systems?',
    'What is a Deadlock and what are the 4 necessary Coffman conditions for a deadlock?',
    'Explain Mutex vs Semaphore synchronization mechanisms.',
    'What is a system call and what happens during a context switch?'
  ],
  CN: [
    'Explain the 3-way handshake process in TCP protocol.',
    'What is the difference between HTTP and HTTPS? How does SSL/TLS encryption work?',
    'Explain DNS lookup mechanism step by step when you type a URL in browser.',
    'What is an IP address, Subnet Mask, and Gateway?',
    'Compare TCP vs UDP protocols with their respective use cases.'
  ],
  Java: [
    'Explain JVM, JRE, and JDK differences.',
    'What is the difference between String, StringBuilder, and StringBuffer in Java?',
    'Explain garbage collection in Java and how the System.gc() method works.',
    'What is the difference between Abstract Class and Interface in Java 8+?',
    'Explain exception handling in Java: try, catch, finally, throw, and throws.'
  ],
  Python: [
    'What is the difference between list, tuple, set, and dictionary in Python?',
    'Explain Python memory management and how GIL (Global Interpreter Lock) impacts multithreading.',
    'What are decorators in Python and how do you write a custom decorator?',
    'Explain list comprehension and generator functions using yield.',
    'What is the difference between deep copy and shallow copy in Python?'
  ],
  JavaScript: [
    'Explain Closures in JavaScript with a code example.',
    'What is the Event Loop, Call Stack, and Task Queue in JavaScript execution engine?',
    'Explain the difference between var, let, and const scope and hoisting.',
    'How do Promises work and how does async/await simplify asynchronous JavaScript?',
    'What is event delegation and bubbling in the DOM?'
  ]
};

// @desc    Start a new mock interview session
// @route   POST /api/interview/start
// @access  Private
exports.startInterview = async (req, res) => {
  try {
    const { interviewType = 'Technical', difficulty = 'Intermediate' } = req.body;
    const userId = req.user._id;

    let firstQuestion = '';

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `You are a senior technical interviewer conducting a campus placement interview for a B.Tech CSE student.
Interview Category: ${interviewType}
Difficulty Level: ${difficulty}

Ask the FIRST interview question. Make it clear, realistic, and focused on core principles. Do not include introductory conversational fluff or greetings; output ONLY the interview question text directly.`;

        const result = await model.generateContent(prompt);
        firstQuestion = result.response.text().trim();
      } catch (err) {
        console.error('Gemini error start interview:', err.message);
        const pool = questionBank[interviewType] || questionBank.Technical;
        firstQuestion = pool[0];
      }
    } else {
      const pool = questionBank[interviewType] || questionBank.Technical;
      firstQuestion = pool[0];
    }

    const session = await InterviewSession.create({
      userId,
      interviewType,
      difficulty,
      questions: [
        {
          question: firstQuestion,
          userAnswer: '',
          score: 0,
          feedback: '',
          missingPoints: '',
        },
      ],
      status: 'in_progress',
    });

    return res.json({
      success: true,
      sessionId: session._id,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      questionNumber: 1,
      totalQuestions: 5,
      currentQuestion: firstQuestion,
    });
  } catch (error) {
    console.error('Start Interview Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit answer to current interview question and get evaluation
// @route   POST /api/interview/answer
// @access  Private
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and answer are required',
      });
    }

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    });
    if (!session || session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview session not found or already completed',
      });
    }

    const currentIndex = session.questions.length - 1;
    const currentQ = session.questions[currentIndex];
    currentQ.userAnswer = answer;

    let evaluation = {
      score: 7,
      feedback: 'Good effort! You answered the fundamental concept correctly.',
      missingPoints: 'Consider adding technical keywords and performance considerations.',
      nextQuestion: '',
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const isLastQuestion = session.questions.length >= 5;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const evalPrompt = `
You are a senior hiring manager conducting a mock interview for campus placements.
Category: ${session.interviewType}
Difficulty: ${session.difficulty}
Question Asked: "${currentQ.question}"
Student's Answer: "${answer}"
Is Final Question: ${isLastQuestion}

Evaluate the student's answer thoroughly. Respond STRICTLY in valid JSON format without markdown wrapping:
{
  "score": <integer from 1 to 10>,
  "feedback": "<detailed constructive feedback on accuracy and communication>",
  "missingPoints": "<key technical points or terminology student missed>",
  "nextQuestion": "<${isLastQuestion ? '' : 'Next challenging interview question'}>"
}
`;

        const evalResult = await model.generateContent(evalPrompt);
        const cleanedText = evalResult.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
        evaluation = JSON.parse(cleanedText);
      } catch (aiErr) {
        console.error('Gemini Eval Error:', aiErr.message);
        // Fallback scoring
        const len = answer.trim().length;
        evaluation.score = len > 150 ? 8 : len > 60 ? 7 : 5;
        evaluation.feedback = 'Your answer covers the primary concept well. Speak clearly with structured bullet points in live interviews.';
        evaluation.missingPoints = 'Remember to mention memory consumption, edge cases, and real-world application examples.';
        if (!isLastQuestion) {
          const pool = questionBank[session.interviewType] || questionBank.Technical;
          evaluation.nextQuestion = pool[session.questions.length % pool.length];
        }
      }
    } else {
      const len = answer.trim().length;
      evaluation.score = len > 150 ? 8 : len > 60 ? 7 : 5;
      evaluation.feedback = 'Your answer covers the primary concept well. Speak clearly with structured bullet points in live interviews.';
      evaluation.missingPoints = 'Remember to mention memory consumption, edge cases, and real-world application examples.';
      if (!isLastQuestion) {
        const pool = questionBank[session.interviewType] || questionBank.Technical;
        evaluation.nextQuestion = pool[session.questions.length % pool.length];
      }
    }

    currentQ.score = evaluation.score || 7;
    currentQ.feedback = evaluation.feedback || '';
    currentQ.missingPoints = evaluation.missingPoints || '';

    if (isLastQuestion || !evaluation.nextQuestion) {
      // Calculate overall statistics
      session.status = 'completed';
      const totalScore = session.questions.reduce((acc, q) => acc + (q.score || 0), 0);
      session.overallScore = Math.round((totalScore / (session.questions.length * 10)) * 100);
      session.technicalScore = Math.min(95, session.overallScore + 4);
      session.communicationScore = Math.max(60, session.overallScore - 3);
      session.suggestions =
        'Great job completing the mock interview! Continue revising core computer science concepts, focus on explaining time/space complexities, and practice speaking structured responses.';
      await session.save();

      return res.json({
        success: true,
        completed: true,
        session,
        evaluation,
      });
    } else {
      // Add next question to session
      session.questions.push({
        question: evaluation.nextQuestion,
        userAnswer: '',
        score: 0,
        feedback: '',
        missingPoints: '',
      });
      await session.save();

      return res.json({
        success: true,
        completed: false,
        questionNumber: session.questions.length,
        totalQuestions: 5,
        evaluation,
        nextQuestion: evaluation.nextQuestion,
      });
    }
  } catch (error) {
    console.error('Submit Answer Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user interview history
// @route   GET /api/interview/history
// @access  Private
exports.getInterviewHistory = async (req, res) => {
  try {
    const history = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.json({ success: true, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
