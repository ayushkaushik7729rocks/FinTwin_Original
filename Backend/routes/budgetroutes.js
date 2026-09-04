const express = require('express');

const Budget = require('../models/budget');
const authMiddleware = require('../middleware/authMiddleware');
const { calculateBudget } = require('../services/budgetService');

const router = express.Router();


// CREATE BUDGET
router.post('/', authMiddleware, async (req, res) => {
    try {

        const {
            month,
            totalBudget,
            categories
        } = req.body;

        if (!month || totalBudget === undefined) {
            return res.status(400).json({
                message: 'Month and total budget are required'
            });
        }

        const budget = await Budget.create({
            user: req.userId,
            month,
            totalBudget,
            categories
        });

        res.status(201).json({
            message: 'Budget created successfully',
            budget
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// GET USER BUDGETS
router.get('/', authMiddleware, async (req, res) => {
    try {

        const budgets = await Budget.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            budgets
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// CALCULATE BUDGET

router.get('/calculation', authMiddleware, async (req, res) => {

    try {

        const { month } = req.query;

        if (!month) {
            return res.status(400).json({
                message: 'Month is required'
            });
        }


        const result = await calculateBudget(
            req.userId,
            month
        );


        if (!result) {
            return res.status(404).json({
                message: 'Budget not found for this month'
            });
        }


        res.status(200).json({
            message: 'Budget calculated successfully',
            budget: result
        });


    } catch (error) {

        console.error(
            'Budget calculation error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }

});



// GET ONE BUDGET
router.get('/:id', authMiddleware, async (req, res) => {
    try {

        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!budget) {
            return res.status(404).json({
                message: 'Budget not found'
            });
        }

        res.status(200).json({
            budget
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// UPDATE BUDGET
router.put('/:id', authMiddleware, async (req, res) => {
    try {

        const {
            month,
            totalBudget,
            categories
        } = req.body;

        const budget = await Budget.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                month,
                totalBudget,
                categories
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!budget) {
            return res.status(404).json({
                message: 'Budget not found'
            });
        }

        res.status(200).json({
            message: 'Budget updated successfully',
            budget
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// DELETE BUDGET
router.delete('/:id', authMiddleware, async (req, res) => {
    try {

        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!budget) {
            return res.status(404).json({
                message: 'Budget not found'
            });
        }

        res.status(200).json({
            message: 'Budget deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


module.exports = router;