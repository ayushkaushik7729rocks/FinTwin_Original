const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const { getDashboardData } = require('../services/dashboardService');

const { calculateFinancialTwin } = require('../services/financialTwinService');

const {
    calculateResilienceScore
} = require('../services/resilienceService');

const {
    calculateSavingsRate
} = require('../services/savingsService');

const {
    calculateEmergencyCoverage
} = require('../services/emergencyService');

const {
    calculateGoalCompletion
} = require('../services/goalCompletionService');

const {
    calculateSimulator
} = require('../services/simulatorService');

const {
    calculateAffordability
} = require('../services/affordabilityService');

const {
    calculateFinancialRisk
} = require('../services/financialRiskService');

const {
    calculateGoalDelay
} = require('../services/goalDelayService');

const {
    generateAICoach
} = require('../services/aiCoachService');

const {
    generateFinancialInsights
} = require('../services/financialInsightsService');

const {
    answerUserQuestion
} = require('../services/userQuestionService');

const {
    generatePersonalizedRecommendations
} = require('../services/personalizedRecommendationService');

const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {

    try {

        const dashboard = await getDashboardData(req.userId);

        res.status(200).json({
            message: 'Dashboard data fetched successfully',
            dashboard
        });

    } catch (error) {

        console.error('Dashboard error:', error);

        res.status(500).json({
            message: 'Server error'
        });

    }

});
// ========================================
// FINANCIAL TWIN
// GET /dashboard/financial-twin
// ========================================

