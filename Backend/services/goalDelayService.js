const Goal = require('../models/goals');

const calculateGoalDelay = async (userId) => {

    const goals = await Goal.find({
        user: userId
    });

    const today = new Date();

    const details = goals.map(goal => {

        const target = goal.target;
        const current = goal.current;

        const remainingAmount = Math.max(
            target - current,
            0
        );

        // Goal already completed
        if (remainingAmount === 0) {
            return {
                id: goal._id,
                name: goal.name,
                target,
                current,
                remainingAmount: 0,
                contribution: goal.contribution,
                goalDate: goal.date,
                status: 'completed',
                monthsNeeded: 0,
                expectedCompletionDate: today,
                delayMonths: 0,
                requiredMonthlyContribution: 0,
                priority: goal.priority
            };
        }

        const goalDate = new Date(goal.date);

        // Calculate months available until deadline
        let monthsUntilDeadline =
            (goalDate.getFullYear() - today.getFullYear()) * 12 +
            (goalDate.getMonth() - today.getMonth());

        if (monthsUntilDeadline < 0) {
            monthsUntilDeadline = 0;
        }

        // Required monthly contribution to reach goal on time
        let requiredMonthlyContribution = 0;

        if (monthsUntilDeadline > 0) {
            requiredMonthlyContribution =
                remainingAmount / monthsUntilDeadline;
        }

        requiredMonthlyContribution =
            Number(
                requiredMonthlyContribution.toFixed(2)
            );

        // Cannot predict without contribution
        if (goal.contribution <= 0) {

            return {
                id: goal._id,
                name: goal.name,
                target,
                current,
                remainingAmount,
                contribution: goal.contribution,
                goalDate: goal.date,
                status:
                    goalDate < today
                        ? 'overdue'
                        : 'no_contribution',
                monthsNeeded: null,
                expectedCompletionDate: null,
                delayMonths: null,
                requiredMonthlyContribution,
                priority: goal.priority
            };
        }

        // Number of months needed with current contribution
        const monthsNeeded = Math.ceil(
            remainingAmount / goal.contribution
        );

        // Calculate expected completion date
        const expectedCompletionDate =
            new Date(today);

        expectedCompletionDate.setMonth(
            expectedCompletionDate.getMonth() +
            monthsNeeded
        );

        let delayMonths = 0;
        let status;

        if (goalDate < today) {

            status = 'overdue';

            delayMonths =
                monthsNeeded;

        }
        else if (
            expectedCompletionDate <= goalDate
        ) {

            status = 'on_time';

            delayMonths = 0;

        }
        else {

            status = 'delayed';

            delayMonths =
                (
                    expectedCompletionDate.getFullYear()
                    - goalDate.getFullYear()
                ) * 12
                +
                (
                    expectedCompletionDate.getMonth()
                    - goalDate.getMonth()
                );

            delayMonths =
                Math.max(delayMonths, 0);
        }

        return {
            id: goal._id,
            name: goal.name,
            target,
            current,
            remainingAmount,
            contribution: goal.contribution,
            goalDate: goal.date,
            status,
            monthsNeeded,
            expectedCompletionDate,
            delayMonths,
            requiredMonthlyContribution,
            priority: goal.priority
        };
    });

    const totalGoals = details.length;

    const onTimeGoals = details.filter(
        goal => goal.status === 'on_time'
    ).length;

    const delayedGoals = details.filter(
        goal => goal.status === 'delayed'
    ).length;

    const completedGoals = details.filter(
        goal => goal.status === 'completed'
    ).length;

    const overdueGoals = details.filter(
        goal => goal.status === 'overdue'
    ).length;

    return {
        totalGoals,
        onTimeGoals,
        delayedGoals,
        completedGoals,
        overdueGoals,
        details
    };
};

module.exports = {
    calculateGoalDelay
};