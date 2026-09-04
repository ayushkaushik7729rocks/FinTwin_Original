// ========================================
// FinTwin Real Backend API
// ========================================

const API_BASE_URL = 'http://localhost:3000';


// ========================================
// GET TOKEN
// ========================================

function getToken() {
    return localStorage.getItem('token');
}


// ========================================
// COMMON REQUEST FUNCTION
// ========================================

async function request(
    endpoint,
    options = {}
) {

    const token = getToken();

    const headers = {
        ...(options.body
            ? { 'Content-Type': 'application/json' }
            : {}),
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {})
    };

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            }
        }
    );

    let data;

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (!response.ok) {

        throw new Error(
            data.message ||
            'Something went wrong'
        );
    }

    return data;
}


// ========================================
// AUTH
// ========================================

export const api = {

    // ------------------------------------
    // SIGNUP
    // ------------------------------------

    signup: async (user) => {

        const result = await request(
            '/api/auth/signup',
            {
                method: 'POST',
                body: JSON.stringify(user)
            }
        );

        if (result.token) {
            localStorage.setItem(
                'token',
                result.token
            );
        }

        return result;
    },


    // ------------------------------------
    // LOGIN
    // ------------------------------------

    login: async (credentials) => {

        const result = await request(
            '/api/auth/login',
            {
                method: 'POST',
                body: JSON.stringify(credentials)
            }
        );

        if (result.token) {
            localStorage.setItem(
                'token',
                result.token
            );
        }

        return result;
    },


    // ------------------------------------
    // LOGOUT
    // ------------------------------------

    logout: () => {

        localStorage.removeItem('token');

        window.location.href =
            'login.html';
    },


    // ------------------------------------
    // PROFILE
    // ------------------------------------

    getProfile: async () => {

        const result =
            await request(
                '/api/auth/profile'
            );

        return result.user;
    },

    updateProfile: async (profile) => {
        const result = await request('/api/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(profile)
        });

        return result.user;
    },


    // ====================================
    // TRANSACTIONS
    // ====================================

    getTransactions: async () => {

        const result =
            await request(
                '/api/transactions'
            );

        return result.transactions;
    },


    createTransaction: async (
        transaction
    ) => {

        const result =
            await request(
                '/api/transactions',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        transaction
                    )
                }
            );

        return result.transaction;
    },


    deleteTransaction: async (id) => {

        return await request(
            `/api/transactions/${id}`,
            {
                method: 'DELETE'
            }
        );
    },


    updateTransaction: async (
        id,
        transaction
    ) => {

        const result =
            await request(
                `/api/transactions/${id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(
                        transaction
                    )
                }
            );

        return result.transaction;
    },


    // ====================================
    // GOALS
    // ====================================

    getGoals: async () => {

        const result =
            await request(
                '/api/goals'
            );

        return result.goals;
    },


    createGoal: async (goal) => {

        const result =
            await request(
                '/api/goals',
                {
                    method: 'POST',
                    body: JSON.stringify(goal)
                }
            );

        return result.goal;
    },


    getGoal: async (id) => {

        const result =
            await request(
                `/api/goals/${id}`
            );

        return result.goal;
    },


    updateGoal: async (
        id,
        goal
    ) => {

        const result =
            await request(
                `/api/goals/${id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(goal)
                }
            );

        return result.goal;
    },


    deleteGoal: async (id) => {

        return await request(
            `/api/goals/${id}`,
            {
                method: 'DELETE'
            }
        );
    },


    // ====================================
    // BUDGET
    // ====================================

    getBudget: async () => {

        const result =
            await request(
                '/api/budgets'
            );

        return result.budgets;
    },


    createBudget: async (budget) => {

        const result =
            await request(
                '/api/budgets',
                {
                    method: 'POST',
                    body: JSON.stringify(budget)
                }
            );

        return result.budget;
    },


    getBudgetCalculation: async (
        month
    ) => {

        const result =
            await request(
                `/api/budgets/calculation?month=${encodeURIComponent(month)}`
            );

        return result.budget;
    },


    updateBudget: async (
        id,
        budget
    ) => {

        const result =
            await request(
                `/api/budgets/${id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(budget)
                }
            );

        return result.budget;
    },


    deleteBudget: async (id) => {

        return await request(
            `/api/budgets/${id}`,
            {
                method: 'DELETE'
            }
        );
    },


    // ====================================
    // DASHBOARD
    // ====================================

    getDashboard: async () => {

        const result =
            await request(
                '/dashboard'
            );

        return result.dashboard;
    },


    // ====================================
    // FINANCIAL DIGITAL TWIN
    // ====================================

    getFinancialTwin: async (
        month
    ) => {

        let endpoint =
            '/dashboard/financial-twin';

        if (month) {
            endpoint +=
                `?month=${encodeURIComponent(month)}`;
        }

        const result =
            await request(endpoint);

        return result.financialTwin;
    },


    // ====================================
    // RESILIENCE
    // ====================================

    getResilience: async (
        month
    ) => {

        let endpoint =
            '/dashboard/resilience';

        if (month) {
            endpoint +=
                `?month=${encodeURIComponent(month)}`;
        }

        const result =
            await request(endpoint);

        return result.resilience;
    },


    // ====================================
    // SAVINGS RATE
    // ====================================

    getSavingsRate: async (
        month
    ) => {

        let endpoint =
            '/dashboard/savings-rate';

        if (month) {
            endpoint +=
                `?month=${encodeURIComponent(month)}`;
        }

        const result =
            await request(endpoint);

        return result.savingsRate;
    },


    // ====================================
    // EMERGENCY COVERAGE
    // ====================================

    getEmergencyCoverage: async (
        month
    ) => {

        let endpoint =
            '/dashboard/emergency-coverage';

        if (month) {
            endpoint +=
                `?month=${encodeURIComponent(month)}`;
        }

        const result =
            await request(endpoint);

        return result.emergencyCoverage;
    },


    // ====================================
    // GOAL COMPLETION
    // ====================================

    getGoalCompletion: async () => {

        const result =
            await request(
                '/dashboard/goal-completion'
            );

        return result.goalCompletion;
    },


    // ====================================
    // GET FINANCIAL DATA
    // Used by simulator / affordability
    // ====================================

    getFinancialInputs: async () => {

        const transactions =
            await api.getTransactions();

        let monthlyIncome = 0;
        let monthlyExpenses = 0;

        transactions.forEach(
            (transaction) => {

                const amount =
                    Number(transaction.amount) || 0;

                if (
                    transaction.type ===
                    'income'
                ) {
                    monthlyIncome += amount;
                } else if(transaction.type === 'expense'){
                    monthlyExpenses += amount;
                }
            }
        );

        const monthlySavings =
            monthlyIncome -
            monthlyExpenses;

        return {
            monthlyIncome,
            monthlyExpenses,
            monthlySavings
        };
    },


    // ====================================
    // SIMULATOR
    // ====================================

    simulateScenario: async (
        amount
    ) => {

        const financialInputs =
            await api.getFinancialInputs();

        const params =
            new URLSearchParams({
                monthlyIncome:
                    financialInputs.monthlyIncome,

                monthlyExpenses:
                    financialInputs.monthlyExpenses,

                monthlySavings:
                    financialInputs.monthlySavings,

                months: 6
            });

        const result =
            await request(
                `/dashboard/simulator?${params.toString()}`
            );

        /*
         * Backend returns:
         * {
         *   message,
         *   simulation
         * }
         *
         * Add amount so the existing
         * frontend simulator continues
         * to know which purchase was tested.
         */

        return {
            amount,
            ...result.simulation
        };
    },


    // ====================================
    // AFFORDABILITY
    // ====================================

    checkAffordability: async (
        amount
    ) => {

        const financialInputs =
            await api.getFinancialInputs();

        const params =
            new URLSearchParams({
                monthlyIncome:
                    financialInputs.monthlyIncome,

                monthlyExpenses:
                    financialInputs.monthlyExpenses,

                purchaseAmount:
                    amount
            });

        const result =
            await request(
                `/dashboard/affordability?${params.toString()}`
            );

        return {
            amount,
            ...result.affordability
        };
    },


    // ====================================
    // FINANCIAL RISK
    // ====================================

    getFinancialRisk: async (
        month
    ) => {

        let endpoint =
            '/dashboard/financial-risk';

        if (month) {
            endpoint +=
                `?month=${encodeURIComponent(month)}`;
        }

        const result =
            await request(endpoint);

        return result.financialRisk;
    },


    // ====================================
    // GOAL DELAY
    // ====================================

    getGoalDelay: async () => {

        const result =
            await request(
                '/dashboard/goal-delay'
            );

        return result.goalDelay;
    },


    // ====================================
    // AI COACH
    // ====================================

    getCoachInsight: async (
        month
    ) => {

        let endpoint =
            '/dashboard/ai-coach';

        if (month) {
            endpoint +=
                `?month=${encodeURIComponent(month)}`;
        }

        const result =
            await request(endpoint);

        /*
         * Existing frontend expects a value
         * that can be directly assigned to
         * textContent.
         */

        if (
            typeof result.aiCoach ===
            'string'
        ) {
            return result.aiCoach;
        }

        return JSON.stringify(
            result.aiCoach
        );
    },


    // ====================================
    // FINANCIAL INSIGHTS
    // ====================================

    getFinancialInsights: async () => {

        const result =
            await request(
                '/dashboard/financial-insights'
            );

        return result.financialInsights;
    },


    // ====================================
    // ASK FINTWIN
    // ====================================

    askQuestion: async (
        question,
        month
    ) => {

        const result =
            await request(
                '/dashboard/ask',
                {
                    method: 'POST',

                    body: JSON.stringify({
                        question,
                        month
                    })
                }
            );

        return result.result;
    },


    // ====================================
    // PERSONALIZED RECOMMENDATIONS
    // ====================================

    getRecommendations: async (
        month
    ) => {

        let endpoint =
            '/dashboard/recommendations';

        if (month) {
            endpoint +=
                `?month=${encodeURIComponent(month)}`;
        }

        const result =
            await request(endpoint);

        return result.recommendations;
    }

};
