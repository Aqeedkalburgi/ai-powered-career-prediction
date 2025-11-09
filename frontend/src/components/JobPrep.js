import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function JobPrep({ jobData, onSave }) {
  const [job, setJob] = useState(jobData || {
    title: '',
    company: '',
    description: '',
    requirements: [],
    location: '',
    salary: ''
  });
  const [preparing, setPreparing] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleChange = (field, value) => {
    setJob(prev => ({ ...prev, [field]: value }));
  };

  const handleJobPrep = async () => {
    try {
      setPreparing(true);
      const response = await axios.post(`${API_URL}/gemini/job-prep`, {
        jobDescription: job
      });

      if (response.data.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Error preparing job questions:', error);
      alert('Error generating job prep questions');
    } finally {
      setPreparing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
        <input
          type="text"
          value={job.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <input
          type="text"
          value={job.company || ''}
          onChange={(e) => handleChange('company', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={job.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label>
        <input
          type="text"
          value={Array.isArray(job.requirements) ? job.requirements.join(', ') : ''}
          onChange={(e) => handleChange('requirements', e.target.value.split(',').map(s => s.trim()))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleJobPrep}
          disabled={preparing}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {preparing ? 'Generating...' : '🎯 Generate Interview Questions'}
        </button>
        <button
          onClick={() => onSave(job)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          💾 Save
        </button>
      </div>

      {questions.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-purple-800 mb-2">Generated Interview Questions:</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-purple-100">
              <p className="font-medium text-gray-800 mb-1">Q{idx + 1}: {q.question || 'Question'}</p>
              <p className="text-sm text-gray-600">{q.answer || 'Answer'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobPrep;



