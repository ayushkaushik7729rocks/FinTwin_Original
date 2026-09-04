require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./db');
const app = express();
app.use(express.json());

const authRoutes = require('./routes/authroutes');
const transactionRoutes = require('./routes/transactionroutes');
const goalRoutes = require('./routes/goalroutes');
const budgetRoutes = require('./routes/budgetroutes');
const dashboardRoutes = require('./routes/dashboard');

app.use(cors());


connectDB();

app.get('/', (req, res) => {
    res.json({
        message: 'FinTwin Backend is running'
    });
});


app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});