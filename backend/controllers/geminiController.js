import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateAnswer(req, res) {
  try {
    const { question } = req.body;
    
    // Load resume and job data from temp folder
    const resumePath = path.join(__dirname, '../../temp/resume.json');
    const jobPath = path.join(__dirname, '../../temp/jobdata.json');
    
    let resume = {};
    let jobDesc = {};
    
    try {
      const resumeData = await fs.readFile(resumePath, 'utf-8');
      resume = JSON.parse(resumeData);
    } catch (err) {
      console.log('No resume data found, using default');
    }
    
    try {
      const jobData = await fs.readFile(jobPath, 'utf-8');
      jobDesc = JSON.parse(jobData);
    } catch (err) {
      console.log('No job data found, using default');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `You are an AI interview assistant. Based on the following resume and job description, provide a concise, professional answer to this interview question.

Resume: ${JSON.stringify(resume, null, 2)}
Job Description: ${JSON.stringify(jobDesc, null, 2)}

Interview Question: ${question}

Provide a clear, structured answer that:
1. Directly addresses the question
2. References relevant experience from the resume
3. Aligns with the job requirements
4. Is concise (2-3 sentences)

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      answer: text,
      testMode: process.env.TEST_MODE === 'true'
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      testMode: process.env.TEST_MODE === 'true'
    });
  }
}

export async function enhanceResume(req, res) {
  try {
    const { resume } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `You are a professional resume enhancer. Review and improve the following resume. Make it more impactful, highlight achievements, and ensure it follows best practices.

Original Resume:
${JSON.stringify(resume, null, 2)}

Provide an improved version with:
1. Better action verbs
2. Quantified achievements
3. Clearer structure
4. Enhanced descriptions

Return the enhanced resume as JSON with the same structure.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from response
    let enhancedResume;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        enhancedResume = JSON.parse(jsonMatch[0]);
      } else {
        enhancedResume = { raw: text };
      }
    } catch {
      enhancedResume = { raw: text };
    }

    res.json({ 
      success: true, 
      enhancedResume,
      testMode: process.env.TEST_MODE === 'true'
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

export async function generateJobPrep(req, res) {
  try {
    const { jobDescription } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `Generate 5 interview questions and answers based on this job description. Make them realistic and relevant.

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Provide:
1. 5 relevant interview questions
2. For each question, provide a sample answer
3. Format as JSON array with {question, answer} objects

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON array
    let questions;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = [{ question: 'Error parsing response', answer: text }];
      }
    } catch {
      questions = [{ question: 'Error parsing response', answer: text }];
    }

    res.json({ 
      success: true, 
      questions,
      testMode: process.env.TEST_MODE === 'true'
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

