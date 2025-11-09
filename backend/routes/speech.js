import express from 'express';
import { transcribeAudio } from '../controllers/speechController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'temp/uploads/' });

router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router;

