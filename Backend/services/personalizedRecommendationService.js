const {
    getDashboardData
} = require('./dashboardService');

const {
    calculateFinancialRisk
} = require('./financialRiskService');

const {
    calculateEmergencyCoverage
} = require('./emergencyService');

const {
    calculateGoalCompletion
} = require('./goalCompletionService');

const {
    calculateGoalDelay
} = require('./goalDelayService');


const generatePersonalizedRecommendations = async (
    userId,
    month
) => {

    // ----------------------------------------
    // GET USER FINANCIAL DATA
    // ----------------------------------------

    const dashboard =
        await getDashboardData(userId);

    const financialRisk =
        await calculateFinancialRisk(
            userId,
            month
        );

    const emergencyCoverage =
        await calculateEmergencyCoverage(
            userId,
            month
        );

    const goalCompletion =
        await calculateGoalCompletion(
            userId
        );

    const goalDelay =
        await calculateGoalDelay(
            userId
        );


    const recommendations = [];


    // ----------------------------------------
    // 1. SAVINGS RECOMMENDATION
    // ----------------------------------------

    if (dashboard.monthlyIncome <= 0) {

        recommendations.push({
            category: 'income',
            priority: 'high',
            title: 'Add Your Income',
            message:
                'No income has been recorded for this month. Add your income so FinTwin can provide more accurate financial recommendations.'
        });

    }
    else if (dashboard.savingsRate < 10) {

        recommendations.push({
            category: 'savings',
            priority: 'high',
            title: 'Increase Your Savings',
            message:
                `Your current savings rate is ${dashboard.savingsRate}%. Try to reduce unnecessary expenses and increase your monthly savings.`
        });

    }
    else if (dashboard.savingsRate < 20) {

        recommendations.push({
            category: 'savings',
            priority: 'medium',
            title: 'Improve Your Savings Rate',
            message:
                `You are currently saving ${dashboard.savingsRate}% of your income. Try gradually increasing your savings toward 20% or more.`
        });

    }
    else {

        recommendations.push({
            category: 'savings',
            priority: 'low',
            title: 'Maintain Your Savings',
            message:
                `Your savings rate is ${dashboard.savingsRate}%. Continue maintaining your current saving habits.`
        });

    }


    // ----------------------------------------
    // 2. EXPENSE RECOMMENDATION
    // ----------------------------------------

    if (dashboard.monthlyIncome > 0) {

        const expensePercentage =
            (
                dashboard.monthlyExpenses /
                dashboard.monthlyIncome
            ) * 100;


        if (expensePercentage > 80) {

            recommendations.push({
                category: 'expenses',
                priority: 'high',
                title: 'Reduce Monthly Expenses',
                message:
                    `Your expenses are ${Number(expensePercentage.toFixed(2))}% of your income. Consider reducing unnecessary spending.`
            });

        }
        else if (expensePercentage > 60) {

            recommendations.push({
                category: 'expenses',
                priority: 'medium',
                title: 'Monitor Your Spending',
                message:
                    `Your expenses are ${Number(expensePercentage.toFixed(2))}% of your income. Keep monitoring your spending to protect your savings.`
            });

        }
        else {

            recommendations.push({
                category: 'expenses',
                priority: 'low',
                title: 'Expenses Under Control',
                message:
                    `Your expenses are ${Number(expensePercentage.toFixed(2))}% of your income, which leaves room for savings.`
            });

        }

    }


    // ----------------------------------------
    // 3. BUDGET RECOMMENDATION
    // ----------------------------------------

    const budgetUsed =
        dashboard.budget.budgetUsedPercentage;


    if (dashboard.budget.totalBudget <= 0) {

        recommendations.push({
            category: 'budget',
            priority: 'medium',
            title: 'Create a Budget',
            message:
                'You do not currently have a monthly budget. Creating one will help FinTwin monitor your spending.'
        });

    }
    else if (budgetUsed > 100) {

        recommendations.push({
            category: 'budget',
            priority: 'high',
            title: 'Budget Exceeded',
            message:
                `You have exceeded your monthly budget by ₹${Math.abs(dashboard.budget.budgetRemaining)}. Reduce additional spending and review your expense categories.`
        });

    }
    else if (budgetUsed >= 80) {

        recommendations.push({
            category: 'budget',
            priority: 'high',
            title: 'Budget Almost Exhausted',
            message:
                `You have already used ${budgetUsed}% of your monthly budget. Only ₹${dashboard.budget.budgetRemaining} remains.`
        });

    }
    else if (budgetUsed >= 60) {

        recommendations.push({
            category: 'budget',
            priority: 'medium',
            title: 'Watch Your Budget',
            message:
                `You have used ${budgetUsed}% of your monthly budget. Keep your spending under control.`
        });

    }
    else {

        recommendations.push({
            category: 'budget',
            priority: 'low',
            title: 'Budget Under Control',
            message:
                `You have used ${budgetUsed}% of your monthly budget. Your spending is currently under control.`
        });

    }


    // ----------------------------------------
    // 4. EMERGENCY FUND
    // ----------------------------------------

    const emergencyMonths =
        emergencyCoverage.emergencyCoverage;


    if (emergencyMonths < 1) {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'high',
            title: 'Build an Emergency Fund',
            message:
                'Your emergency coverage is below one month. Building an emergency fund should be one of your highest financial priorities.'
        });

    }
    else if (emergencyMonths < 3) {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'high',
            title: 'Strengthen Your Emergency Fund',
            message:
                `Your emergency coverage is ${emergencyMonths} months. Try to build it toward at least 3 months of expenses.`
        });

    }
    else if (emergencyMonths < 6) {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'medium',
            title: 'Increase Emergency Coverage',
            message:
                `Your emergency coverage is ${emergencyMonths} months. Consider increasing it toward 6 months of expenses.`
        });

    }
    else {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'low',
            title: 'Strong Emergency Fund',
            message:
                `Your emergency coverage is ${emergencyMonths} months. You have strong emergency protection.`
        });

    }


    // ----------------------------------------
    // 5. FINANCIAL RISK
    // ----------------------------------------

    if (
        financialRisk.riskLevel === 'very_high' ||
        financialRisk.riskLevel === 'high'
    ) {

        recommendations.push({
            category: 'risk',
            priority: 'high',
            title: 'Reduce Financial Risk',
            message:
                `Your financial risk is ${financialRisk.riskLevel}. Focus on increasing savings, reducing unnecessary expenses and strengthening your emergency fund.`
        });

    }
    else if (
        financialRisk.riskLevel === 'moderate'
    ) {

        recommendations.push({
            category: 'risk',
            priority: 'medium',
            title: 'Improve Financial Stability',
            message:
                'Your financial risk is moderate. Improving your savings rate and controlling expenses can strengthen your financial position.'
        });

    }
    else {

        recommendations.push({
            category: 'risk',
            priority: 'low',
            title: 'Maintain Financial Stability',
            message:
                `Your financial risk is ${financialRisk.riskLevel}. Continue maintaining healthy financial habits.`
        });

    }


    // ----------------------------------------
    // 6. GOALS
    // ----------------------------------------

    if (goalCompletion.totalGoals === 0) {

        recommendations.push({
            category: 'goals',
            priority: 'medium',
            title: 'Create a Financial Goal',
            message:
                'You currently have no financial goals. Create a goal to give your savings a clear purpose.'
        });

    }
    else if (goalCompletion.completionRate === 100) {

        recommendations.push({
            category: 'goals',
            priority: 'low',
            title: 'Goals Completed',
            message:
                'You have completed all your current financial goals. Consider creating your next financial milestone.'
        });

    }
    else {

        recommendations.push({
            category: 'goals',
            priority: 'medium',
            title: 'Continue Working Toward Your Goals',
            message:
                `You have completed ${goalCompletion.completionRate}% of your financial goals. Continue making regular contributions.`
        });

    }


    // ----------------------------------------
    // 7. DELAYED GOALS
    // ----------------------------------------

    const delayedGoals =
        goalDelay.details.filter(
            goal =>
                goal.status === 'delayed' ||
                goal.status === 'overdue'
        );


    if (delayedGoals.length > 0) {

        recommendations.push({
            category: 'goal_delay',
            priority: 'high',
            title: 'Goals Need Attention',
            message:
                `You currently have ${delayedGoals.length} goal(s) that may not be completed on time. Consider increasing your monthly contributions.`
        });

    }


    // ----------------------------------------
    // FIND HIGHEST PRIORITY
    // ----------------------------------------

    let overallPriority = 'low';


    if (
        recommendations.some(
            recommendation =>
                recommendation.priority === 'high'
        )
    ) {

        overallPriority = 'high';

    }
    else if (
        recommendations.some(
            recommendation =>
                recommendation.priority === 'medium'
        )
    ) {

        overallPriority = 'medium';

    }


    // ----------------------------------------
    // GENERATE SUMMARY
    // ----------------------------------------

    let summary;


    if (overallPriority === 'high') {

        summary =
            'Your financial plan needs attention in a few important areas. Focus on the high-priority recommendations first.';

    }
    else if (overallPriority === 'medium') {

        summary =
            'Your finances are generally stable, but there are opportunities to improve your financial position.';

    }
    else {

        summary =
            'Your financial position looks healthy. Continue maintaining your current financial habits.';

    }


    // ----------------------------------------
    // RETURN RESULT
    // ----------------------------------------

    return {

        month,

        overallPriority,

        summary,

        metrics: {

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
                dashboard.budget.budgetRemaining,

            emergencyCoverage:
                emergencyCoverage.emergencyCoverage,

            riskScore:
                financialRisk.riskScore,

            riskLevel:
                financialRisk.riskLevel,

            totalGoals:
                goalCompletion.totalGoals,

            completedGoals:
                goalCompletion.completedGoals,

            delayedGoals:
                delayedGoals.length

        },

        recommendations

    };
};


module.exports = {
    generatePersonalizedRecommendations
};