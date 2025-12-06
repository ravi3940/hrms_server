
import Job from "../models/Job.model.js"

export const createJob = async (req, res) => {
  try {
    const job = new Job({
      title: req.body.title,
      department: req.body.department,
      type: req.body.type,
      location: req.body.location,
      description: req.body.description,
      requirements: req.body.requirements || "",
      salaryRange: req.body.salary, // map salary → salaryRange
    });

    await job.save();
    res.status(201).json(job);

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Validation error", error: err.message });
  }
};


export const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const getJobs = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const q = {};
        if (search) q.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
        const jobs = await Job.find(q).skip((page - 1) * limit).limit(Number(limit));
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const  deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};