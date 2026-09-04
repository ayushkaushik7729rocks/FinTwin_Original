const express = require('express');

const Goal = require('../models/goals');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// ========================================
// 18. CREATE GOAL
// POST /api/goals
// ========================================

router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            name,
            target,
            current,
            date,
            contribution,
            priority
        } = req.body;

        if (!name || !target || !date) {
            return res.status(400).json({
                message: 'Name, target and date are required'
            });
        }

        const goal = await Goal.create({
            user: req.userId,
            name,
            target,
            current,
            date,
            contribution,
            priority
        });

        res.status(201).json({
            message: 'Goal created successfully',
            goal
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// ========================================
// 19. GET ALL GOALS
// GET /api/goals
// ========================================

router.get('/', authMiddleware, async (req, res) => {
    try {

        const goals = await Goal.find({
            user: req.userId
        }).sort({ date: 1 });

        res.status(200).json({
            goals
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// ========================================
// GET ONE GOAL
// GET /api/goals/:id
// ========================================

router.get('/:id', authMiddleware, async (req, res) => {
    try {

        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!goal) {
            return res.status(404).json({
                message: 'Goal not found'
            });
        }

        res.status(200).json({
            goal
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// ========================================
// 20. UPDATE GOAL
// PUT /api/goals/:id
// ========================================

router.put('/:id', authMiddleware, async (req, res) => {
    try {

        const {
            name,
            target,
            current,
            date,
            contribution,
            priority
        } = req.body;

        const goal = await Goal.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                name,
                target,
                current,
                date,
                contribution,
                priority
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!goal) {
            return res.status(404).json({
                message: 'Goal not found'
            });
        }

        res.status(200).json({
            message: 'Goal updated successfully',
            goal
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// ========================================
// 21. DELETE GOAL
// DELETE /api/goals/:id
// ========================================

router.delete('/:id', authMiddleware, async (req, res) => {
    try {

        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!goal) {
            return res.status(404).json({
                message: 'Goal not found'
            });
        }

        res.status(200).json({
            message: 'Goal deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


module.exports = router;