const { getDashboardData } =
    require('./dashboardService');

const {
    calculateFinancialRisk
} = require('./financialRiskService');

const {
    calculateEmergencyCoverage
} = require('./emergencyService');

const {
    calculateGoalCompletion
} = require('./goalCompletionService');


const answerUserQuestion = async (
    userId,
    question,
    month
) => {

    if (!question || question.trim() === '') {
        throw new Error(
            'Question is required'
        );
    }


    // Convert question to lowercase
    const q = question.toLowerCase();


    // ----------------------------------------
    // GET FINANCIAL DATA
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


    // ----------------------------------------
    // 1. SAVINGS QUESTION
    // ----------------------------------------

    if (
        q.includes('save') ||
        q.includes('saving')
    ) {

        return {
            question,

            category: 'savings',

            answer:
                `You saved ₹${dashboard.monthlySavings} this month, which is ${dashboard.savingsRate}% of your income.`,

            data: {
                monthlyIncome:
                    dashboard.monthlyIncome,

                monthlyExpenses:
                    dashboard.monthlyExpenses,

                monthlySavings:
                    dashboard.monthlySavings,

                savingsRate:
                    dashboard.savingsRate
            }
        };
    }


    // ----------------------------------------
    // 2. EXPENSE QUESTION
    // ----------------------------------------

    if (
        q.includes('expense') ||
        q.includes('spend') ||
        q.includes('spent')
    ) {

        return {
            question,

            category: 'expenses',

            answer:
                `You spent ₹${dashboard.monthlyExpenses} this month.`,

            data: {
                monthlyExpenses:
                    dashboard.monthlyExpenses
            }
        };
    }


    // ----------------------------------------
    // 3. BUDGET QUESTION
    // ----------------------------------------

    if (
        q.includes('budget')
    ) {

        return {
            question,

            category: 'budget',

            answer:
                `You have used ${dashboard.budget.budgetUsedPercentage}% of your budget. ₹${dashboard.budget.budgetRemaining} is remaining.`,

            data: {
                totalBudget:
                    dashboard.budget.totalBudget,

                budgetUsed:
                    dashboard.budget.budgetUsed,

                budgetRemaining:
                    dashboard.budget.budgetRemaining,

                budgetUsedPercentage:
                    dashboard.budget.budgetUsedPercentage
            }
        };
    }


    // ----------------------------------------
    // 4. RISK QUESTION
    // ----------------------------------------

    if (
        q.includes('risk') ||
        q.includes('financial risk')
    ) {

        return {
            question,

            category: 'risk',

            answer:
                `Your current financial risk is ${financialRisk.riskLevel}, with a risk score of ${financialRisk.riskScore}.`,

            data: {
                riskScore:
                    financialRisk.riskScore,

                riskLevel:
                    financialRisk.riskLevel
            }
        };
    }


    // ----------------------------------------
    // 5. EMERGENCY FUND QUESTION
    // ----------------------------------------

    if (
        q.includes('emergency') ||
        q.includes('emergency fund')
    ) {

        return {
            question,

            category: 'emergency_fund',

            answer:
                `Your estimated emergency coverage is ${emergencyCoverage.emergencyCoverage} months.`,

            data: {
                emergencyCoverage:
                    emergencyCoverage.emergencyCoverage,

                status:
                    emergencyCoverage.status,

                recommendedEmergencyFund:
                    emergencyCoverage.recommendedEmergencyFund,

                shortfall:
                    emergencyCoverage.shortfall
            }
        };
    }


    // ----------------------------------------
    // 6. GOAL QUESTION
    // ----------------------------------------

    if (
        q.includes('goal') ||
        q.includes('goals')
    ) {

        return {
            question,

            category: 'goals',

            answer:
                `You currently have ${goalCompletion.totalGoals} financial goals, and ${goalCompletion.completedGoals} of them are completed.`,

            data: {
                totalGoals:
                    goalCompletion.totalGoals,

                completedGoals:
                    goalCompletion.completedGoals,

                activeGoals:
                    goalCompletion.activeGoals,

                completionRate:
                    goalCompletion.completionRate,

                overallProgress:
                    goalCompletion.overallProgress
            }
        };
    }


    // ----------------------------------------
    // 7. INCOME QUESTION
    // ----------------------------------------

    if (
        q.includes('income') ||
        q.includes('salary') ||
        q.includes('earn')
    ) {

        return {
            question,

            category: 'income',

            answer:
                `Your income this month is ₹${dashboard.monthlyIncome}.`,

            data: {
                monthlyIncome:
                    dashboard.monthlyIncome
            }
        };
    }


    // ----------------------------------------
    // 8. GENERAL FINANCIAL QUESTION
    // ----------------------------------------

    if (
        q.includes('financial') ||
        q.includes('finance') ||
        q.includes('healthy') ||
        q.includes('good')
    ) {

        return {
            question,

            category: 'financial_health',

            answer:
                `Your current savings rate is ${dashboard.savingsRate}%, your budget usage is ${dashboard.budget.budgetUsedPercentage}%, and your financial risk is ${financialRisk.riskLevel}.`,

            data: {
                savingsRate:
                    dashboard.savingsRate,

                budgetUsedPercentage:
                    dashboard.budget.budgetUsedPercentage,

                riskLevel:
                    financialRisk.riskLevel,

                riskScore:
                    financialRisk.riskScore
            }
        };
    }


    // ----------------------------------------
    // UNKNOWN QUESTION
    // ----------------------------------------

    return {
        question,

        category: 'unknown',

        answer:
            'I can currently answer questions about your income, expenses, savings, budget, financial risk, emergency fund and goals.',

        data: null
    };
};


module.exports = {
    answerUserQuestion
};