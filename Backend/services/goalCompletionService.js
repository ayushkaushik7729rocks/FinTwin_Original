const Goal = require('../models/goals');

const calculateGoalCompletion = async (userId) => {

    const goals = await Goal.find({
        user: userId
    });

    const today = new Date();

    const details = goals.map(goal => {

        const target = goal.target;
        const current = goal.current;

        // -----------------------------
        // PROGRESS
        // -----------------------------

        let progress = 0;

        if (target > 0) {
            progress = (current / target) * 100;
        }

        progress = Math.min(progress, 100);

        // -----------------------------
        // REMAINING AMOUNT
        // -----------------------------

        const remainingAmount = Math.max(
            target - current,
            0
        );

        // -----------------------------
        // DAYS REMAINING
        // -----------------------------

        const goalDate = new Date(goal.date);

        const difference =
            goalDate.getTime() - today.getTime();

        const daysRemaining = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

        // -----------------------------
        // STATUS
        // -----------------------------

        let status;

        if (current >= target) {
            status = 'completed';
        }
        else if (daysRemaining < 0) {
            status = 'overdue';
        }
        else if (progress >= 75) {
            status = 'on_track';
        }
        else if (progress >= 40) {
            status = 'progressing';
        }
        else {
            status = 'behind';
        }

        return {
            id: goal._id,
            name: goal.name,
            target,
            current,
            remainingAmount,

            progress: Number(
                progress.toFixed(2)
            ),

            date: goal.date,
            daysRemaining,

            contribution: goal.contribution,
            priority: goal.priority,

            status
        };
    });

    // -----------------------------
    // SUMMARY
    // -----------------------------

    const totalGoals = goals.length;

    const completedGoals = details.filter(
        goal => goal.status === 'completed'
    ).length;

    const activeGoals =
        totalGoals - completedGoals;

    let overallProgress = 0;

    if (totalGoals > 0) {

        overallProgress =
            details.reduce(
                (sum, goal) => sum + goal.progress,
                0
            ) / totalGoals;
    }

    return {
        totalGoals,
        completedGoals,
        activeGoals,

        completionRate: Number(
            (
                totalGoals > 0
                    ? (completedGoals / totalGoals) * 100
                    : 0
            ).toFixed(2)
        ),

        overallProgress: Number(
            overallProgress.toFixed(2)
        ),

        details
    };
};

module.exports = {
    calculateGoalCompletion
};