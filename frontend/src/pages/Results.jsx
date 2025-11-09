import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import confetti from 'canvas-confetti'
import { saveToFirebase } from '../firebase'
import { roadmaps as roadmapData } from '../data/roadmapData'

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// Role icons mapping
const roleIcons = {
  'Data Scientist': '📊',
  'Software Engineer': '💻',
  'AI ML Engineer': '🤖',
  'Data Analyst': '📈',
  'Cyber Security Analyst': '🔒',
  'Cloud Engineer': '☁️',
  'Networking Engineer': '🌐',
  'Full Stack Developer': '🚀',
  'Business Analyst': '📋',
  'Project Manager': '📅',
  'Graphics Designer': '🎨',
  'Software Tester': '🧪',
  'DevOps Engineer': '⚙️',
  'AI Researcher': '🔬',
  'Database Administrator': '🗄️',
  'UI/UX Designer': '🎭',
  'IT Support Engineer': '🛠️'
}

// Role information data
const roleInfo = {
  'Data Scientist': {
    description: 'Analyze complex data to help organizations make data-driven decisions using statistical methods and machine learning.',
    salary: '₹12-25 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '35% growth expected',
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization']
  },
  'Software Engineer': {
    description: 'Design, develop, and maintain software applications and systems using programming languages and software engineering principles.',
    salary: '₹8-20 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '22% growth expected',
    skills: ['Programming', 'Algorithms', 'System Design', 'Testing', 'Debugging']
  },
  'AI ML Engineer': {
    description: 'Build and deploy AI/ML models to solve complex problems using deep learning, neural networks, and advanced algorithms.',
    salary: '₹15-30 LPA',
    demand: 'Very High',
    demandColor: 'bg-emerald-100 text-emerald-800',
    growth: '40% growth expected',
    skills: ['Python', 'TensorFlow', 'Deep Learning', 'Neural Networks', 'MLOps']
  },
  'Data Analyst': {
    description: 'Interpret data to identify trends and insights that help businesses make informed decisions.',
    salary: '₹6-15 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '25% growth expected',
    skills: ['Excel', 'SQL', 'Data Visualization', 'Statistics', 'Business Intelligence']
  },
  'Cyber Security Analyst': {
    description: 'Protect organizations from cyber threats by monitoring systems, detecting vulnerabilities, and implementing security measures.',
    salary: '₹8-18 LPA',
    demand: 'Very High',
    demandColor: 'bg-emerald-100 text-emerald-800',
    growth: '33% growth expected',
    skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Incident Response', 'Security Tools']
  },
  'Cloud Engineer': {
    description: 'Design, deploy, and manage cloud infrastructure and services on platforms like AWS, Azure, or GCP.',
    salary: '₹10-22 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '28% growth expected',
    skills: ['Cloud Platforms', 'DevOps', 'Containerization', 'Infrastructure as Code', 'Monitoring']
  },
  'Networking Engineer': {
    description: 'Design, implement, and maintain network infrastructure to ensure reliable connectivity and performance.',
    salary: '₹7-16 LPA',
    demand: 'Moderate',
    demandColor: 'bg-yellow-100 text-yellow-800',
    growth: '18% growth expected',
    skills: ['Network Protocols', 'Routing', 'Switching', 'Network Security', 'Troubleshooting']
  },
  'Full Stack Developer': {
    description: 'Develop both frontend and backend components of web applications, working with databases, servers, and client interfaces.',
    salary: '₹8-20 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '23% growth expected',
    skills: ['JavaScript', 'React', 'Node.js', 'Databases', 'API Development']
  },
  'Business Analyst': {
    description: 'Bridge the gap between business needs and technical solutions by analyzing requirements and processes.',
    salary: '₹6-14 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '20% growth expected',
    skills: ['Requirements Analysis', 'Data Analysis', 'Process Mapping', 'Stakeholder Management', 'Documentation']
  },
  'Project Manager': {
    description: 'Lead and coordinate projects to ensure timely delivery within budget while managing teams and stakeholders.',
    salary: '₹10-22 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '15% growth expected',
    skills: ['Project Planning', 'Risk Management', 'Team Leadership', 'Agile/Scrum', 'Communication']
  },
  'Graphics Designer': {
    description: 'Create visual concepts and designs for branding, marketing materials, and digital media.',
    salary: '₹4-12 LPA',
    demand: 'Moderate',
    demandColor: 'bg-yellow-100 text-yellow-800',
    growth: '12% growth expected',
    skills: ['Adobe Creative Suite', 'Design Principles', 'Typography', 'Color Theory', 'Branding']
  },
  'Software Tester': {
    description: 'Ensure software quality by designing test cases, executing tests, and identifying bugs and issues.',
    salary: '₹5-12 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '20% growth expected',
    skills: ['Test Planning', 'Automation Testing', 'Bug Tracking', 'Quality Assurance', 'Test Cases']
  },
  'DevOps Engineer': {
    description: 'Streamline software development and deployment through automation, CI/CD pipelines, and infrastructure management.',
    salary: '₹10-24 LPA',
    demand: 'Very High',
    demandColor: 'bg-emerald-100 text-emerald-800',
    growth: '30% growth expected',
    skills: ['CI/CD', 'Docker', 'Kubernetes', 'Infrastructure as Code', 'Monitoring']
  },
  'AI Researcher': {
    description: 'Conduct research to advance AI technologies, develop new algorithms, and publish findings in academic journals.',
    salary: '₹15-35 LPA',
    demand: 'Moderate',
    demandColor: 'bg-yellow-100 text-yellow-800',
    growth: '25% growth expected',
    skills: ['Research', 'Machine Learning', 'Algorithm Development', 'Academic Writing', 'Mathematics']
  },
  'Database Administrator': {
    description: 'Manage and maintain database systems to ensure data integrity, security, and optimal performance.',
    salary: '₹8-16 LPA',
    demand: 'Moderate',
    demandColor: 'bg-yellow-100 text-yellow-800',
    growth: '18% growth expected',
    skills: ['Database Design', 'SQL', 'Backup & Recovery', 'Performance Tuning', 'Security']
  },
  'UI/UX Designer': {
    description: 'Design user interfaces and experiences that are intuitive, accessible, and visually appealing.',
    salary: '₹6-15 LPA',
    demand: 'High',
    demandColor: 'bg-green-100 text-green-800',
    growth: '22% growth expected',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing']
  },
  'IT Support Engineer': {
    description: 'Provide technical support to users, troubleshoot issues, and maintain IT infrastructure and systems.',
    salary: '₹4-10 LPA',
    demand: 'Moderate',
    demandColor: 'bg-yellow-100 text-yellow-800',
    growth: '10% growth expected',
    skills: ['Troubleshooting', 'Hardware Support', 'Software Support', 'Customer Service', 'System Administration']
  }
}

