const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const Goal = require('../models/goals');

const calculateResilienceScore = async (userId, month) => {

    // --------------------------------
    // 1. GET MONTH DATES
    // --------------------------------

    const [monthName, yearString] = month.split(' ');

    const year = Number(yearString);

    const monthNumber = new Date(
        `${monthName} 1, ${year}`
    ).getMonth();

    const startDate = new Date(
        year,
        monthNumber,
        1
    );

    const endDate = new Date(
        year,
        monthNumber + 1,
        1
    );


    // --------------------------------
    // 2. GET TRANSACTIONS
    // --------------------------------

    const transactions = await Transaction.find({
        user: userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    });


    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );


    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );


    const savings = income - expenses;


    // --------------------------------
    // 3. SAVINGS RATE SCORE
    // Weight = 30
    // --------------------------------

    let savingsRate = 0;

    if (income > 0) {
        savingsRate =
            (savings / income) * 100;
    }


    let savingsScore = 0;

    if (savingsRate >= 30) {
        savingsScore = 30;
    }
    else if (savingsRate >= 20) {
        savingsScore = 25;
    }
    else if (savingsRate >= 10) {
        savingsScore = 20;
    }
    else if (savingsRate > 0) {
        savingsScore = 10;
    }


    // --------------------------------
    // 4. BUDGET SCORE
    // Weight = 25
    // --------------------------------

    const budget = await Budget.findOne({
        user: userId,
        month: month
    });


    let budgetScore = 0;
    let budgetUsedPercentage = 0;

    if (budget && budget.totalBudget > 0) {

        budgetUsedPercentage =
            (expenses / budget.totalBudget) * 100;

        if (budgetUsedPercentage <= 60) {
            budgetScore = 25;
        }
        else if (budgetUsedPercentage <= 80) {
            budgetScore = 20;
        }
        else if (budgetUsedPercentage <= 100) {
            budgetScore = 10;
        }
        else {
            budgetScore = 0;
        }
    }


    // --------------------------------
    // 5. CASH FLOW SCORE
    // Weight = 25
    // --------------------------------

    let cashFlowScore = 0;

    if (income === 0) {
        cashFlowScore = 0;
    }
    else if (savings > 0) {
        cashFlowScore = 25;
    }
    else {
        cashFlowScore = 0;
    }


    // --------------------------------
    // 6. GOAL SCORE
    // Weight = 20
    // --------------------------------

    const goals = await Goal.find({
        user: userId
    });


    let goalScore = 0;

    if (goals.length > 0) {

        let totalProgress = 0;

        goals.forEach(goal => {

            if (goal.target > 0) {

                const progress =
                    (goal.current / goal.target) * 100;

                totalProgress += Math.min(
                    progress,
                    100
                );
            }
        });


        const averageProgress =
            totalProgress / goals.length;


        if (averageProgress >= 80) {
            goalScore = 20;
        }
        else if (averageProgress >= 60) {
            goalScore = 15;
        }
        else if (averageProgress >= 40) {
            goalScore = 10;
        }
        else if (averageProgress > 0) {
            goalScore = 5;
        }
    }


    // --------------------------------
    // 7. FINAL SCORE
    // --------------------------------

    const score =
        savingsScore +
        budgetScore +
        cashFlowScore +
        goalScore;


    // --------------------------------
    // 8. RESILIENCE LEVEL
    // --------------------------------

    let level;

    if (score >= 80) {
        level = 'excellent';
    }
    else if (score >= 60) {
        level = 'good';
    }
    else if (score >= 40) {
        level = 'moderate';
    }
    else {
        level = 'weak';
    }


    // --------------------------------
    // 9. RETURN RESULT
    // --------------------------------

    return {

        month,

        score,

        level,

        breakdown: {

            savings: {
                score: savingsScore,
                maxScore: 30,
                savingsRate: Number(
                    savingsRate.toFixed(2)
                )
            },

            budget: {
                score: budgetScore,
                maxScore: 25,
                usedPercentage: Number(
                    budgetUsedPercentage.toFixed(2)
                )
            },

            cashFlow: {
                score: cashFlowScore,
                maxScore: 25,
                income,
                expenses,
                savings
            },

            goals: {
                score: goalScore,
                maxScore: 20,
                totalGoals: goals.length
            }

        }

    };
};


module.exports = {
    calculateResilienceScore
};