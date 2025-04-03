const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../modules/config');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role)
      return res.status(400).json({ message: 'Username, password, and role are required' });

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Registration error:', err);

    // Duplicate username (MongoDB error code 11000)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login, register };
