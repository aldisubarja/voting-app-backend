const Vote = require('../models/Vote');

const vote = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Candidate name is required' });
    }

    const hasVoted = await Vote.findOne({ user: req.user.id });

    if (hasVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    const newVote = new Vote({ name, user: req.user.id });
    await newVote.save();

    res.status(201).json({ message: 'Vote submitted successfully' });
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ message: 'Failed to submit vote' });
  }
};

const getExistingCandidates = async (req, res) => {
  try {
    const candidates = await Vote.distinct('name');
    res.json({ candidates });
  } catch (err) {
    console.error('Error fetching existing candidates:', err);
    res.status(500).json({ message: 'Failed to retrieve existing candidates' });
  }
};

module.exports = { vote, getExistingCandidates };
