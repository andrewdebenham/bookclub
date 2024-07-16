const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

// index (get all users)
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.mesage });
    }
});

// get user profile
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404)
            throw new Error('Profile not found.');
        }
        res.json({ user });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;