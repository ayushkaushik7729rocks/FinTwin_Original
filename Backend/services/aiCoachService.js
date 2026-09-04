const {
    calculateFinancialRisk
} = require('./financialRiskService');

const {
    calculateSavingsRate
} = require('./savingsService');

const {
    calculateEmergencyCoverage
} = require('./emergencyService');

const {
    calculateGoalCompletion
} = require('./goalCompletionService');

const {
    calculateGoalDelay
} = require('./goalDelayService');


const generateAICoach = async (userId, month) => {

    /*
     * Get all financial metrics
     */

    const financialRisk =
        await calculateFinancialRisk(
            userId,
            month
        );

    const savingsRate =
        await calculateSavingsRate(
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


    /*
     * Generate recommendations
     */

    const recommendations = [];


    // -------------------------
    // SAVINGS
    // -------------------------

    if (savingsRate.savingsRate < 10) {

        recommendations.push({
            category: 'savings',
            priority: 'high',
            message:
                'Your savings rate is very low. Try to reduce unnecessary expenses and increase the amount you save each month.'
        });

    }
    else if (savingsRate.savingsRate < 20) {

        recommendations.push({
            category: 'savings',
            priority: 'medium',
            message:
                'Your savings rate is moderate. Try to gradually increase your monthly savings.'
        });

    }
    else {

        recommendations.push({
            category: 'savings',
            priority: 'low',
            message:
                'Your savings rate looks healthy. Continue maintaining your current saving habits.'
        });

    }


    // -------------------------
    // BUDGET
    // -------------------------

    const budgetUsed =
        financialRisk.metrics.budgetUsedPercentage;


    if (budgetUsed > 100) {

        recommendations.push({
            category: 'budget',
            priority: 'high',
            message:
                'You have exceeded your monthly budget. Review your expenses and reduce unnecessary spending.'
        });

    }
    else if (budgetUsed >= 80) {

        recommendations.push({
            category: 'budget',
            priority: 'medium',
            message:
                'You are close to your monthly budget limit. Be careful with additional spending.'
        });

    }
    else {

        recommendations.push({
            category: 'budget',
            priority: 'low',
            message:
                'Your current spending is within your budget.'
        });

    }


    // -------------------------
    // EMERGENCY FUND
    // -------------------------

    const emergencyMonths =
        emergencyCoverage.emergencyCoverage;


    if (emergencyMonths < 1) {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'high',
            message:
                'Your emergency coverage is very low. Building an emergency fund should be a priority.'
        });

    }
    else if (emergencyMonths < 3) {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'high',
            message:
                'Your emergency fund covers less than 3 months of expenses. Try to build it toward at least 3 months.'
        });

    }
    else if (emergencyMonths < 6) {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'medium',
            message:
                'Your emergency fund is reasonable, but consider increasing it toward 6 months of expenses.'
        });

    }
    else {

        recommendations.push({
            category: 'emergency_fund',
            priority: 'low',
            message:
                'Your emergency fund provides strong financial protection.'
        });

    }


    // -------------------------
    // FINANCIAL RISK
    // -------------------------

    if (
        financialRisk.riskLevel === 'very_high'
        ||
        financialRisk.riskLevel === 'high'
    ) {

        recommendations.push({
            category: 'risk',
            priority: 'high',
            message:
                'Your financial risk is high. Focus on reducing expenses, improving savings and strengthening your emergency fund.'
        });

    }
    else if (
        financialRisk.riskLevel === 'moderate'
    ) {

        recommendations.push({
            category: 'risk',
            priority: 'medium',
            message:
                'Your financial risk is moderate. Small improvements in savings and spending can strengthen your financial position.'
        });

    }
    else {

        recommendations.push({
            category: 'risk',
            priority: 'low',
            message:
                'Your financial risk is currently low. Continue maintaining healthy financial habits.'
        });

    }


    // -------------------------
    // GOALS
    // -------------------------

    if (goalCompletion.totalGoals === 0) {

        recommendations.push({
            category: 'goals',
            priority: 'medium',
            message:
                'You currently have no financial goals. Consider creating a goal for something important you want to achieve.'
        });

    }
    else if (
        goalCompletion.completionRate === 100
    ) {

        recommendations.push({
            category: 'goals',
            priority: 'low',
            message:
                'You have completed all your financial goals. Great job!'
        });

    }


    // -------------------------
    // GOAL DELAY
    // -------------------------

    const delayedGoals =
        goalDelay.details.filter(
            goal =>
                goal.status === 'delayed'
                ||
                goal.status === 'overdue'
        );


    if (delayedGoals.length > 0) {

        recommendations.push({
            category: 'goal_delay',
            priority: 'high',
            message:
                `You currently have ${delayedGoals.length} goal(s) that may not be completed on time. Consider increasing your monthly contributions.`
        });

    }


    /*
     * Find highest priority recommendation
     */

    let overallPriority = 'low';

    if (
        recommendations.some(
            item => item.priority === 'high'
        )
    ) {
        overallPriority = 'high';
    }
    else if (
        recommendations.some(
            item => item.priority === 'medium'
        )
    ) {
        overallPriority = 'medium';
    }


    /*
     * Create summary
     */

    let summary;

    if (overallPriority === 'high') {

        summary =
            'Your finances need attention in a few important areas. Focus on the high-priority recommendations first.';

    }
    else if (overallPriority === 'medium') {

        summary =
            'Your financial position is generally stable, but there are some areas where you can improve.';

    }
    else {

        summary =
            'Your financial position looks healthy. Continue maintaining your current financial habits.';

    }


    return {

        month,

        summary,

        overallPriority,

        metrics: {

            savingsRate:
                savingsRate.savingsRate,

            savings:
                savingsRate.savings,

            budgetUsedPercentage:
                financialRisk.metrics.budgetUsedPercentage,

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
    generateAICoach
};