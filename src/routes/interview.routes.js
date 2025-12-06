// routes/interview.routes.js
import express from "express";
import {
  scheduleInterview,
  get_scheduled_interviews,
  updateInterviewStatus,
  cancelInterview,
  getInterviewsByCandidate,
  getInterviewsByJob
} from "../controllers/interview.controller.js";

const router = express.Router();

// Interview Routes
router.post("/schedule", scheduleInterview);
router.get("/", get_scheduled_interviews);
router.put("/:id/status", updateInterviewStatus);
router.delete("/:id", cancelInterview);
router.get("/candidate/:candidateId", getInterviewsByCandidate);
router.get("/job/:jobId", getInterviewsByJob);

export default router;