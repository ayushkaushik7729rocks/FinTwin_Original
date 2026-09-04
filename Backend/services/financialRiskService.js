const Transaction = require('../models/transaction');
const Budget = require('../models/budget');

const calculateFinancialRisk = async (userId, month) => {

    // --------------------------------
    // 1. PARSE MONTH
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
    // 2. GET MONTH TRANSACTIONS
    // --------------------------------

    const transactions = await Transaction.find({
        user: userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    });

    // --------------------------------
    // 3. INCOME
    // --------------------------------

    const income = transactions
        .filter(
            transaction =>
                transaction.type === 'income'
        )
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    // --------------------------------
    // 4. EXPENSES
    // --------------------------------

    const expenses = transactions
        .filter(
            transaction =>
                transaction.type === 'expense'
        )
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    // --------------------------------
    // 5. SAVINGS
    // --------------------------------

    const savings = income - expenses;

    let savingsRate = 0;

    if (income > 0) {
        savingsRate =
            (savings / income) * 100;
    }

    // --------------------------------
    // 6. BUDGET
    // --------------------------------

    const budget = await Budget.findOne({
        user: userId,
        month
    });

    let budgetUsedPercentage = 0;

    if (budget && budget.totalBudget > 0) {

        budgetUsedPercentage =
            (expenses / budget.totalBudget) * 100;
    }

    // --------------------------------
    // 7. EMERGENCY COVERAGE
    // --------------------------------

    const allTransactions =
        await Transaction.find({
            user: userId
        });

    const totalIncome =
        allTransactions
            .filter(
                transaction =>
                    transaction.type === 'income'
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );

    const totalExpenses =
        allTransactions
            .filter(
                transaction =>
                    transaction.type === 'expense'
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );

    const estimatedSavings =
        Math.max(
            totalIncome - totalExpenses,
            0
        );

    let emergencyCoverage = 0;

    if (expenses > 0) {

        emergencyCoverage =
            estimatedSavings / expenses;
    }

    // --------------------------------
    // 8. RISK SCORE
    // --------------------------------

    let riskScore = 0;

    // Savings risk
    if (savingsRate < 0) {
        riskScore += 30;
    }
    else if (savingsRate < 10) {
        riskScore += 20;
    }
    else if (savingsRate < 20) {
        riskScore += 10;
    }

    // Budget risk
    if (budgetUsedPercentage > 100) {
        riskScore += 30;
    }
    else if (budgetUsedPercentage >= 80) {
        riskScore += 20;
    }
    else if (budgetUsedPercentage >= 60) {
        riskScore += 10;
    }

    // Emergency fund risk
    if (emergencyCoverage < 1) {
        riskScore += 30;
    }
    else if (emergencyCoverage < 3) {
        riskScore += 20;
    }
    else if (emergencyCoverage < 6) {
        riskScore += 10;
    }

    // Cash flow risk
    if (income === 0) {
        riskScore += 10;
    }
    else if (savings < 0) {
        riskScore += 10;
    }

    // --------------------------------
    // 9. RISK LEVEL
    // --------------------------------

    let riskLevel;

    if (riskScore >= 70) {
        riskLevel = 'very_high';
    }
    else if (riskScore >= 50) {
        riskLevel = 'high';
    }
    else if (riskScore >= 30) {
        riskLevel = 'moderate';
    }
    else if (riskScore >= 15) {
        riskLevel = 'low';
    }
    else {
        riskLevel = 'very_low';
    }

    // --------------------------------
    // 10. RECOMMENDATIONS
    // --------------------------------

    const recommendations = [];

    if (savingsRate < 20) {

        recommendations.push(
            'Try to increase your monthly savings rate.'
        );
    }

    if (budgetUsedPercentage >= 80) {

        recommendations.push(
            'Your spending is approaching your budget limit.'
        );
    }

    if (budgetUsedPercentage > 100) {

        recommendations.push(
            'You have exceeded your monthly budget.'
        );
    }

    if (emergencyCoverage < 3) {

        recommendations.push(
            'Build an emergency fund covering at least 3 months of expenses.'
        );
    }

    if (emergencyCoverage >= 3 &&
        emergencyCoverage < 6) {

        recommendations.push(
            'Consider increasing your emergency fund toward 6 months of expenses.'
        );
    }

    if (savings < 0) {

        recommendations.push(
            'Your expenses are higher than your income this month.'
        );
    }

    if (recommendations.length === 0) {

        recommendations.push(
            'Your current financial position looks healthy.'
        );
    }

    // --------------------------------
    // 11. RETURN
    // --------------------------------

    return {

        month,

        riskScore,

        riskLevel,

        metrics: {

            income,

            expenses,

            savings,

            savingsRate: Number(
                savingsRate.toFixed(2)
            ),

            budgetUsedPercentage: Number(
                budgetUsedPercentage.toFixed(2)
            ),

            emergencyCoverage: Number(
                emergencyCoverage.toFixed(2)
            )
        },

        recommendations
    };
};

module.exports = {
    calculateFinancialRisk
};