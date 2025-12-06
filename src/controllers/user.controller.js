import User from "../models/User.model.js"


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const updateUser = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.password) delete updates.password; 
        const user = await UserModel.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};