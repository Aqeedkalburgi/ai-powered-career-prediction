import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'

const skills = [
  'Database_Fundamentals',
  'Computer_Architecture',
  'Distributed_Computing_Systems',
  'Cyber_Security',
  'Networking',
  'Software_Development',
  'Programming_Skills',
  'Project_Management',
  'Computer_Forensics_Fundamentals',
  'Technical_Communication',
  'AI_ML',
  'Software_Engineering',
  'Business_Analysis',
  'Communication_Skills',
  'Data_Science',
  'Troubleshooting_Skills',
  'Graphics_Designing'
]

const skillLabels = {
  'Database_Fundamentals': 'Database Fundamentals',
  'Computer_Architecture': 'Computer Architecture',
  'Distributed_Computing_Systems': 'Distributed Computing Systems',
  'Cyber_Security': 'Cyber Security',
  'Networking': 'Networking',
  'Software_Development': 'Software Development',
  'Programming_Skills': 'Programming Skills',
  'Project_Management': 'Project Management',
  'Computer_Forensics_Fundamentals': 'Computer Forensics Fundamentals',
  'Technical_Communication': 'Technical Communication',
  'AI_ML': 'AI/ML',
  'Software_Engineering': 'Software Engineering',
  'Business_Analysis': 'Business Analysis',
  'Communication_Skills': 'Communication Skills',
  'Data_Science': 'Data Science',
  'Troubleshooting_Skills': 'Troubleshooting Skills',
  'Graphics_Designing': 'Graphics Designing'
}

export default function Quiz() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(
    skills.reduce((acc, skill) => {
      acc[skill] = 4
      return acc
    }, {})
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (skill, value) => {
    setFormData(prev => ({
      ...prev,
      [skill]: parseInt(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Convert formData to match backend expectations
      const payload = {}
      Object.keys(formData).forEach(key => {
        payload[key] = formData[key]
      })

      // Update this URL to your backend endpoint
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const response = await axios.post(`${backendUrl}/predict`, payload)

      // Save to localStorage to pass to Results page
      localStorage.setItem('predictionResults', JSON.stringify({
        input: formData,
        predictions: response.data
      }))

      navigate('/results')
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err.response?.data?.error || 'Failed to get predictions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Career Quiz
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Rate your skills on a scale of 1-7 (1 = Beginner, 7 = Expert)
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <label className="block text-lg font-semibold text-gray-700">
                  {skillLabels[skill]}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({formData[skill]}/7)
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={formData[skill]}
                  onChange={(e) => handleChange(skill, e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((formData[skill] - 1) / 6) * 100}%, #e5e7eb ${((formData[skill] - 1) / 6) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Beginner (1)</span>
                  <span>Expert (7)</span>
                </div>
              </motion.div>
            ))}

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Predicting...' : 'Get My Career Prediction'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