// Resources data
const resources = {
  'Data Scientist': {
    courses: [
      { title: 'Python for Data Science - Coursera', url: 'https://www.coursera.org/specializations/python' },
      { title: 'Machine Learning Course - Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning' },
      { title: 'Data Science Bootcamp - Udemy', url: 'https://www.udemy.com/topic/data-science/' }
    ],
    projects: [
      { title: 'Predictive Analytics Project', url: 'https://github.com/topics/data-science' },
      { title: 'Customer Segmentation Analysis', url: 'https://github.com/topics/classification' },
      { title: 'Time Series Forecasting', url: 'https://github.com/topics/time-series' }
    ],
    tips: [
      'Practice with real datasets from Kaggle to build your portfolio',
      'Focus on understanding statistical concepts, not just coding',
      'Learn to communicate insights effectively to non-technical stakeholders',
      'Stay updated with latest ML research papers and trends',
      'Build end-to-end projects that showcase your full skill set'
    ],
    mistakes: [
      'Skipping data cleaning and preprocessing steps',
      'Overfitting models without proper validation',
      'Not documenting your analysis and code',
      'Ignoring business context when building models',
      'Not keeping up with new tools and frameworks'
    ]
  },
  'Software Engineer': {
    courses: [
      { title: 'Complete Web Development Bootcamp', url: 'https://www.udemy.com/topic/web-development/' },
      { title: 'Data Structures & Algorithms - Coursera', url: 'https://www.coursera.org/specializations/data-structures-algorithms' },
      { title: 'System Design Interview Prep', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' }
    ],
    projects: [
      { title: 'Full Stack Web Application', url: 'https://github.com/topics/full-stack' },
      { title: 'REST API Development', url: 'https://github.com/topics/rest-api' },
      { title: 'Microservices Architecture', url: 'https://github.com/topics/microservices' }
    ],
    tips: [
      'Master one programming language deeply before learning others',
      'Practice coding problems daily on platforms like LeetCode',
      'Contribute to open source projects to gain real-world experience',
      'Learn version control (Git) and collaborative development',
      'Focus on writing clean, maintainable, and well-documented code'
    ],
    mistakes: [
      'Not writing unit tests for your code',
      'Ignoring code reviews and best practices',
      'Not learning design patterns and system design',
      'Skipping documentation and comments',
      'Not keeping up with industry trends and technologies'
    ]
  },
  'AI ML Engineer': {
    courses: [
      { title: 'Deep Learning Specialization - Coursera', url: 'https://www.coursera.org/specializations/deep-learning' },
      { title: 'TensorFlow Developer Certificate', url: 'https://www.tensorflow.org/certificate' },
      { title: 'Fast.ai Practical Deep Learning', url: 'https://www.fast.ai/' }
    ],
    projects: [
      { title: 'Image Classification Model', url: 'https://github.com/topics/image-classification' },
      { title: 'Natural Language Processing Project', url: 'https://github.com/topics/nlp' },
      { title: 'Reinforcement Learning Agent', url: 'https://github.com/topics/reinforcement-learning' }
    ],
    tips: [
      'Understand the mathematics behind ML algorithms, not just implementations',
      'Practice with frameworks like TensorFlow and PyTorch',
      'Learn MLOps for production deployment',
      'Stay updated with latest research papers on arXiv',
      'Build projects that solve real-world problems'
    ],
    mistakes: [
      'Using complex models when simple ones would suffice',
      'Not properly handling data preprocessing and feature engineering',
      'Ignoring model interpretability and explainability',
      'Not testing models on diverse datasets',
      'Deploying models without proper monitoring and maintenance'
    ]
  }
}

// Default resources for roles not in the resources object
const getDefaultResources = (role) => ({
  courses: [
    { title: `${role} Fundamentals Course`, url: 'https://www.coursera.org' },
    { title: 'Advanced Topics in ' + role, url: 'https://www.udemy.com' },
    { title: role + ' Certification Program', url: 'https://www.edx.org' }
  ],
  projects: [
    { title: `${role} Project 1`, url: 'https://github.com' },
    { title: `${role} Project 2`, url: 'https://github.com' },
    { title: `${role} Project 3`, url: 'https://github.com' }
  ],
  tips: [
    'Build a strong portfolio with real projects',
    'Network with professionals in your field',
    'Stay updated with industry trends',
    'Practice regularly to improve your skills',
    'Seek mentorship and feedback'
  ],
  mistakes: [
    'Not practicing enough',
    'Ignoring industry trends',
    'Not building a portfolio',
    'Skipping networking opportunities',
    'Not seeking feedback and improvement'
  ]
})

// Skill labels for visualization
const skillLabels = {
  'Database_Fundamentals': 'DB Fundamentals',
  'Computer_Architecture': 'Computer Arch',
  'Distributed_Computing_Systems': 'Distributed Systems',
  'Cyber_Security': 'Cyber Security',
  'Networking': 'Networking',
  'Software_Development': 'Software Dev',
  'Programming_Skills': 'Programming',
  'Project_Management': 'Project Mgmt',
  'Computer_Forensics_Fundamentals': 'Forensics',
  'Technical_Communication': 'Tech Comm',
  'AI_ML': 'AI/ML',
  'Software_Engineering': 'Software Eng',
  'Business_Analysis': 'Business Analysis',
  'Communication_Skills': 'Communication',
  'Data_Science': 'Data Science',
  'Troubleshooting_Skills': 'Troubleshooting',
  'Graphics_Designing': 'Graphics Design'
}

export default function Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [expandedPhases, setExpandedPhases] = useState({})
  const roadmapRef = useRef(null)
  const [confettiFired, setConfettiFired] = useState(false)

  useEffect(() => {
    const storedResults = localStorage.getItem('predictionResults')
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setResults(parsedResults)
      const topRole = parsedResults.predictions.top_k[0].role
      setSelectedRole(topRole)
      
      // Initialize expanded phases (all expanded by default)
      const initialRoadmap = roadmapData[topRole] || parsedResults.predictions.roadmap
      if (initialRoadmap) {
        const phases = Object.keys(initialRoadmap)
        const initialExpanded = {}
        phases.forEach(phase => {
          initialExpanded[phase] = true
        })
        setExpandedPhases(initialExpanded)
      }
      
      // Fire confetti on load
      if (!confettiFired) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        setConfettiFired(true)
      }
    } else {
      navigate('/quiz')
    }
  }, [navigate, confettiFired])

  const handleFeedbackSubmit = async () => {
    if (results) {
      const dataToSave = {
        input: results.input,
        prediction: results.predictions.top_k,
        selectedRole: selectedRole,
        feedback: feedback.trim() || "No feedback provided"
      }
      
      try {
        await saveToFirebase(dataToSave)
        setFeedbackSubmitted(true)
      } catch (error) {
        console.error('Error saving feedback:', error)
        if (error.message && (error.message.includes('Firebase') || error.message.includes('not configured'))) {
          console.warn('Firebase not configured. Skipping save.')
          setFeedbackSubmitted(true)
        } else {
          console.error('Failed to save feedback:', error)
          setFeedbackSubmitted(true)
        }
      }
    }
  }

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: prev[phase] === false ? true : false
    }))
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    // Reset expanded phases for new role (all expanded by default)
    const roleRoadmap = roadmapData[role] || results.predictions.roadmap
    if (roleRoadmap) {
      const phases = Object.keys(roleRoadmap)
      const newExpanded = {}
      phases.forEach(phase => {
        newExpanded[phase] = true // All expanded by default
      })
      setExpandedPhases(newExpanded)
    }
    setTimeout(() => {
      roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Generate AI insight based on user skills
  const generateInsight = (role, userInput) => {
    const roleInfoData = roleInfo[role]
    if (!roleInfoData) return "Your skills align well with this career path."

    const highSkills = Object.entries(userInput)
      .filter(([_, value]) => value >= 6)
      .map(([key, _]) => key)
      .slice(0, 3)

    if (role === 'Data Scientist' && (highSkills.includes('Data_Science') || highSkills.includes('AI_ML'))) {
      return "You have strong analytical and technical skills in data science and AI — perfect foundation for a Data Science career. Your high ratings in data-related skills show great potential."
    }
    if (role === 'Software Engineer' && highSkills.includes('Programming_Skills')) {
      return "Your strengths in Programming and Software Development make you an ideal Software Engineer. Your technical foundation is solid."
    }
    if (role === 'Full Stack Developer' && (highSkills.includes('Software_Development') || highSkills.includes('Programming_Skills'))) {
      return "Your balanced skills in both frontend and backend development make you a great fit for Full Stack Development."
    }
    if (role === 'AI ML Engineer' && highSkills.includes('AI_ML')) {
      return "Your strong interest and skills in AI/ML indicate excellent potential for becoming an AI ML Engineer."
    }

    const skillNames = highSkills.map(skill => skillLabels[skill] || skill).join(', ')
    return `Your high ratings in ${skillNames} align perfectly with the requirements for ${role}. You have a strong foundation to excel in this field.`
  }

  // Get top 3 strongest skills
  const getTopSkills = (userInput) => {
    return Object.entries(userInput)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => ({
        name: skillLabels[key] || key,
        value: value
      }))
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl"
        >
          Loading results...
        </motion.div>
      </div>
    )
  }

  const { top_k, roadmap: backendRoadmap } = results.predictions
  const topRole = top_k[0]
  // Use roadmap from backend if available, otherwise use frontend roadmap data
  const roadmap = selectedRole ? (roadmapData[selectedRole] || backendRoadmap) : backendRoadmap
  const currentRoleInfo = roleInfo[selectedRole] || {}
  const currentResources = resources[selectedRole] || getDefaultResources(selectedRole)
  const insight = generateInsight(selectedRole, results.input)
  const topSkills = getTopSkills(results.input)

  // Prepare chart data
  const chartData = {
    labels: Object.keys(results.input).map(key => skillLabels[key] || key),
    datasets: [{
      label: 'Your Skill Profile',
      data: Object.values(results.input),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      pointBackgroundColor: 'rgb(99, 102, 241)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(99, 102, 241)'
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 7,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            🎉 Your Career Predictions
          </h1>
          <p className="text-xl text-gray-600">
            Based on your skills, here are your top career matches
          </p>
        </motion.div>

        {/* Top 3 Predictions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {top_k.map((prediction, index) => {
            const isSelected = selectedRole === prediction.role
            const info = roleInfo[prediction.role] || {}
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-2xl shadow-xl p-6 border-2 transition-all ${
                  isSelected ? 'border-indigo-500 ring-4 ring-indigo-200' : 'border-gray-100 hover:shadow-2xl'
                } ${index === 0 ? 'md:scale-105' : ''}`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{roleIcons[prediction.role] || '💼'}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {prediction.role}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Confidence: {Math.round(prediction.probability * 100)}%</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.probability * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                    />
                  </div>

                  <button
                    onClick={() => handleRoleSelect(prediction.role)}
                    className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                  >
                    {isSelected ? '✓ Viewing Roadmap' : 'Explore Roadmap'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Why This Career Fits You - Top Skills Summary */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-indigo-500"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Career Fits You</h2>
            <p className="text-gray-700 mb-4">{insight}</p>
            <div className="flex flex-wrap gap-3">
              {topSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {skill.name}: {skill.value}/7
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Role Information Panel */}
        {selectedRole && currentRoleInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            ref={roadmapRef}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">{roleIcons[selectedRole] || '💼'}</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedRole}</h2>
                <p className="text-gray-600 text-lg">{currentRoleInfo.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold">
                💰 Avg Salary: {currentRoleInfo.salary}
              </span>
              <span className={`${currentRoleInfo.demandColor} px-4 py-2 rounded-full font-semibold`}>
                📈 {currentRoleInfo.demand} Demand
              </span>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                🚀 {currentRoleInfo.growth}
              </span>
            </div>

            {currentRoleInfo.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentRoleInfo.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-l-4 border-indigo-500">
              <h3 className="font-semibold text-lg mb-2 text-indigo-700">🤖 AI Insight: Why You Fit</h3>
              <p className="text-gray-700">{insight}</p>
            </div>
          </motion.div>
        )}

        {/* Skill Visualization */}
        {results.input && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Skill Profile Visualization</h2>
            <p className="text-gray-600 mb-6">Visualize your skill strengths based on your quiz responses.</p>
            <div className="max-w-2xl mx-auto">
              <Radar data={chartData} options={chartOptions} />
            </div>
          </motion.div>
        )}

        {/* Detailed Roadmap */}
        {selectedRole && roadmap && Object.keys(roadmap).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Career Roadmap for {selectedRole}
            </h2>
            <div className="space-y-4">
              {Object.entries(roadmap).map(([phase, items], index) => {
                // Default to expanded (true) if not explicitly set to false
                const isExpanded = expandedPhases[phase] !== false
                const phaseIcons = ['📚', '🚀', '💼', '🎯']
                
                return (
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => togglePhase(phase)}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-indigo-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{phaseIcons[index] || '📋'}</span>
                        <h3 className="text-lg font-semibold text-indigo-700">
                          Phase {index + 1}: {phase}
                        </h3>
                      </div>
                      <span className="text-indigo-600 text-xl">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <ul className="p-5 pt-0 space-y-3">
                            {items.map((item, itemIndex) => (
                              <motion.li
                                key={itemIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: itemIndex * 0.05 }}
                                className="text-gray-700 flex items-start"
                              >
                                <span className="text-indigo-500 mr-3 mt-1">✓</span>
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Additional Sections */}
        {selectedRole && (
          <div className="space-y-8 mb-8">
            {/* Recommended Resources */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                🎓 Recommended Resources
              </h2>
              <div className="space-y-3">
                {currentResources.courses.map((course, idx) => (
                  <motion.a
                    key={idx}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="block text-indigo-600 hover:text-indigo-800 underline flex items-center gap-2"
                  >
                    <span>→</span>
                    {course.title}
                  </motion.a>
                ))}
              </div>
            </motion.section>

            {/* Sample Projects */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                🧩 Sample Projects
              </h2>
              <div className="space-y-3">
                {currentResources.projects.map((project, idx) => (
                  <motion.a
                    key={idx}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="block text-indigo-600 hover:text-indigo-800 underline flex items-center gap-2"
                  >
                    <span>→</span>
                    {project.title}
                  </motion.a>
                ))}
              </div>
            </motion.section>

            {/* AI Growth Tips */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                🧠 AI Growth Tips
              </h2>
              <ul className="space-y-3">
                {currentResources.tips.map((tip, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-gray-700 flex items-start"
                  >
                    <span className="text-indigo-500 mr-3 mt-1">💡</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            {/* Common Mistakes to Avoid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                ⚠️ Common Mistakes to Avoid
              </h2>
              <ul className="space-y-3">
                {currentResources.mistakes.map((mistake, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-gray-700 flex items-start"
                  >
                    <span className="text-red-500 mr-3 mt-1">✗</span>
                    <span>{mistake}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          </div>
        )}

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Share Your Feedback (Optional)
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Help us improve by sharing your thoughts about the predictions
          </p>
          {feedbackSubmitted ? (
            <>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Thank you for your feedback!
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Take Quiz Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think about your career predictions... (Optional)"
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={handleFeedbackSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {feedback.trim() ? 'Submit Feedback' : 'Skip Feedback'}
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Take Quiz Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
