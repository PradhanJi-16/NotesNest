const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => { //register the user route
    console.log("Request Body:", req.body);
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (err) {
        res.status(500).json({ message: err.message }); // <-- fixed typo here
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //finding user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found!' });

        //checking password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        //generating token
        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '2h' });

        res.json({ token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
// This code defines authentication routes for user registration and login using Express.js, bcrypt for password hashing