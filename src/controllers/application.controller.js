import Application from "../models/Application.model.js"
import { sendEmail } from "../service/emailService.js"


export const applyToJob = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      jobId: req.body.jobId,
      candidateName: req.body.candidateName,
      email: req.body.email,
      phone: req.body.phone,
      resume: req.file ? req.file.filename : null
    };

    if (!data.userId) return res.status(400).json({ message: "userId missing" });
    if (!data.jobId) return res.status(400).json({ message: "jobId missing" });

    const app = new Application(data);

    await app.save();

    res.status(201).json(app);

  } catch (err) {
    console.error("APPLICATION ERROR:", err);
    res.status(400).json({ message: "Failed to apply", error: err.message });
  }
};



export const listApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const q = {};
    if (status) q.status = status;
    if (search) q.$or = [{ candidateName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];


    const apps = await Application.find(q).skip((page - 1) * limit).limit(Number(limit)).populate('jobId');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("userId")
      .populate("jobId");

    if (!app) return res.status(404).json({ message: "Application not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["applied", "shortlisted", "interview", "offered", "rejected"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    )
      .populate("userId", "name email phone")
      .populate("jobId", "title");

    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application status updated successfully",
      application: updatedApp,
    });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getShortlistedCandidates = async (req, res) => {
  try {
    // Find all applications where status = shortlisted
    const shortlisted = await Application.find({ status: "shortlisted" })
      .populate("jobId", "title department location")   // job details
      .populate("userId", "name email phone");           // candidate details

    return res.status(200).json({
      total: shortlisted.length,
      candidates: shortlisted,
    });

  } catch (error) {
    console.error("Error fetching shortlisted candidates:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { status, jobId, userId } = req.query;

    let filter = {};

    if (status) {
      filter.status = status.toLowerCase();
    }

    if (jobId) {
      filter.jobId = jobId;
    }

    if (userId) {
      filter.userId = userId;
    }

    const applications = await Application.find(filter)
      .populate("jobId", "title department location salary")
      .populate("userId", "name email phone");

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getShortlistedApplications = async (req, res) => {
  try {
    const apps = await Application.find({ status: "shortlisted" })
      .populate({ path: "jobId", strictPopulate: false })
      .populate({ path: "userId", strictPopulate: false })

    res.status(200).json({ applications: apps });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
