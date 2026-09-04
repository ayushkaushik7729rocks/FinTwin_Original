const Transaction = require('../models/transaction');
const Budget = require('../models/budget');

const getDashboardData = async (userId) => {

    // Get all transactions of logged-in user
    const transactions = await Transaction.find({
        user: userId
    }).sort({ date: -1 });


    // -----------------------------
    // TOTAL INCOME
    // -----------------------------

    const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);


    // -----------------------------
    // TOTAL EXPENSE
    // -----------------------------

    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);


    // -----------------------------
    // TOTAL SAVINGS
    // -----------------------------

    const totalSavings = totalIncome - totalExpenses;


    // -----------------------------
    // SAVINGS RATE
    // -----------------------------

    let savingsRate = 0;

    if (totalIncome > 0) {
        savingsRate = (totalSavings / totalIncome) * 100;
    }


    // -----------------------------
    // CURRENT MONTH
    // -----------------------------

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();


    const currentMonthTransactions = transactions.filter(transaction => {

        const transactionDate = new Date(transaction.date);

        return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        );

    });


    // Current month income

    const monthlyIncome = currentMonthTransactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);


    // Current month expenses

    const monthlyExpenses = currentMonthTransactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);


    // Current month savings

    const monthlySavings = monthlyIncome - monthlyExpenses;


    // -----------------------------
    // CATEGORY-WISE EXPENSE
    // -----------------------------

    const categoryMap = {};

    currentMonthTransactions
        .filter(transaction => transaction.type === 'expense')
        .forEach(transaction => {

            if (!categoryMap[transaction.category]) {
                categoryMap[transaction.category] = 0;
            }

            categoryMap[transaction.category] += transaction.amount;

        });


    const categoryExpenses = Object.entries(categoryMap).map(
        ([category, amount]) => ({
            category,
            amount
        })
    );


    // -----------------------------
    // CURRENT MONTH BUDGET
    // -----------------------------

    const monthName = now.toLocaleString('en-US', {
        month: 'long'
    });

    const budgetMonth = `${monthName} ${currentYear}`;


    const budget = await Budget.findOne({
        user: userId,
        month: budgetMonth
    });


    let totalBudget = 0;
    let budgetRemaining = 0;
    let budgetUsedPercentage = 0;


    if (budget) {

        totalBudget = budget.totalBudget;

        budgetRemaining = totalBudget - monthlyExpenses;

        if (totalBudget > 0) {
            budgetUsedPercentage =
                (monthlyExpenses / totalBudget) * 100;
        }

    }


    // -----------------------------
    // RECENT TRANSACTIONS
    // -----------------------------

    const recentTransactions = transactions.slice(0, 5);


    // -----------------------------
    // RETURN DASHBOARD
    // -----------------------------

    return {

        totalIncome,
        totalExpenses,
        totalSavings,

        savingsRate: Number(savingsRate.toFixed(2)),

        monthlyIncome,
        monthlyExpenses,
        monthlySavings,

        transactionCount: transactions.length,

        categoryExpenses,

        budget: {
            totalBudget,
            budgetUsed: monthlyExpenses,
            budgetRemaining,
            budgetUsedPercentage:
                Number(budgetUsedPercentage.toFixed(2))
        },

        recentTransactions
    };
};


module.exports = {
    getDashboardData
};