const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        target: {
            type: Number,
            required: true,
            min: 0
        },

        current: {
            type: Number,
            default: 0,
            min: 0
        },

        date: {
            type: Date,
            required: true
        },

        contribution: {
            type: Number,
            default: 0,
            min: 0
        },

        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        }
    },
    {
        timestamps: true
    }
);

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;