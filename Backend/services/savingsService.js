const Transaction = require('../models/transaction');

const calculateSavingsRate = async (userId, month) => {

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


    // --------------------------------
    // 3. CALCULATE INCOME
    // --------------------------------

    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );


    // --------------------------------
    // 4. CALCULATE EXPENSES
    // --------------------------------

    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );


    // --------------------------------
    // 5. CALCULATE SAVINGS
    // --------------------------------

    const savings = income - expenses;


    // --------------------------------
    // 6. CALCULATE SAVINGS RATE
    // --------------------------------

    let savingsRate = 0;

    if (income > 0) {
        savingsRate =
            (savings / income) * 100;
    }


    // --------------------------------
    // 7. DETERMINE STATUS
    // --------------------------------

    let status;

    if (income === 0) {
        status = 'no_income';
    }
    else if (savingsRate < 0) {
        status = 'negative';
    }
    else if (savingsRate < 10) {
        status = 'low';
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
    // 8. RETURN RESULT
    // --------------------------------

    return {

        month,

        income,

        expenses,

        savings,

        savingsRate: Number(
            savingsRate.toFixed(2)
        ),

        status

    };
};


module.exports = {
    calculateSavingsRate
};