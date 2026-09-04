const Budget = require('../models/budget');
const Transaction = require('../models/transaction');


// Calculate budget for a particular month
const calculateBudget = async (userId, month) => {

    // --------------------------------
    // FIND BUDGET
    // --------------------------------

    const budget = await Budget.findOne({
        user: userId,
        month: month
    });

    if (!budget) {
        return null;
    }


    // --------------------------------
    // FIND MONTH/YEAR FROM BUDGET
    // --------------------------------

    const [monthName, yearString] = month.split(' ');

    const year = Number(yearString);

    const monthNumber = new Date(
        `${monthName} 1, ${year}`
    ).getMonth();


    // Start of month
    const startDate = new Date(
        year,
        monthNumber,
        1
    );

    // Start of next month
    const endDate = new Date(
        year,
        monthNumber + 1,
        1
    );


    // --------------------------------
    // GET EXPENSE TRANSACTIONS
    // --------------------------------

    const transactions = await Transaction.find({
        user: userId,
        type: 'expense',
        date: {
            $gte: startDate,
            $lt: endDate
        }
    });


    // --------------------------------
    // CALCULATE SPENDING BY CATEGORY
    // --------------------------------

    const spendingMap = {};

    transactions.forEach(transaction => {

        const category = transaction.category;

        if (!spendingMap[category]) {
            spendingMap[category] = 0;
        }

        spendingMap[category] += transaction.amount;

    });


    // --------------------------------
    // CATEGORY ANALYSIS
    // --------------------------------

    const categoryAnalysis = budget.categories.map(category => {

        const spent = spendingMap[category.name] || 0;

        const limit = category.limit;

        const remaining = limit - spent;

        let percentageUsed = 0;

        if (limit > 0) {
            percentageUsed = (spent / limit) * 100;
        }


        let status;

        if (spent > limit) {
            status = 'over_budget';
        }
        else if (percentageUsed >= 80) {
            status = 'warning';
        }
        else {
            status = 'safe';
        }


        return {
            category: category.name,
            limit,
            spent,
            remaining,
            percentageUsed: Number(
                percentageUsed.toFixed(2)
            ),
            status
        };

    });


    // --------------------------------
    // TOTAL SPENDING
    // --------------------------------

    const totalSpent = transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );


    // --------------------------------
    // REMAINING TOTAL BUDGET
    // --------------------------------

    const remainingBudget =
        budget.totalBudget - totalSpent;


    // --------------------------------
    // TOTAL BUDGET USED %
    // --------------------------------

    let budgetUsedPercentage = 0;

    if (budget.totalBudget > 0) {

        budgetUsedPercentage =
            (totalSpent / budget.totalBudget) * 100;

    }


    // --------------------------------
    // ALLOCATED CATEGORY BUDGET
    // --------------------------------

    const allocatedCategoryBudget =
        budget.categories.reduce(
            (sum, category) => sum + category.limit,
            0
        );


    // --------------------------------
    // UNALLOCATED BUDGET
    // --------------------------------

    const unallocatedBudget =
        budget.totalBudget - allocatedCategoryBudget;


    // --------------------------------
    // OVERALL STATUS
    // --------------------------------

    let overallStatus;

    if (totalSpent > budget.totalBudget) {
        overallStatus = 'over_budget';
    }
    else if (budgetUsedPercentage >= 80) {
        overallStatus = 'warning';
    }
    else {
        overallStatus = 'safe';
    }


    // --------------------------------
    // FIND UNBUDGETED CATEGORIES
    // --------------------------------

    const budgetedCategoryNames =
        budget.categories.map(category =>
            category.name.toLowerCase()
        );


    const unbudgetedCategories = [];

    Object.entries(spendingMap).forEach(
        ([category, amount]) => {

            if (
                !budgetedCategoryNames.includes(
                    category.toLowerCase()
                )
            ) {

                unbudgetedCategories.push({
                    category,
                    spent: amount
                });

            }

        }
    );


    // --------------------------------
    // RETURN RESULT
    // --------------------------------

    return {

        month: budget.month,

        totalBudget: budget.totalBudget,

        totalSpent,

        remainingBudget,

        budgetUsedPercentage: Number(
            budgetUsedPercentage.toFixed(2)
        ),

        allocatedCategoryBudget,

        unallocatedBudget,

        overallStatus,

        categories: categoryAnalysis,

        unbudgetedCategories

    };

};


module.exports = {
    calculateBudget
};