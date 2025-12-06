
import Onboarding from "../models/Onboarding.model.js"



export const getOnboarding = async (req, res) => {
    try {
        const board = await Onboarding.findById(req.params.id).populate('applicationId');
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const startOnboarding = async (req, res) => {
    try {
        const { applicationId } = req.body;
        const board = new Onboarding({ applicationId, tasks: [{ title: 'Aadhaar', completed: false }, { title: 'PAN', completed: false }, { title: 'Bank details', completed: false }] });
        await board.save();
        res.status(201).json(board);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const updateTask = async (req, res) => {
    try {
        const { id } = req.params; // onboarding id
        const { taskIndex, completed } = req.body;
        const board = await Onboarding.findById(id);
        if (!board) return res.status(404).json({ message: 'Not found' });
        if (!board.tasks[taskIndex]) return res.status(400).json({ message: 'Invalid task index' });
        board.tasks[taskIndex].completed = completed === undefined ? !board.tasks[taskIndex].completed : completed;
        await board.save();
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const uploadDocument = async (req, res) => {
    try {
        const { id } = req.params; // onboarding id
        // req.file.path
        const board = await Onboarding.findById(id);
        if (!board) return res.status(404).json({ message: 'Not found' });
        board.documents.push({ name: req.file.originalname, file: req.file.path, status: 'pending' });
        await board.save();
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};