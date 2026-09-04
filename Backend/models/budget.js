const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        month: {
            type: String,
            required: true
        },

        totalBudget: {
            type: Number,
            required: true,
            min: 0
        },

        categories: [
            {
                name: {
                    type: String,
                    required: true
                },

                limit: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;