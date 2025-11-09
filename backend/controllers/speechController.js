import speech from '@google-cloud/speech';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Initialize Speech-to-Text client
let speechClient;
try {
  if (process.env.SPEECH_TO_TEXT_API_KEY && process.env.TEST_MODE !== 'true') {
    speechClient = new speech.SpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || undefined,
    });
  }
} catch (error) {
  console.log('Speech-to-Text client not initialized (using test mode fallback)');
}

export async function transcribeAudio(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio file provided' });
    }

    if (!speechClient) {
      // Fallback for test mode - return mock transcription
      return res.json({
        success: true,
        transcript: '[Test Mode: Audio transcription would appear here]',
        testMode: true
      });
    }

    const audioBytes = fs.readFileSync(req.file.path).toString('base64');

    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      transcript: transcription || '[No speech detected]',
      testMode: process.env.TEST_MODE === 'true'
    });
  } catch (error) {
    console.error('Speech-to-Text Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      testMode: process.env.TEST_MODE === 'true'
    });
  }
}

