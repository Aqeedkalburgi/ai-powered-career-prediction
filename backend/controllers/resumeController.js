import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, '../../temp');

async function ensureTempDir() {
  try {
    await fs.mkdir(tempDir, { recursive: true });
  } catch (err) {
    // Directory already exists
  }
}

export async function getResume(req, res) {
  try {
    await ensureTempDir();
    const resumePath = path.join(tempDir, 'resume.json');
    
    try {
      const data = await fs.readFile(resumePath, 'utf-8');
      res.json({ success: true, resume: JSON.parse(data) });
    } catch (err) {
      // Return default resume if file doesn't exist
      const defaultResume = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        experience: [
          {
            title: 'Software Engineer',
            company: 'Tech Corp',
            duration: '2020 - Present',
            description: 'Developed web applications using React and Node.js'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        education: {
          degree: 'B.S. Computer Science',
          university: 'University of Technology',
          year: '2020'
        }
      };
      res.json({ success: true, resume: defaultResume });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function saveResume(req, res) {
  try {
    await ensureTempDir();
    const resumePath = path.join(tempDir, 'resume.json');
    await fs.writeFile(resumePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Resume saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getJobData(req, res) {
  try {
    await ensureTempDir();
    const jobPath = path.join(tempDir, 'jobdata.json');
    
    try {
      const data = await fs.readFile(jobPath, 'utf-8');
      res.json({ success: true, jobData: JSON.parse(data) });
    } catch (err) {
      // Return default job data if file doesn't exist
      const defaultJob = {
        title: 'Senior Software Engineer',
        company: 'Tech Startup',
        description: 'We are looking for an experienced software engineer to join our team.',
        requirements: [
          '3+ years of experience with React',
          'Strong JavaScript skills',
          'Experience with Node.js',
          'Good communication skills'
        ],
        location: 'Remote',
        salary: '$100k - $150k'
      };
      res.json({ success: true, jobData: defaultJob });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function saveJobData(req, res) {
  try {
    await ensureTempDir();
    const jobPath = path.join(tempDir, 'jobdata.json');
    await fs.writeFile(jobPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Job data saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

