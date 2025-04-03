const Vote = require('../models/Vote');
const User = require('../models/User');

const getResults = async (req, res) => {
  try {
    const votes = await Vote.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const total = await Vote.countDocuments();

    res.json({ totalVotes: total, results: votes });
  } catch (err) {
    console.error('Error fetching vote results:', err);
    res.status(500).json({ message: 'Failed to retrieve vote results' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v');
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await User.findByIdAndDelete(userId);
    
    // Also delete their votes (optional, depending on requirements)
    await Vote.deleteMany({ user: userId });
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, role } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prepare update object
    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, select: '-password -__v' }
    );
    
    res.json({ 
      message: 'User updated successfully', 
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

module.exports = { getResults, getUsers, deleteUser, editUser };
