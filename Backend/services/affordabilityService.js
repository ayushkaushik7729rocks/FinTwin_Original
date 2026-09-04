const calculateAffordability = ({
    monthlyIncome,
    monthlyExpenses,
    purchaseAmount
}) => {

    // --------------------------------
    // 1. VALIDATION
    // --------------------------------

    if (
        monthlyIncome === undefined ||
        monthlyExpenses === undefined ||
        purchaseAmount === undefined
    ) {
        throw new Error(
            'monthlyIncome, monthlyExpenses and purchaseAmount are required'
        );
    }

    if (
        monthlyIncome < 0 ||
        monthlyExpenses < 0 ||
        purchaseAmount < 0
    ) {
        throw new Error(
            'Values cannot be negative'
        );
    }

    // --------------------------------
    // 2. MONTHLY SAVINGS
    // --------------------------------

    const monthlySavings =
        monthlyIncome - monthlyExpenses;

    // --------------------------------
    // 3. PURCHASE AS % OF INCOME
    // --------------------------------

    let purchasePercentage = 0;

    if (monthlyIncome > 0) {

        purchasePercentage =
            (purchaseAmount / monthlyIncome) * 100;
    }

    // --------------------------------
    // 4. MONTHS OF SAVINGS REQUIRED
    // --------------------------------

    let monthsRequired = 0;

    if (monthlySavings > 0) {

        monthsRequired =
            purchaseAmount / monthlySavings;
    }

    // --------------------------------
    // 5. REMAINING MONEY AFTER PURCHASE
    // --------------------------------

    const remainingMoney =
        monthlySavings - purchaseAmount;

    // --------------------------------
    // 6. AFFORDABILITY STATUS
    // --------------------------------

    let status;

    if (monthlySavings <= 0) {

        status = 'unaffordable';

    }
    else if (
        purchaseAmount <= monthlySavings * 1
    ) {

        status = 'safe';

    }
    else if (
        purchaseAmount <= monthlySavings * 3
    ) {

        status = 'risky';

    }
    else {

        status = 'unaffordable';
    }

    // --------------------------------
    // 7. RECOMMENDATION
    // --------------------------------

    let recommendation;

    if (status === 'safe') {

        recommendation =
            'You can afford this purchase with your current monthly savings.';

    }
    else if (status === 'risky') {

        recommendation =
            'This purchase is possible, but it may put pressure on your savings.';

    }
    else {

        recommendation =
            'This purchase may negatively affect your financial stability. Consider delaying it or reducing the purchase amount.';
    }

    // --------------------------------
    // 8. RETURN
    // --------------------------------

    return {

        monthlyIncome,

        monthlyExpenses,

        monthlySavings,

        purchaseAmount,

        purchasePercentage: Number(
            purchasePercentage.toFixed(2)
        ),

        monthsRequired: Number(
            monthsRequired.toFixed(2)
        ),

        remainingMoney,

        status,

        recommendation
    };
};

module.exports = {
    calculateAffordability
};