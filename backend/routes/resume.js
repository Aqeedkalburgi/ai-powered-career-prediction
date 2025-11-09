import express from 'express';
import { getResume, saveResume, getJobData, saveJobData } from '../controllers/resumeController.js';

const router = express.Router();

router.get('/resume', getResume);
router.post('/resume', saveResume);
router.get('/job', getJobData);
router.post('/job', saveJobData);

export default router;

