import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.model.js"


export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email and password required' });


        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'User exists' });


        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hash, role });
        await user.save();


        res.status(201).json({ message: 'User registered', user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });


        const same = await bcrypt.compare(password, user.password);
        if (!same) return res.status(401).json({ message: 'Invalid credentials' });


    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const profile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user info from auth middleware

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};