router.get('/financial-twin', authMiddleware, async (req, res) => {

    try {

        let { month } = req.query;


        // If month is not provided,
        // automatically use current month

        if (!month) {

            const now = new Date();

            const monthName = now.toLocaleString(
                'en-US',
                {
                    month: 'long'
                }
            );

            const year = now.getFullYear();

            month = `${monthName} ${year}`;
        }


        const financialTwin =
            await calculateFinancialTwin(
                req.userId,
                month
            );


        res.status(200).json({

            message: 'Financial Twin calculated successfully',

            financialTwin

        });


    } catch (error) {

        console.error(
            'Financial Twin error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }

});


// RESILIENCE SCORE
router.get('/resilience', authMiddleware, async (req, res) => {

    try {

        let { month } = req.query;

        if (!month) {

            const now = new Date();

            const monthName = now.toLocaleString(
                'en-US',
                {
                    month: 'long'
                }
            );

            const year = now.getFullYear();

            month = `${monthName} ${year}`;
        }


        const resilience =
            await calculateResilienceScore(
                req.userId,
                month
            );


        res.status(200).json({

            message:
                'Resilience score calculated successfully',

            resilience

        });

    } catch (error) {

        console.error(
            'Resilience score error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }

});

// SAVINGS RATE
router.get('/savings-rate', authMiddleware, async (req, res) => {

    try {

        let { month } = req.query;

        if (!month) {

            const now = new Date();

            const monthName = now.toLocaleString(
                'en-US',
                {
                    month: 'long'
                }
            );

            const year = now.getFullYear();

            month = `${monthName} ${year}`;
        }


        const savingsRate =
            await calculateSavingsRate(
                req.userId,
                month
            );


        res.status(200).json({

            message:
                'Savings rate calculated successfully',

            savingsRate

        });

    } catch (error) {

        console.error(
            'Savings rate error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }

});


router.get('/emergency-coverage', authMiddleware, async (req, res) => {

    try {

        let { month } = req.query;

        // If month is not provided,
        // use current month

        if (!month) {

            const now = new Date();

            const monthName = now.toLocaleString(
                'en-US',
                {
                    month: 'long'
                }
            );

            const year = now.getFullYear();

            month = `${monthName} ${year}`;
        }

        const emergencyCoverage =
            await calculateEmergencyCoverage(
                req.userId,
                month
            );

        res.status(200).json({

            message:
                'Emergency coverage calculated successfully',

            emergencyCoverage

        });

    } catch (error) {

        console.error(
            'Emergency coverage error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }

});

router.get('/goal-completion', authMiddleware, async (req, res) => {

    try {

        const goalCompletion =
            await calculateGoalCompletion(
                req.userId
            );

        res.status(200).json({

            message:
                'Goal completion calculated successfully',

            goalCompletion

        });

    } catch (error) {

        console.error(
            'Goal completion error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });

    }

});

router.get('/simulator', authMiddleware, async (req, res) => {

    try {

        const {
            monthlyIncome,
            monthlyExpenses,
            monthlySavings,
            months
        } = req.query;

        if (
            monthlyIncome === undefined ||
            monthlyExpenses === undefined ||
            months === undefined
        ) {
            return res.status(400).json({
                message:
                    'monthlyIncome, monthlyExpenses and months are required'
            });
        }

        const result = calculateSimulator({

            monthlyIncome:
                Number(monthlyIncome),

            monthlyExpenses:
                Number(monthlyExpenses),

            monthlySavings:
                monthlySavings !== undefined
                    ? Number(monthlySavings)
                    : undefined,

            months:
                Number(months)
        });

        res.status(200).json({

            message:
                'Financial simulation calculated successfully',

            simulation: result

        });

    } catch (error) {

        console.error(
            'Simulator error:',
            error
        );

        res.status(400).json({
            message: error.message
        });
    }
});

router.get('/affordability', authMiddleware, async (req, res) => {

    try {

        const {
            monthlyIncome,
            monthlyExpenses,
            purchaseAmount
        } = req.query;

        if (
            monthlyIncome === undefined ||
            monthlyExpenses === undefined ||
            purchaseAmount === undefined
        ) {
            return res.status(400).json({
                message:
                    'monthlyIncome, monthlyExpenses and purchaseAmount are required'
            });
        }

        const result =
            calculateAffordability({

                monthlyIncome:
                    Number(monthlyIncome),

                monthlyExpenses:
                    Number(monthlyExpenses),

                purchaseAmount:
                    Number(purchaseAmount)
            });

        res.status(200).json({

            message:
                'Affordability calculated successfully',

            affordability: result

        });

    } catch (error) {

        console.error(
            'Affordability error:',
            error
        );

        res.status(400).json({
            message: error.message
        });
    }
});

router.get('/financial-risk', authMiddleware, async (req, res) => {

    try {

        let { month } = req.query;

        if (!month) {

            const now = new Date();

            const monthName = now.toLocaleString(
                'en-US',
                {
                    month: 'long'
                }
            );

            const year = now.getFullYear();

            month = `${monthName} ${year}`;
        }

        const financialRisk =
            await calculateFinancialRisk(
                req.userId,
                month
            );

        res.status(200).json({

            message:
                'Financial risk calculated successfully',

            financialRisk

        });

    } catch (error) {

        console.error(
            'Financial risk error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
});

router.get('/goal-delay', authMiddleware, async (req, res) => {
    try {

        const goalDelay =
            await calculateGoalDelay(req.userId);

        res.status(200).json({
            message:
                'Goal delay prediction calculated successfully',
            goalDelay
        });

    } catch (error) {

        console.error(
            'Goal delay error:',
            error
        );

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// ========================================
// AI COACH
// GET /dashboard/ai-coach
// ========================================

router.get('/ai-coach', authMiddleware, async (req, res) => {

    try {

        let { month } = req.query;

        if (!month) {

            const now = new Date();

            const monthName =
                now.toLocaleString(
                    'en-US',
                    {
                        month: 'long'
                    }
                );

            const year =
                now.getFullYear();

            month =
                `${monthName} ${year}`;
        }


        const aiCoach =
            await generateAICoach(
                req.userId,
                month
            );


        res.status(200).json({

            message:
                'AI Coach recommendations generated successfully',

            aiCoach

        });

    }
    catch (error) {

        console.error(
            'AI Coach error:',
            error
        );

        res.status(500).json({

            message:
                'Server error'

        });

    }

});

// ========================================
// FINANCIAL INSIGHTS
// GET /dashboard/financial-insights
// ========================================

router.get(
    '/financial-insights',
    authMiddleware,
    async (req, res) => {

        try {

            const financialInsights =
                await generateFinancialInsights(
                    req.userId
                );


            res.status(200).json({

                message:
                    'Financial insights generated successfully',

                financialInsights

            });

        }
        catch (error) {

            console.error(
                'Financial insights error:',
                error
            );


            res.status(500).json({

                message:
                    'Server error'

            });

        }

    }
);

router.post(
    '/ask',
    authMiddleware,
    async (req, res) => {

        try {

            const {
                question,
                month
            } = req.body;


            if (!question) {

                return res.status(400).json({
                    message:
                        'Question is required'
                });

            }


            let selectedMonth = month;


            if (!selectedMonth) {

                const now = new Date();

                const monthName =
                    now.toLocaleString(
                        'en-US',
                        {
                            month: 'long'
                        }
                    );

                const year =
                    now.getFullYear();

                selectedMonth =
                    `${monthName} ${year}`;
            }


            const result =
                await answerUserQuestion(
                    req.userId,
                    question,
                    selectedMonth
                );


            res.status(200).json({

                message:
                    'Question answered successfully',

                result

            });

        }
        catch (error) {

            console.error(
                'User question error:',
                error
            );

            res.status(500).json({

                message:
                    'Server error'

            });

        }

    }
);

router.get(
    '/recommendations',
    authMiddleware,
    async (req, res) => {

        try {

            let { month } = req.query;


            if (!month) {

                const now = new Date();

                const monthName =
                    now.toLocaleString(
                        'en-US',
                        {
                            month: 'long'
                        }
                    );

                const year =
                    now.getFullYear();

                month =
                    `${monthName} ${year}`;

            }


            const recommendations =
                await generatePersonalizedRecommendations(
                    req.userId,
                    month
                );


            res.status(200).json({

                message:
                    'Personalized recommendations generated successfully',

                recommendations

            });

        }
        catch (error) {

            console.error(
                'Personalized recommendation error:',
                error
            );

            res.status(500).json({

                message:
                    'Server error'

            });

        }

    }
);

module.exports = router;