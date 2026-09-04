const { getDashboardData } =
    require('./dashboardService');


const generateFinancialInsights = async (userId) => {

    /*
     * Get user's dashboard data
     */

    const dashboard =
        await getDashboardData(userId);


    const insights = [];


    // ========================================
    // 1. SAVINGS INSIGHT
    // ========================================

    if (dashboard.monthlyIncome > 0) {

        if (dashboard.savingsRate >= 30) {

            insights.push({
                category: 'savings',
                type: 'positive',
                title: 'Excellent Savings',
                message:
                    `You saved ₹${dashboard.monthlySavings} this month, which is ${dashboard.savingsRate}% of your income.`
            });

        }
        else if (dashboard.savingsRate >= 20) {

            insights.push({
                category: 'savings',
                type: 'positive',
                title: 'Good Savings',
                message:
                    `You saved ₹${dashboard.monthlySavings} this month, which is ${dashboard.savingsRate}% of your income.`
            });

        }
        else if (dashboard.savingsRate >= 10) {

            insights.push({
                category: 'savings',
                type: 'neutral',
                title: 'Moderate Savings',
                message:
                    `You saved ₹${dashboard.monthlySavings} this month, which is ${dashboard.savingsRate}% of your income.`
            });

        }
        else {

            insights.push({
                category: 'savings',
                type: 'warning',
                title: 'Low Savings',
                message:
                    `You saved ₹${dashboard.monthlySavings} this month, which is only ${dashboard.savingsRate}% of your income.`
            });

        }

    }
    else {

        insights.push({
            category: 'savings',
            type: 'warning',
            title: 'No Income',
            message:
                'No income has been recorded for the current month.'
        });

    }


    // ========================================
    // 2. EXPENSE INSIGHT
    // ========================================

    if (dashboard.monthlyIncome > 0) {

        const expensePercentage =
            (
                dashboard.monthlyExpenses /
                dashboard.monthlyIncome
            ) * 100;


        insights.push({
            category: 'expenses',
            type:
                expensePercentage > 80
                    ? 'warning'
                    : 'neutral',

            title: 'Monthly Spending',

            message:
                `You spent ₹${dashboard.monthlyExpenses} this month, which is ${Number(expensePercentage.toFixed(2))}% of your monthly income.`
        });

    }


    // ========================================
    // 3. TOP EXPENSE CATEGORY
    // ========================================

    if (
        dashboard.categoryExpenses &&
        dashboard.categoryExpenses.length > 0
    ) {

        const sortedCategories =
            [...dashboard.categoryExpenses]
                .sort(
                    (a, b) =>
                        b.amount - a.amount
                );


        const topCategory =
            sortedCategories[0];


        insights.push({
            category: 'category',
            type: 'neutral',
            title: 'Highest Spending Category',

            message:
                `Your highest expense category this month is ${topCategory.category}, with spending of ₹${topCategory.amount}.`
        });

    }


    // ========================================
    // 4. BUDGET INSIGHT
    // ========================================

    if (
        dashboard.budget.totalBudget > 0
    ) {

        const used =
            dashboard.budget.budgetUsedPercentage;


        if (used > 100) {

            insights.push({
                category: 'budget',
                type: 'warning',
                title: 'Budget Exceeded',

                message:
                    `You have exceeded your monthly budget by ₹${Math.abs(dashboard.budget.budgetRemaining)}.`
            });

        }
        else if (used >= 80) {

            insights.push({
                category: 'budget',
                type: 'warning',
                title: 'Budget Almost Used',

                message:
                    `You have used ${used}% of your monthly budget. Only ₹${dashboard.budget.budgetRemaining} remains.`
            });

        }
        else {

            insights.push({
                category: 'budget',
                type: 'positive',
                title: 'Budget Under Control',

                message:
                    `You have used ${used}% of your monthly budget and have ₹${dashboard.budget.budgetRemaining} remaining.`
            });

        }

    }


    // ========================================
    // 5. TRANSACTION ACTIVITY
    // ========================================

    insights.push({
        category: 'activity',
        type: 'neutral',
        title: 'Transaction Activity',

        message:
            `You have recorded ${dashboard.transactionCount} transactions in total.`
    });


    // ========================================
    // 6. OVERALL FINANCIAL INSIGHT
    // ========================================

    let overallStatus;
    let overallMessage;


    if (
        dashboard.savingsRate >= 30 &&
        dashboard.budget.budgetUsedPercentage < 80
    ) {

        overallStatus = 'healthy';

        overallMessage =
            'Your current financial position looks healthy. You are saving well and keeping your spending under control.';

    }
    else if (
        dashboard.savingsRate >= 20
    ) {

        overallStatus = 'stable';

        overallMessage =
            'Your financial position is relatively stable. Continue monitoring your spending and savings.';

    }
    else {

        overallStatus = 'needs_attention';

        overallMessage =
            'Your finances need some attention. Focus on increasing savings and controlling unnecessary expenses.';

    }


    return {

        overallStatus,

        overallMessage,

        summary: {

            monthlyIncome:
                dashboard.monthlyIncome,

            monthlyExpenses:
                dashboard.monthlyExpenses,

            monthlySavings:
                dashboard.monthlySavings,

            savingsRate:
                dashboard.savingsRate,

            budgetUsedPercentage:
                dashboard.budget.budgetUsedPercentage,

            budgetRemaining:
                dashboard.budget.budgetRemaining

        },

        insights

    };
};


module.exports = {
    generateFinancialInsights
};