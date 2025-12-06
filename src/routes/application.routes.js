import express from 'express';
const router = express.Router();

import {
  applyToJob,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
  getShortlistedCandidates,
  getApplications,
  getShortlistedApplications
} from '../controllers/application.controller.js';

import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

// 🟢 APPLY TO JOB
router.post('/apply', upload.single('resume'), auth, applyToJob);

router.get('/', auth, getApplications);

router.get('/shortlisted', auth, getShortlistedApplications);


router.get('/:id', auth, getApplicationById);


router.put("/:id/status", auth, updateApplicationStatus);

export default router;
