import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function OverlayUI() {
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Request microphone access on mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => console.log('Microphone access granted'))
      .catch(err => console.error('Microphone access denied:', err));

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsListening(true);
      setTranscript('Listening...');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await axios.post(`${API_URL}/speech/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const transcribedText = response.data.transcript;
      setTranscript(transcribedText);
      setQuestion(transcribedText);

      if (transcribedText && !transcribedText.includes('[Test Mode')) {
        await generateAnswer(transcribedText);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscript('Error transcribing audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateAnswer = async (questionText) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/gemini/answer`, {
        question: questionText || question,
      });

      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error generating answer:', error);
      setAnswer('Error generating answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (question.trim()) {
      generateAnswer(question);
    }
  };

  return (
    <div className="overlay-container p-6 text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">AI Interview Assistant</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-gray-300">
                {isListening ? 'Listening...' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter question or click microphone..."
                  className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={isListening ? stopRecording : startRecording}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isListening
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isListening ? '⏹ Stop' : '🎤 Listen'}
                </button>
              </div>
            </div>

            {transcript && (
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Transcribed:</p>
                <p className="text-white">{transcript}</p>
              </div>
            )}

            <button
              onClick={handleManualSubmit}
              disabled={loading || !question.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? 'Generating Answer...' : 'Generate Answer'}
            </button>
          </div>

          {answer && (
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-lg p-4 border border-blue-700/50 fade-in">
              <h3 className="text-lg font-semibold text-white mb-2">AI Answer:</h3>
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>
          )}

          {loading && !answer && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-2 text-gray-300">Processing...</p>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-400 text-center">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+Shift+L</kbd> to toggle overlay
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverlayUI;



