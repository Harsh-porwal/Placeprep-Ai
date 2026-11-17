const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Company = require('../models/Company');
const CodingQuestion = require('../models/CodingQuestion');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const Progress = require('../models/Progress');
const InterviewSession = require('../models/InterviewSession');
const ResumeAnalysis = require('../models/ResumeAnalysis');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placeprep_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await CodingQuestion.deleteMany({});
    await AptitudeQuestion.deleteMany({});
    await Progress.deleteMany({});
    await InterviewSession.deleteMany({});
    await ResumeAnalysis.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Users
    await User.create([
      {
        name: 'Demo Student',
        email: 'student@placeprep.ai',
        password: 'Student@123',
        college: 'Indian Institute of Technology (IIT) Delhi',
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        graduationYear: '2026',
        skills: ['Java', 'Data Structures', 'Python', 'React', 'Node.js', 'SQL'],
        careerGoal: 'Software Developer',
        github: 'https://github.com/demostudent',
        linkedin: 'https://linkedin.com/in/demostudent',
        role: 'student',
      },
      {
        name: 'System Admin',
        email: 'admin@placeprep.ai',
        password: 'Admin@123',
        college: 'PlacePrep Admin HQ',
        degree: 'M.Tech',
        branch: 'Computer Science & Engineering',
        graduationYear: '2020',
        skills: ['System Design', 'Cloud Architecture', 'Security'],
        careerGoal: 'AI Engineering Director',
        role: 'admin',
      },
    ]);
    console.log('[Seed] Users seeded successfully.');

    // 2. Create 10 Companies
    const companiesData = [
      {
        name: 'Google',
        description: 'Global tech giant specializing in search, cloud computing, AI, and consumer hardware.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        category: 'Product',
        packageRange: '18 - 45 LPA',
        skills: ['C++', 'Java', 'Python', 'DSA', 'System Design', 'OS', 'Networks'],
        codingQuestions: [
          { title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', link: 'https://leetcode.com/problems/two-sum' },
          { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'Trees', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum' },
          { title: 'Word Break', difficulty: 'Medium', topic: 'Dynamic Programming', link: 'https://leetcode.com/problems/word-break' },
        ],
        technicalQuestions: [
          { question: 'Explain how Google Search index works at a high level.', category: 'System Design', answerHint: 'Inverted indexing, web crawlers, PageRank algorithm.' },
          { question: 'What is the difference between Process and Thread?', category: 'OS', answerHint: 'Address space, overhead, communication.' },
          { question: 'Explain Trie data structure and its application in auto-complete.', category: 'DSA', answerHint: 'Prefix tree, O(L) search time.' }
        ],
        hrQuestions: [
          { question: 'Why Google and what impact do you hope to make?', tip: 'Align with Google mission of organizing world information.' },
          { question: 'Tell me about a time you failed and how you recovered.', tip: 'Use STAR method focusing on learnings.' }
        ],
        aptitudeTopics: ['Quantitative Logic', 'Probability', 'Puzzles']
      },
      {
        name: 'Microsoft',
        description: 'Leading global developer of software, devices, Azure cloud services, and gaming solutions.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
        category: 'Product',
        packageRange: '15 - 40 LPA',
        skills: ['C#', 'Java', 'Data Structures', 'OOP', 'Azure', 'DBMS'],
        codingQuestions: [
          { title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked Lists', link: 'https://leetcode.com/problems/reverse-linked-list' },
          { title: 'LRU Cache', difficulty: 'Medium', topic: 'Linked Lists', link: 'https://leetcode.com/problems/lru-cache' },
          { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays', link: 'https://leetcode.com/problems/merge-intervals' },
        ],
        technicalQuestions: [
          { question: 'Explain Virtual Memory and Paging in OS.', category: 'OS', answerHint: 'Page tables, page faults, translation lookaside buffer.' },
          { question: 'How would you design a rate limiter?', category: 'System Design', answerHint: 'Token bucket, sliding log algorithms.' }
        ],
        hrQuestions: [
          { question: 'What does growth mindset mean to you?', tip: 'Reflect on continuous learning experiences.' }
        ],
        aptitudeTopics: ['Data Interpretation', 'Algebra', 'Logical Sequence']
      },
      {
        name: 'Amazon',
        description: 'E-commerce, cloud computing (AWS), digital streaming, and artificial intelligence powerhouse.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        category: 'Product',
        packageRange: '16 - 42 LPA',
        skills: ['Java', 'AWS', 'Object Oriented Design', 'DSA', 'Distributed Systems'],
        codingQuestions: [
          { title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', link: 'https://leetcode.com/problems/number-of-islands' },
          { title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Arrays', link: 'https://leetcode.com/problems/trapping-rain-water' },
          { title: 'Reorder Data in Log Files', difficulty: 'Medium', topic: 'Strings', link: 'https://leetcode.com/problems/reorder-data-in-log-files' },
        ],
        technicalQuestions: [
          { question: 'Explain Amazon Leadership Principles with a personal project story.', category: 'Behavioral/Tech', answerHint: 'Customer Obsession, Ownership, Bias for Action.' }
        ],
        hrQuestions: [
          { question: 'Describe a situation where you had to make a decision with incomplete data.', tip: 'Show bias for action and risk assessment.' }
        ],
        aptitudeTopics: ['Work and Time', 'Speed and Distance', 'Bar Charts']
      },
      {
        name: 'Adobe',
        description: 'American multinational computer software company creator of Photoshop, Acrobat, and Experience Cloud.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_2020.svg',
        category: 'Product',
        packageRange: '14 - 35 LPA',
        skills: ['C++', 'Java', 'Graphics Engine', 'Algorithms', 'JavaScript'],
        codingQuestions: [
          { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Searching', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays' },
          { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Trees', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree' }
        ],
        technicalQuestions: [
          { question: 'What is memory leak in C++ and how do smart pointers prevent it?', category: 'OOP/C++', answerHint: 'unique_ptr, shared_ptr, weak_ptr.' }
        ],
        hrQuestions: [
          { question: 'How do you foster creativity in technical problem solving?', tip: 'Highlight innovative solutions.' }
        ],
        aptitudeTopics: ['Permutations & Combinations', 'Probability', 'Verbal Reasoning']
      },
      {
        name: 'Infosys',
        description: 'Global leader in next-generation digital services and consulting across 50+ countries.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
        category: 'Service',
        packageRange: '4.5 - 9.5 LPA',
        skills: ['Java', 'Python', 'SQL', 'Web Development', 'OOP'],
        codingQuestions: [
          { title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', link: 'https://leetcode.com/problems/valid-parentheses' },
          { title: 'Binary Search', difficulty: 'Easy', topic: 'Searching', link: 'https://leetcode.com/problems/binary-search' }
        ],
        technicalQuestions: [
          { question: 'Explain Primary Key vs Unique Key in SQL.', category: 'DBMS', answerHint: 'Null values allowance, single primary key limit.' }
        ],
        hrQuestions: [
          { question: 'Are you open to relocation across India?', tip: 'State your flexibility and enthusiasm.' }
        ],
        aptitudeTopics: ['Series Completion', 'Coding Decoding', 'Reading Comprehension']
      },
      {
        name: 'TCS',
        description: 'Tata Consultancy Services - IT services, consulting and business solutions organization.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/TATAConsultancyServices_Logo.svg',
        category: 'Service',
        packageRange: '3.5 - 7.5 LPA',
        skills: ['C', 'Java', 'DBMS', 'Software Engineering', 'Aptitude'],
        codingQuestions: [
          { title: 'Palindrome Number', difficulty: 'Easy', topic: 'Math', link: 'https://leetcode.com/problems/palindrome-number' },
          { title: 'Fibonacci Number', difficulty: 'Easy', topic: 'Recursion', link: 'https://leetcode.com/problems/fibonacci-number' }
        ],
        technicalQuestions: [
          { question: 'Explain SDLC phases (Waterfall vs Agile).', category: 'Software Eng', answerHint: 'Requirements, design, dev, test, deploy, maintain.' }
        ],
        hrQuestions: [
          { question: 'Tell me about Tata core values.', tip: 'Integrity, Responsibility, Excellence, Pioneering, Unity.' }
        ],
        aptitudeTopics: ['Quantitative Ability', 'Logical Reasoning', 'Verbal Ability']
      },
      {
        name: 'Wipro',
        description: 'Leading global information technology, consulting and business process services company.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
        category: 'Service',
        packageRange: '3.5 - 6.5 LPA',
        skills: ['Java', 'C++', 'SQL', 'Testing', 'Python'],
        codingQuestions: [
          { title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Arrays', link: 'https://leetcode.com/problems/maximum-subarray' }
        ],
        technicalQuestions: [
          { question: 'What is method overloading vs method overriding in Java?', category: 'OOP', answerHint: 'Compile time vs runtime polymorphism.' }
        ],
        hrQuestions: [
          { question: 'How do you prioritize multiple deadlines under pressure?', tip: 'Discuss task breakdown and time management.' }
        ],
        aptitudeTopics: ['Percentage', 'Profit and Loss', 'Blood Relations']
      },
      {
        name: 'Accenture',
        description: 'Global professional services company providing strategy, consulting, digital, and technology services.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
        category: 'Consulting',
        packageRange: '4.5 - 11 LPA',
        skills: ['Java', 'Cloud', 'Analytics', 'SQL', 'JavaScript'],
        codingQuestions: [
          { title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming', link: 'https://leetcode.com/problems/climbing-stairs' }
        ],
        technicalQuestions: [
          { question: 'What is REST API and how does it use HTTP methods?', category: 'Web', answerHint: 'GET, POST, PUT, DELETE operations.' }
        ],
        hrQuestions: [
          { question: 'Why Accenture and what technology area excites you most?', tip: 'Focus on digital transformation.' }
        ],
        aptitudeTopics: ['Syllogisms', 'Data Sufficiency', 'Venn Diagrams']
      },
      {
        name: 'Deloitte',
        description: 'Largest professional services network delivering audit, consulting, financial advisory, and risk management.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
        category: 'Consulting',
        packageRange: '6 - 12 LPA',
        skills: ['SQL', 'Python', 'Data Analytics', 'Java', 'Cybersecurity'],
        codingQuestions: [
          { title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays', link: 'https://leetcode.com/problems/contains-duplicate' }
        ],
        technicalQuestions: [
          { question: 'What is SQL Join and explain difference between INNER and OUTER joins.', category: 'DBMS', answerHint: 'Matching keys vs keeping unmatched rows.' }
        ],
        hrQuestions: [
          { question: 'Describe a situation where you led a team project.', tip: 'Show leadership, empathy, and goal execution.' }
        ],
        aptitudeTopics: ['Quantitative Aptitude', 'Data Interpretation', 'Analytical Reasoning']
      },
      {
        name: 'Capgemini',
        description: 'Global leader in partnering with companies to transform and manage business through technology.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg',
        category: 'Consulting',
        packageRange: '4 - 8.5 LPA',
        skills: ['Java', 'DotNet', 'Cloud', 'SQL', 'Python'],
        codingQuestions: [
          { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' }
        ],
        technicalQuestions: [
          { question: 'What is Exception Handling and why is it important in production code?', category: 'Core CS', answerHint: 'Try-catch blocks, graceful degradation.' }
        ],
        hrQuestions: [
          { question: 'Where do you see yourself in 3 years at Capgemini?', tip: 'Continuous skill upgrade and team contribution.' }
        ],
        aptitudeTopics: ['Pseudo Code Analysis', 'Game-based Aptitude', 'English Communication']
      }
    ];

    await Company.insertMany(companiesData);
    console.log('[Seed] 10 Companies seeded successfully.');

    // 3. Seed 30 Coding Questions
    const codingQuestionsData = [
      { title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', difficulty: 'Easy', topic: 'Arrays', company: 'Google, Amazon', externalLink: 'https://leetcode.com/problems/two-sum' },
      { title: 'Best Time to Buy and Sell Stock', description: 'Maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.', difficulty: 'Easy', topic: 'Arrays', company: 'Amazon, Microsoft', externalLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' },
      { title: 'Contains Duplicate', description: 'Given an integer array nums, return true if any value appears at least twice in the array.', difficulty: 'Easy', topic: 'Arrays', company: 'Adobe, Infosys', externalLink: 'https://leetcode.com/problems/contains-duplicate' },
      { title: 'Maximum Subarray (Kadane Algo)', description: 'Find the contiguous subarray which has the largest sum and return its sum.', difficulty: 'Medium', topic: 'Arrays', company: 'Google, TCS', externalLink: 'https://leetcode.com/problems/maximum-subarray' },
      { title: 'Merge Intervals', description: 'Given an array of intervals, merge all overlapping intervals.', difficulty: 'Medium', topic: 'Arrays', company: 'Microsoft, Amazon', externalLink: 'https://leetcode.com/problems/merge-intervals' },
      { title: '3Sum', description: 'Find all unique triplets in the array which gives the sum of zero.', difficulty: 'Medium', topic: 'Arrays', company: 'Google, Facebook', externalLink: 'https://leetcode.com/problems/3sum' },

      { title: 'Valid Anagram', description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', difficulty: 'Easy', topic: 'Strings', company: 'Uber, Infosys', externalLink: 'https://leetcode.com/problems/valid-anagram' },
      { title: 'Valid Palindrome', description: 'Convert string to lowercase and remove non-alphanumeric characters, check if it reads the same forward and backward.', difficulty: 'Easy', topic: 'Strings', company: 'Microsoft', externalLink: 'https://leetcode.com/problems/valid-palindrome' },
      { title: 'Longest Substring Without Repeating Characters', description: 'Find the length of the longest substring without repeating characters.', difficulty: 'Medium', topic: 'Strings', company: 'Amazon, Google', externalLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },
      { title: 'Group Anagrams', description: 'Given an array of strings, group the anagrams together.', difficulty: 'Medium', topic: 'Strings', company: 'Amazon', externalLink: 'https://leetcode.com/problems/group-anagrams' },

      { title: 'Reverse Linked List', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', difficulty: 'Easy', topic: 'Linked Lists', company: 'Microsoft, Adobe', externalLink: 'https://leetcode.com/problems/reverse-linked-list' },
      { title: 'Merge Two Sorted Lists', description: 'Merge two sorted linked lists and return it as a sorted list.', difficulty: 'Easy', topic: 'Linked Lists', company: 'Amazon, TCS', externalLink: 'https://leetcode.com/problems/merge-two-sorted-lists' },
      { title: 'Linked List Cycle', description: 'Determine if the linked list has a cycle in it using Floyd Cycle Finding Algorithm.', difficulty: 'Easy', topic: 'Linked Lists', company: 'Accenture, Wipro', externalLink: 'https://leetcode.com/problems/linked-list-cycle' },
      { title: 'Remove Nth Node From End of List', description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.', difficulty: 'Medium', topic: 'Linked Lists', company: 'Google', externalLink: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list' },

      { title: 'Valid Parentheses', description: 'Given a string s containing just the characters brackets, determine if the input string is valid.', difficulty: 'Easy', topic: 'Stack', company: 'Infosys, Deloitte', externalLink: 'https://leetcode.com/problems/valid-parentheses' },
      { title: 'Min Stack', description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.', difficulty: 'Medium', topic: 'Stack', company: 'Amazon, Microsoft', externalLink: 'https://leetcode.com/problems/min-stack' },
      { title: 'Daily Temperatures', description: 'Return an array such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.', difficulty: 'Medium', topic: 'Stack', company: 'Google', externalLink: 'https://leetcode.com/problems/daily-temperatures' },

      { title: 'Implement Queue using Stacks', description: 'Implement a first in first out (FIFO) queue using only two stacks.', difficulty: 'Easy', topic: 'Queue', company: 'Capgemini, Wipro', externalLink: 'https://leetcode.com/problems/implement-queue-using-stacks' },

      { title: 'Invert Binary Tree', description: 'Given the root of a binary tree, invert the tree, and return its root.', difficulty: 'Easy', topic: 'Trees', company: 'Google, Homebrew', externalLink: 'https://leetcode.com/problems/invert-binary-tree' },
      { title: 'Maximum Depth of Binary Tree', description: 'Given the root of a binary tree, return its maximum depth.', difficulty: 'Easy', topic: 'Trees', company: 'Microsoft', externalLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree' },
      { title: 'Lowest Common Ancestor of a BST', description: 'Find the lowest common ancestor node of two given nodes in a Binary Search Tree.', difficulty: 'Medium', topic: 'Trees', company: 'Amazon', externalLink: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree' },

      { title: 'Number of Islands', description: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands.', difficulty: 'Medium', topic: 'Graphs', company: 'Amazon, Google', externalLink: 'https://leetcode.com/problems/number-of-islands' },
      { title: 'Clone Graph', description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.', difficulty: 'Medium', topic: 'Graphs', company: 'Facebook', externalLink: 'https://leetcode.com/problems/clone-graph' },

      { title: 'Fibonacci Number', description: 'Calculate the Nth Fibonacci number using recursion or iterative dynamic programming.', difficulty: 'Easy', topic: 'Recursion', company: 'TCS, Infosys', externalLink: 'https://leetcode.com/problems/fibonacci-number' },
      { title: 'Subsets (Power Set)', description: 'Given an integer array nums of unique elements, return all possible subsets (the power set).', difficulty: 'Medium', topic: 'Recursion', company: 'Adobe, Amazon', externalLink: 'https://leetcode.com/problems/subsets' },

      { title: 'Climbing Stairs', description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps.', difficulty: 'Easy', topic: 'Dynamic Programming', company: 'Google, Amazon', externalLink: 'https://leetcode.com/problems/climbing-stairs' },
      { title: 'Coin Change', description: 'Compute the fewest number of coins that you need to make up a given target amount.', difficulty: 'Medium', topic: 'Dynamic Programming', company: 'Amazon, Microsoft', externalLink: 'https://leetcode.com/problems/coin-change' },
      { title: 'Longest Increasing Subsequence', description: 'Find the length of the longest strictly increasing subsequence.', difficulty: 'Medium', topic: 'Dynamic Programming', company: 'Google, Adobe', externalLink: 'https://leetcode.com/problems/longest-increasing-subsequence' },

      { title: 'Binary Search', description: 'Given an array of integers nums which is sorted in ascending order, write a function to search target in nums.', difficulty: 'Easy', topic: 'Searching', company: 'Infosys, Wipro', externalLink: 'https://leetcode.com/problems/binary-search' },
      { title: 'Search in Rotated Sorted Array', description: 'Search a target value in a rotated sorted array in O(log n) time.', difficulty: 'Medium', topic: 'Searching', company: 'Google, Microsoft', externalLink: 'https://leetcode.com/problems/search-in-rotated-sorted-array' },
    ];

    await CodingQuestion.insertMany(codingQuestionsData);
    console.log('[Seed] 30 Coding Questions seeded successfully.');

    // 4. Seed 30 Aptitude Questions
    const aptitudeData = [
      // Quant (8)
      { question: 'A car covers a distance of 480 km in 8 hours. What is its average speed in m/s?', options: ['16.67 m/s', '20 m/s', '15 m/s', '18.33 m/s'], correctAnswer: 0, explanation: 'Speed = Distance / Time = 480 km / 8 hrs = 60 km/h. To convert km/h to m/s, multiply by 5/18: 60 * 5/18 = 16.67 m/s.', category: 'Quantitative Aptitude', difficulty: 'Medium' },
      { question: 'If 12 men can complete a work in 20 days, how many days will 15 men take to complete the same work?', options: ['16 days', '18 days', '14 days', '15 days'], correctAnswer: 0, explanation: 'Man-days = 12 * 20 = 240. Days for 15 men = 240 / 15 = 16 days.', category: 'Quantitative Aptitude', difficulty: 'Easy' },
      { question: 'What is the simple interest earned on $5,000 at an annual interest rate of 6% for 3 years?', options: ['$900', '$800', '$1,000', '$750'], correctAnswer: 0, explanation: 'SI = (P * R * T) / 100 = (5000 * 6 * 3) / 100 = $900.', category: 'Quantitative Aptitude', difficulty: 'Easy' },
      { question: 'A shopkeeper marks an item 25% above cost price and allows a 10% discount. What is his net profit percentage?', options: ['12.5%', '15%', '10%', '11.5%'], correctAnswer: 0, explanation: 'Let CP = 100. Marked Price = 125. Selling Price = 125 - 10% of 125 = 112.5. Profit % = 12.5%.', category: 'Quantitative Aptitude', difficulty: 'Medium' },
      { question: 'What is the sum of the first 20 even natural numbers?', options: ['420', '400', '440', '380'], correctAnswer: 0, explanation: 'Sum of first n even numbers = n * (n + 1) = 20 * 21 = 420.', category: 'Quantitative Aptitude', difficulty: 'Easy' },
      { question: 'The ratio of ages of A and B is 4:5. If the sum of their ages is 36, what is B’s age?', options: ['20 years', '16 years', '22 years', '18 years'], correctAnswer: 0, explanation: 'Sum of ratio parts = 4 + 5 = 9 parts. 1 part = 36 / 9 = 4 years. B age = 5 * 4 = 20 years.', category: 'Quantitative Aptitude', difficulty: 'Easy' },
      { question: 'Two dice are rolled simultaneously. What is the probability of getting a sum equal to 8?', options: ['5/36', '1/6', '1/9', '7/36'], correctAnswer: 0, explanation: 'Favorable outcomes for sum=8: (2,6),(3,5),(4,4),(5,3),(6,2) -> 5 outcomes out of 36 total. Probability = 5/36.', category: 'Quantitative Aptitude', difficulty: 'Medium' },
      { question: 'Find the average of all prime numbers between 10 and 25.', options: ['16.6', '17.2', '15.8', '18.0'], correctAnswer: 0, explanation: 'Primes between 10 and 25: 11, 13, 17, 19, 23. Sum = 83. Count = 5. Average = 83 / 5 = 16.6.', category: 'Quantitative Aptitude', difficulty: 'Medium' },

      // Logical Reasoning (8)
      { question: 'In a certain code language, "COMPUTER" is written as "RFUVQNPC". How is "MEDICINE" written in that code?', options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'EOJDJFEM'], correctAnswer: 0, explanation: 'Reverse the word and shift each character by +1. MEDICINE reversed is ENICIDEM -> shift by +1 gives EOJDJEFM.', category: 'Logical Reasoning', difficulty: 'Medium' },
      { question: 'Pointing to a photograph, a man said "I have no brother or sister but that man’s father is my father’s son." Whose photograph was it?', options: ['His son’s photograph', 'His father’s photograph', 'His own photograph', 'His nephew’s photograph'], correctAnswer: 0, explanation: '"My father\'s son" means himself (since he has no brother). So "that man\'s father is myself". The photograph is of his son.', category: 'Logical Reasoning', difficulty: 'Medium' },
      { question: 'Look at the series: 2, 6, 12, 20, 30, ... What number should come next?', options: ['42', '40', '36', '44'], correctAnswer: 0, explanation: 'Differences between terms: +4, +6, +8, +10, ... Next difference is +12. 30 + 12 = 42.', category: 'Logical Reasoning', difficulty: 'Easy' },
      { question: 'If A is the brother of B, B is the sister of C, and C is the father of D, how is D related to A?', options: ['Nephew or Niece', 'Brother', 'Cousin', 'Uncle'], correctAnswer: 0, explanation: 'A, B, C are siblings. C is father of D. Therefore D is the nephew or niece of A.', category: 'Logical Reasoning', difficulty: 'Medium' },
      { question: 'Statements: All dogs are mammals. All mammals are animals. Conclusion: All dogs are animals.', options: ['Only Conclusion follows', 'Conclusion does not follow', 'Either follow', 'Neither follow'], correctAnswer: 0, explanation: 'Valid categorical syllogism (Dogs -> Mammals -> Animals => Dogs -> Animals).', category: 'Logical Reasoning', difficulty: 'Easy' },
      { question: 'A person walks 10 meters North, turns Right and walks 15 meters, then turns Right again and walks 10 meters. How far is he from his starting point?', options: ['15 meters', '10 meters', '25 meters', '20 meters'], correctAnswer: 0, explanation: 'The North and South movements cancel each other out (10m North, then 10m South). He is 15 meters East of starting point.', category: 'Logical Reasoning', difficulty: 'Easy' },
      { question: 'Which word does NOT belong with the others?', options: ['Turing', 'Newton', 'Einstein', 'Galileo'], correctAnswer: 0, explanation: 'Newton, Einstein, and Galileo are physicists; Alan Turing is a pioneer computer scientist.', category: 'Logical Reasoning', difficulty: 'Medium' },
      { question: 'If South-East becomes North, North-East becomes West and so on, what will West become?', options: ['South-East', 'North-East', 'South-West', 'North-West'], correctAnswer: 0, explanation: 'The cardinal directions are rotated by 135 degrees anti-clockwise. West rotated 135 degrees anti-clockwise becomes South-East.', category: 'Logical Reasoning', difficulty: 'Hard' },

      // Verbal Ability (8)
      { question: 'Choose the word nearest in meaning (Synonym) to "ABUNDANT".', options: ['Plentiful', 'Scarce', 'Meager', 'Rare'], correctAnswer: 0, explanation: '"Abundant" means existing or available in large quantities; plentiful.', category: 'Verbal Ability', difficulty: 'Easy' },
      { question: 'Choose the word opposite in meaning (Antonym) to "TRANSPARENT".', options: ['Opaque', 'Clear', 'Lucid', 'Crystalline'], correctAnswer: 0, explanation: '"Transparent" means allowing light to pass through; "Opaque" means not transparent.', category: 'Verbal Ability', difficulty: 'Easy' },
      { question: 'Select the correctly spelled word.', options: ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'], correctAnswer: 0, explanation: 'The correct spelling is "Accommodation" (double c, double m).', category: 'Verbal Ability', difficulty: 'Easy' },
      { question: 'Identify the error in sentence: "Neither of the two candidates have submitted their resume."', options: ['have submitted', 'Neither of', 'the two candidates', 'their resume'], correctAnswer: 0, explanation: '"Neither" is singular, so it should take the singular verb "has submitted" instead of "have submitted".', category: 'Verbal Ability', difficulty: 'Medium' },
      { question: 'Fill in the blank: "She has been working on this AI project _____ 2024."', options: ['since', 'for', 'from', 'during'], correctAnswer: 0, explanation: 'Use "since" for a specific point in time in the past until now.', category: 'Verbal Ability', difficulty: 'Easy' },
      { question: 'Complete the idiom: "Bite the _____."', options: ['bullet', 'apple', 'stick', 'wire'], correctAnswer: 0, explanation: '"Bite the bullet" means to face a difficult situation with courage.', category: 'Verbal Ability', difficulty: 'Easy' },
      { question: 'Choose the correct passive voice: "The software engineer fixed the critical bug."', options: ['The critical bug was fixed by the software engineer.', 'The critical bug had fixed by the software engineer.', 'The software engineer was fixing the bug.', 'The bug is fixed by the engineer.'], correctAnswer: 0, explanation: 'Past simple active "fixed" converts to "was fixed" in passive voice.', category: 'Verbal Ability', difficulty: 'Medium' },
      { question: 'Choose the word that best fits: "The CEO gave a _____ speech that inspired the entire development team."', options: ['cogent', 'sluggish', 'dubious', 'futile'], correctAnswer: 0, explanation: '"Cogent" means clear, logical, and convincing.', category: 'Verbal Ability', difficulty: 'Hard' },

      // Data Interpretation (6)
      { question: 'In a company of 500 employees, 60% are engineers. Among engineers, 40% know Python. How many Python engineers are there?', options: ['120', '150', '180', '200'], correctAnswer: 0, explanation: 'Number of engineers = 60% of 500 = 300. Python engineers = 40% of 300 = 120.', category: 'Data Interpretation', difficulty: 'Easy' },
      { question: 'A pie chart shows Sales: Tech 40%, Marketing 25%, Operations 20%, HR 15%. If total budget is $200,000, what is Tech budget?', options: ['$80,000', '$75,000', '$60,000', '$90,000'], correctAnswer: 0, explanation: 'Tech budget = 40% of $200,000 = $80,000.', category: 'Data Interpretation', difficulty: 'Easy' },
      { question: 'Company revenue grew from $10 Million in 2024 to $15 Million in 2025. What was the percentage increase?', options: ['50%', '40%', '33.3%', '60%'], correctAnswer: 0, explanation: 'Growth = (15 - 10) / 10 * 100 = 5 / 10 * 100 = 50%.', category: 'Data Interpretation', difficulty: 'Easy' },
      { question: 'A bar graph indicates test scores of 4 batches: A(80), B(90), C(70), D(80). What is the mean score of all batches?', options: ['80', '75', '85', '82.5'], correctAnswer: 0, explanation: 'Mean = (80 + 90 + 70 + 80) / 4 = 320 / 4 = 80.', category: 'Data Interpretation', difficulty: 'Easy' },
      { question: 'If student pass percentage in 2023 was 75% out of 400 students and in 2024 was 80% out of 500 students, what is total passed count?', options: ['700', '650', '750', '680'], correctAnswer: 0, explanation: 'Passed 2023 = 75% of 400 = 300. Passed 2024 = 80% of 500 = 400. Total = 300 + 400 = 700.', category: 'Data Interpretation', difficulty: 'Medium' },
      { question: 'What is the ratio of Python developers (120) to Java developers (180)?', options: ['2:3', '3:2', '4:5', '1:2'], correctAnswer: 0, explanation: '120 : 180 simplifies by dividing by 60 to 2 : 3.', category: 'Data Interpretation', difficulty: 'Easy' }
    ];

    await AptitudeQuestion.insertMany(aptitudeData);
    console.log('[Seed] 30 Aptitude Questions seeded successfully.');

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETE FOR PLACEPREP AI');
    console.log(' Student Login Credentials: student@placeprep.ai / Student@123');
    console.log(' Admin Login Credentials:   admin@placeprep.ai / Admin@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
