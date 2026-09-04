const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const Goal = require('../models/goals');


// ========================================
// FINANCIAL TWIN CALCULATION
// ========================================

const calculateFinancialTwin = async (userId, month) => {

    // ========================================
    // 1. FIND MONTH
    // ========================================

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


    // ========================================
    // 2. GET TRANSACTIONS
    // ========================================

    const transactions = await Transaction.find({
        user: userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    });


    // ========================================
    // 3. CALCULATE INCOME
    // ========================================

    const incomeTransactions = transactions.filter(
        transaction => transaction.type === 'income'
    );

    const expenseTransactions = transactions.filter(
        transaction => transaction.type === 'expense'
    );


    const totalIncome = incomeTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );


    const totalExpenses = expenseTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );


    // ========================================
    // 4. SAVINGS
    // ========================================

    const savings = totalIncome - totalExpenses;


    let savingsRate = 0;

    if (totalIncome > 0) {
        savingsRate =
            (savings / totalIncome) * 100;
    }


    // ========================================
    // 5. FIND BUDGET
    // ========================================

    const budget = await Budget.findOne({
        user: userId,
        month: month
    });


    let budgetData = null;


    if (budget) {

        const budgetUsedPercentage =
            budget.totalBudget > 0
                ? (totalExpenses / budget.totalBudget) * 100
                : 0;


        const remainingBudget =
            budget.totalBudget - totalExpenses;


        let status;

        if (budgetUsedPercentage > 100) {
            status = 'over_budget';
        }
        else if (budgetUsedPercentage >= 80) {
            status = 'warning';
        }
        else {
            status = 'safe';
        }


        budgetData = {

            totalBudget: budget.totalBudget,

            spent: totalExpenses,

            remaining: remainingBudget,

            usedPercentage: Number(
                budgetUsedPercentage.toFixed(2)
            ),

            status

        };
    }


    // ========================================
    // 6. GET GOALS
    // ========================================

    const goals = await Goal.find({
        user: userId
    });


    const totalGoals = goals.length;


    // ========================================
    // 7. CALCULATE GOAL PROGRESS
    // ========================================

    let completedGoals = 0;

    let totalGoalTarget = 0;

    let totalGoalCurrent = 0;


    const goalProgress = goals.map(goal => {

        const target = goal.target;

        const current = goal.current || 0;


        totalGoalTarget += target;

        totalGoalCurrent += current;


        let progress = 0;

        if (target > 0) {
            progress = (current / target) * 100;
        }


        const completed =
            current >= target;


        if (completed) {
            completedGoals++;
        }


        return {

            id: goal._id,

            name: goal.name,

            target,

            current,

            remaining: Math.max(
                target - current,
                0
            ),

            progress: Number(
                Math.min(progress, 100).toFixed(2)
            ),

            priority: goal.priority,

            targetDate: goal.date,

            completed

        };

    });


    const activeGoals =
        totalGoals - completedGoals;


    // ========================================
    // 8. OVERALL GOAL PROGRESS
    // ========================================

    let overallGoalProgress = 0;

    if (totalGoalTarget > 0) {

        overallGoalProgress =
            (totalGoalCurrent / totalGoalTarget) * 100;

    }


    // ========================================
    // 9. FINANCIAL HEALTH
    // ========================================

    let financialHealth = 'good';


    if (totalIncome === 0) {

        financialHealth = 'no_income_data';

    }
    else if (savings < 0) {

        financialHealth = 'critical';

    }
    else if (
        budgetData &&
        budgetData.status === 'over_budget'
    ) {

        financialHealth = 'warning';

    }
    else if (savingsRate < 10) {

        financialHealth = 'warning';

    }
    else if (savingsRate >= 20) {

        financialHealth = 'excellent';

    }


    // ========================================
    // 10. RETURN FINANCIAL TWIN
    // ========================================

    return {

        month,

        cashFlow: {

            income: totalIncome,

            expenses: totalExpenses,

            savings,

            savingsRate: Number(
                savingsRate.toFixed(2)
            )

        },

        budget: budgetData,

        goals: {

            total: totalGoals,

            completed: completedGoals,

            active: activeGoals,

            overallProgress: Number(
                Math.min(
                    overallGoalProgress,
                    100
                ).toFixed(2)
            ),

            details: goalProgress

        },

        financialHealth

    };

};


module.exports = {
    calculateFinancialTwin
};