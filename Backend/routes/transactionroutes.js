const express = require('express');

const Transaction = require('../models/transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// create transaction //

router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            type,
            amount,
            category,
            description,
            date
        } = req.body;

        if (!type || !amount || !category) {
            return res.status(400).json({
                message: 'Type, amount and category are required'
            });
        }

        const transaction = await Transaction.create({
            user: req.userId,
            type,
            amount,
            category,
            description,
            date
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// get all transaction //

router.get('/', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            user: req.userId
        }).sort({ date: -1 });

        res.status(200).json({
            transactions
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// get one transaction  //

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            transaction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// delete transaction //


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// update transaction // 

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const {
            type,
            amount,
            category,
            description,
            date
        } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                type,
                amount,
                category,
                description,
                date
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


module.exports = router;