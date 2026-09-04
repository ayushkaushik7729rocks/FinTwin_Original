const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// ===============================
// SIGNUP
// ===============================

router.post('/signup', async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check required fields

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }


        // Check if user already exists

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }


        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });


        // Create JWT

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );


        res.status(201).json({
            message: 'Signup successful',
            token
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });

    }

});


// ===============================
// LOGIN
// ===============================

router.post('/login', async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }


        // Find user

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }


        // Compare password

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }


        // Create JWT

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );


        res.status(200).json({
            message: 'Login successful',
            token
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });

    }

});
 

// profile //

router.get('/profile', authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            user
        });

    } catch (error) {

        res.status(500).json({
            message: 'Server error'
        });

    }

});
module.exports = router;