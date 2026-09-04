const Transaction = require('../models/transaction');

const calculateEmergencyCoverage = async (userId, month) => {

    // --------------------------------
    // 1. GET ALL HISTORICAL TRANSACTIONS
    // --------------------------------

    const allTransactions = await Transaction.find({
        user: userId
    });

    // --------------------------------
    // 2. CALCULATE HISTORICAL NET SAVINGS
    // --------------------------------

    const totalIncome = allTransactions
        .filter(transaction => transaction.type === 'income')
        .reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

    const totalExpenses = allTransactions
        .filter(transaction => transaction.type === 'expense')
        .reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

    const estimatedSavings = totalIncome - totalExpenses;

    // --------------------------------
    // 3. GET EXPENSES FOR SELECTED MONTH
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

    const monthlyTransactions = await Transaction.find({
        user: userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    });

    const monthlyExpenses = monthlyTransactions
        .filter(transaction => transaction.type === 'expense')
        .reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

    // --------------------------------
    // 4. CALCULATE EMERGENCY COVERAGE
    // --------------------------------

    let emergencyCoverage = 0;

    if (
        monthlyExpenses > 0 &&
        estimatedSavings > 0
    ) {
        emergencyCoverage =
            estimatedSavings / monthlyExpenses;
    }

    emergencyCoverage = Number(
        emergencyCoverage.toFixed(2)
    );

    // --------------------------------
    // 5. DETERMINE STATUS
    // --------------------------------

    let status;

    if (emergencyCoverage < 1) {
        status = 'critical';
    }
    else if (emergencyCoverage < 3) {
        status = 'weak';
    }
    else if (emergencyCoverage < 6) {
        status = 'good';
    }
    else {
        status = 'excellent';
    }

    // --------------------------------
    // 6. RECOMMENDED EMERGENCY FUND
    // --------------------------------

    const recommendedEmergencyFund =
        monthlyExpenses * 6;

    const shortfall = Math.max(
        recommendedEmergencyFund - Math.max(estimatedSavings, 0),
        0
    );

    // --------------------------------
    // 7. RETURN RESULT
    // --------------------------------

    return {
        month,

        estimatedSavings,

        monthlyExpenses,

        emergencyCoverage,

        status,

        recommendedEmergencyFund,

        shortfall
    };
};

module.exports = {
    calculateEmergencyCoverage
};