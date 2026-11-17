const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ResumeAnalysis = require('../models/ResumeAnalysis');

// Fallback intelligent analyzer when Gemini API key is missing or fails
const generateFallbackAnalysis = (resumeText, targetJobTitle) => {
  const textLower = resumeText.toLowerCase();

  const commonTechSkills = [
    'java', 'python', 'javascript', 'c++', 'html', 'css', 'react', 'node.js',
    'express', 'mongodb', 'sql', 'git', 'github', 'dsa', 'oops', 'dbms', 'os', 'cn', 'rest api', 'docker', 'aws'
  ];

  const detectedSkills = [];
  commonTechSkills.forEach((skill) => {
    if (textLower.includes(skill.toLowerCase())) {
      detectedSkills.push(skill.toUpperCase());
    }
  });

  if (detectedSkills.length === 0) {
    detectedSkills.push('JAVA', 'PYTHON', 'DATA STRUCTURES', 'HTML/CSS');
  }

  const missingSkills = ['Docker', 'Kubernetes', 'System Design', 'CI/CD Pipelines', 'AWS / Cloud Services', 'TypeScript'].filter(
    (s) => !textLower.includes(s.toLowerCase())
  );

  const score = Math.min(95, Math.max(55, 60 + detectedSkills.length * 4));

  return {
    score,
    skillsDetected: detectedSkills,
    missingSkills: missingSkills.slice(0, 5),
    strengths: [
      'Strong foundational technical skills included in resume',
      'Clean project descriptions with clear tech stack',
      'Education and degree qualifications properly specified'
    ],
    weaknesses: [
      'Lack of quantifiable achievements (e.g., improved load time by 35%)',
      'Action verbs could be stronger at beginning of bullet points',
      'Missing cloud platforms and modern DevOps tools'
    ],
    formattingSuggestions: [
      'Use bullet points instead of long paragraphs for readability',
      'Ensure standard font sizes (10-12pt) and consistent margins',
      'Keep resume strictly to 1 page for entry-level engineering roles'
    ],
    contentSuggestions: [
      'Add GitHub links to key personal projects',
      'Highlight competitive programming or hackathon achievements',
      'Include metrics and impact numbers for each project'
    ],
    missingKeywords: ['System Design', 'Agile', 'Unit Testing', 'RESTful Services', 'CI/CD'],
    recommendedImprovements: [
      'Add 2-3 measurable bullet points per project experience',
      'Incorporate job-specific keywords from target JD into summary section',
      'Include direct links to live demo deployments or GitHub repos'
    ],
    jobMatchScore: Math.min(92, Math.max(50, score - 5))
  };
};

// @desc    Analyze uploaded resume using Gemini API
// @route   POST /api/resume/analyze
// @access  Private
exports.analyzeResume = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    const targetJobTitle = req.body.targetJobTitle || 'Software Engineer';
    const targetJobDescription = req.body.targetJobDescription || '';
    let fileName = 'Uploaded_Resume.txt';

    if (req.file) {
      fileName = req.file.originalname;
      const filePath = req.file.path;
      const fileExt = path.extname(fileName).toLowerCase();

      try {
        const fileBuffer = fs.readFileSync(filePath);
        if (fileExt === '.pdf') {
          const parsed = await pdfParse(fileBuffer);
          resumeText = parsed.text;
        } else if (fileExt === '.docx' || fileExt === '.doc') {
          const parsed = await mammoth.extractRawText({ buffer: fileBuffer });
          resumeText = parsed.value;
        } else {
          resumeText = fileBuffer.toString('utf-8');
        }

      } catch (err) {
        console.error('File parsing error:', err);
      } finally {
        // Remove temporary uploads even when the file is malformed or cannot be parsed.
        fs.unlink(filePath, () => {});
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract text from resume. Please upload a valid PDF/DOCX file or paste resume text.',
      });
    }

    let analysisResult;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
You are an expert AI Resume Reviewer and Technical Recruiter for top tech companies.
Analyze the following student resume for a target job role: "${targetJobTitle}".
Target Job Description (if provided): "${targetJobDescription}"

Resume Content:
"""
${resumeText.substring(0, 4000)}
"""

Provide your evaluation strictly as a VALID JSON object with NO markdown formatting around it (do not wrap in \`\`\`json). The JSON must strictly adhere to this format:

{
  "score": <number 0-100 indicating AI Resume Compatibility Score>,
  "skillsDetected": [<array of string skills found>],
  "missingSkills": [<array of key missing technical skills for ${targetJobTitle}>],
  "strengths": [<array of 3 distinct strengths>],
  "weaknesses": [<array of 3 distinct areas to improve>],
  "formattingSuggestions": [<array of 3 formatting tips>],
  "contentSuggestions": [<array of 3 content bullet tips>],
  "missingKeywords": [<array of 4 key industry keywords missing>],
  "recommendedImprovements": [<array of 3 action steps>],
  "jobMatchScore": <number 0-100 match with target JD or industry average>
}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        analysisResult = JSON.parse(cleanedText);
      } catch (aiErr) {
        console.error('Gemini API Error (fallback used):', aiErr.message);
        analysisResult = generateFallbackAnalysis(resumeText, targetJobTitle);
      }
    } else {
      analysisResult = generateFallbackAnalysis(resumeText, targetJobTitle);
    }

    // Save to database
    const savedAnalysis = await ResumeAnalysis.create({
      userId: req.user._id,
      resumeFileName: fileName,
      targetJobTitle,
      score: analysisResult.score || 75,
      skillsDetected: analysisResult.skillsDetected || [],
      missingSkills: analysisResult.missingSkills || [],
      strengths: analysisResult.strengths || [],
      weaknesses: analysisResult.weaknesses || [],
      formattingSuggestions: analysisResult.formattingSuggestions || [],
      contentSuggestions: analysisResult.contentSuggestions || [],
      missingKeywords: analysisResult.missingKeywords || [],
      recommendedImprovements: analysisResult.recommendedImprovements || [],
      jobMatchScore: analysisResult.jobMatchScore || 70,
    });

    return res.json({
      success: true,
      analysis: savedAnalysis,
    });
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze resume: ' + error.message,
    });
  }
};

// @desc    Get user's previous resume analyses
// @route   GET /api/resume/history
// @access  Private
exports.getResumeHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);
    return res.json({ success: true, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
