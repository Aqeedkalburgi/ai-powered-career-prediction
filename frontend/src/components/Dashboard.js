import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumeEnhancer from './ResumeEnhancer';
import JobPrep from './JobPrep';
import PaymentButton from './PaymentButton';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [resume, setResume] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resumeRes, jobRes] = await Promise.all([
        axios.get(`${API_URL}/resume/resume`),
        axios.get(`${API_URL}/resume/job`)
      ]);
      setResume(resumeRes.data.resume);
      setJobData(jobRes.data.jobData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (updatedResume) => {
    try {
      await axios.post(`${API_URL}/resume/resume`, updatedResume);
      setResume(updatedResume);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume');
    }
  };

  const saveJobData = async (updatedJobData) => {
    try {
      await axios.post(`${API_URL}/resume/job`, updatedJobData);
      setJobData(updatedJobData);
      alert('Job data saved successfully!');
    } catch (error) {
      console.error('Error saving job data:', error);
      alert('Error saving job data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Interview Assistant
          </h1>
          <p className="text-gray-600">
            Test Mode Active • Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Shift+L</kbd> to toggle overlay
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Your Resume
            </h2>
            <ResumeEnhancer resume={resume} onSave={saveResume} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Job Description
            </h2>
            <JobPrep jobData={jobData} onSave={saveJobData} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Test Payment (Razorpay Test Mode)
          </h2>
          <PaymentButton />
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Test Mode:</strong> All features are running in test mode. No charges will be made. 
            Firebase is using local emulator. Payments are simulated.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;



