const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        monthlyIncome: {
            type: Number,
            default: 0
        },

        monthlyExpenses: {
            type: Number,
            default: 0
        },

        savings: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User ;