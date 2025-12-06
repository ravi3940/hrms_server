import Interview from "../models/Interview.model.js";
import Application from "../models/Application.model.js";

// ✅ SCHEDULE NEW INTERVIEW
export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewType,
      date,
      time,
      interviewer,
    } = req.body;

    // 🔥 Validate required fields
    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "applicationId is required",
      });
    }

    // Find the application to get candidateId and jobId
    const application = await Application.findById(applicationId)
      .populate('userId', 'name email')
      .populate('jobId', 'title department');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const interview = await Interview.create({
      applicationId,
      candidateId: application.userId._id, // Get from application
      jobId: application.jobId._id, // Get from application
      interviewType,
      date,
      time,
      interviewer,
      status: "Scheduled" // Default status
    });

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview,
    });

  } catch (err) {
    console.error("INTERVIEW-SCHEDULE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
      error: err.message
    });
  }
};

// ✅ GET ALL SCHEDULED INTERVIEWS
export const get_scheduled_interviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("candidateId", "name email phone")
      .populate("jobId", "title department")
      .populate("applicationId", "status");

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });

  } catch (error) {
    console.error("INTERVIEW FETCH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load scheduled interviews",
      error: error.message,
    });
  }
};

// ✅ UPDATE INTERVIEW STATUS
export const updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Scheduled", "Pending", "Selected", "Next_Round", "Rejected", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const interview = await Interview.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
    .populate("candidateId", "name email phone")
    .populate("jobId", "title department")
    .populate("applicationId", "status");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview status updated successfully",
      interview,
    });

  } catch (error) {
    console.error("INTERVIEW STATUS UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update interview status",
      error: error.message,
    });
  }
};

// ✅ DELETE/CANCEL INTERVIEW
export const cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findByIdAndDelete(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully",
    });

  } catch (error) {
    console.error("INTERVIEW CANCELLATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel interview",
      error: error.message,
    });
  }
};

// ✅ GET INTERVIEWS BY CANDIDATE ID (Optional - useful for candidate dashboard)
export const getInterviewsByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const interviews = await Interview.find({ candidateId })
      .populate("jobId", "title company department")
      .populate("applicationId", "status")
      .sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });

  } catch (error) {
    console.error("CANDIDATE INTERVIEWS FETCH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load candidate interviews",
      error: error.message,
    });
  }
};

// ✅ GET INTERVIEWS BY JOB ID (Optional - useful for job-specific interviews)
export const getInterviewsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const interviews = await Interview.find({ jobId })
      .populate("candidateId", "name email phone")
      .populate("applicationId", "status")
      .sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });

  } catch (error) {
    console.error("JOB INTERVIEWS FETCH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load job interviews",
      error: error.message,
    });
  }
};