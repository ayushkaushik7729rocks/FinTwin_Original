const calculateSimulator = ({
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    months
}) => {

    // --------------------------------
    // 1. VALIDATE INPUT
    // --------------------------------

    if (
        monthlyIncome === undefined ||
        monthlyExpenses === undefined ||
        months === undefined
    ) {
        throw new Error(
            'monthlyIncome, monthlyExpenses and months are required'
        );
    }

    if (
        monthlyIncome < 0 ||
        monthlyExpenses < 0 ||
        months <= 0
    ) {
        throw new Error(
            'Invalid simulator values'
        );
    }

    // --------------------------------
    // 2. CALCULATE MONTHLY SAVINGS
    // --------------------------------

    let savings;

    if (monthlySavings !== undefined) {
        savings = monthlySavings;
    } else {
        savings =
            monthlyIncome - monthlyExpenses;
    }

    // --------------------------------
    // 3. TOTAL SAVINGS
    // --------------------------------

    const projectedSavings =
        savings * months;

    // --------------------------------
    // 4. SAVINGS RATE
    // --------------------------------

    let savingsRate = 0;

    if (monthlyIncome > 0) {
        savingsRate =
            (savings / monthlyIncome) * 100;
    }

    // --------------------------------
    // 5. FINANCIAL STATUS
    // --------------------------------

    let status;

    if (savings < 0) {
        status = 'negative';
    }
    else if (savingsRate < 10) {
        status = 'weak';
    }
    else if (savingsRate < 20) {
        status = 'moderate';
    }
    else if (savingsRate < 30) {
        status = 'good';
    }
    else {
        status = 'excellent';
    }

    // --------------------------------
    // 6. RETURN RESULT
    // --------------------------------

    return {

        monthlyIncome,

        monthlyExpenses,

        monthlySavings: savings,

        savingsRate: Number(
            savingsRate.toFixed(2)
        ),

        months,

        projectedSavings,

        status
    };
};

module.exports = {
    calculateSimulator
};