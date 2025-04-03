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

module.exports = { getResults, getUsers };
