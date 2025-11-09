import express from 'express';
import { generateAnswer, enhanceResume, generateJobPrep } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/answer', generateAnswer);
router.post('/enhance-resume', enhanceResume);
router.post('/job-prep', generateJobPrep);

export default router;

