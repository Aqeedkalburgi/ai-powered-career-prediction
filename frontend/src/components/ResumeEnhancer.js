import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function ResumeEnhancer({ resume, onSave }) {
  const [resumeData, setResumeData] = useState(resume || {
    name: '',
    email: '',
    phone: '',
    experience: [],
    skills: [],
    education: {}
  });
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedResume, setEnhancedResume] = useState(null);

  const handleChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnhance = async () => {
    try {
      setEnhancing(true);
      const response = await axios.post(`${API_URL}/gemini/enhance-resume`, {
        resume: resumeData
      });

      if (response.data.success) {
        setEnhancedResume(response.data.enhancedResume);
      }
    } catch (error) {
      console.error('Error enhancing resume:', error);
      alert('Error enhancing resume');
    } finally {
      setEnhancing(false);
    }
  };

  const applyEnhancement = () => {
    if (enhancedResume && enhancedResume.raw) {
      // Try to parse if it's JSON
      try {
        const parsed = typeof enhancedResume === 'string' 
          ? JSON.parse(enhancedResume) 
          : enhancedResume;
        setResumeData(parsed);
      } catch {
        // If not JSON, just update the raw data
        setResumeData(prev => ({ ...prev, enhanced: enhancedResume.raw }));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={resumeData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={resumeData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
        <input
          type="text"
          value={Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : ''}
          onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
        <textarea
          value={JSON.stringify(resumeData.experience || [], null, 2)}
          onChange={(e) => {
            try {
              handleChange('experience', JSON.parse(e.target.value));
            } catch {
              // Invalid JSON, ignore
            }
          }}
          rows="4"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEnhance}
          disabled={enhancing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {enhancing ? 'Enhancing...' : '✨ Enhance with AI'}
        </button>
        <button
          onClick={() => onSave(resumeData)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          💾 Save
        </button>
      </div>

      {enhancedResume && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-green-800">Enhanced Resume</h3>
            <button
              onClick={applyEnhancement}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Apply
            </button>
          </div>
          <pre className="text-xs text-gray-700 overflow-auto max-h-40">
            {typeof enhancedResume === 'object' 
              ? JSON.stringify(enhancedResume, null, 2) 
              : enhancedResume}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ResumeEnhancer;



