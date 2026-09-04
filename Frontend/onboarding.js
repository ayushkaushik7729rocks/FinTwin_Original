import { api } from './api.js';

const steps = [
    ['Income', 'What comes in each month?', 'Monthly income', '60000'],
    ['Expenses', 'Help us understand your regular spending.', 'Fixed monthly expenses', '22000', 'Variable monthly expenses', '13000'],
    ['Financial Position', 'Your current foundation informs every recommendation.', 'Savings', '75000', 'Investments', '120000', 'Debt / EMI', '0'],
    ['Goals', 'Give your future a clear destination.', 'Goal name', 'Emergency Fund', 'Target amount', '100000'],
    ['Preferences', 'Choose how FinTwin should plan with you.', 'Planning preference', 'Balanced growth']
];

let current = 0;
const values = {};
const app = document.querySelector('.onboard-box');

function render() {
    const step = steps[current];
    let fields = '';
    for (let index = 2; index < step.length; index += 2) {
        const field = step[index];
        fields += `<label class="field">${field}<input class="input" data-field="${field}" value="${values[field] ?? step[index + 1]}"></label>`;
    }

    app.innerHTML = `<a class="brand" href="index.html">Fin<b>Twin</b></a>
        <div class="stepper">${steps.map((_, index) => `<i class="${index <= current ? 'active' : ''}"></i>`).join('')}</div>
        <span class="badge">STEP ${current + 1} / 5</span>
        <h1>${step[0]}</h1><p class="muted">${step[1]}</p>
        <div class="onboard-fields">${fields}</div>
        <div class="onboard-actions"><button class="btn ghost" id="back" ${current === 0 ? 'disabled' : ''}>Back</button>
        <button class="btn" id="next">${current === 4 ? 'Create My Financial Twin' : 'Continue'}</button></div>`;

    const saveCurrentValues = () => document.querySelectorAll('[data-field]').forEach((input) => {
        values[input.dataset.field] = input.value.trim();
    });

    document.querySelector('#back').onclick = () => {
        saveCurrentValues(); current--; render();
    };
    document.querySelector('#next').onclick = async () => {
        saveCurrentValues();
        if (current < steps.length - 1) { current++; render(); return; }

        const income = Number(values['Monthly income']) || 0;
        const expenses = (Number(values['Fixed monthly expenses']) || 0) + (Number(values['Variable monthly expenses']) || 0);
        const nextButton = document.querySelector('#next');
        nextButton.disabled = true;
        nextButton.textContent = 'Creating your twin...';
        try {
            await api.updateProfile({ monthlyIncome: income, monthlyExpenses: expenses, savings: Number(values.Savings) || 0 });
            if (values['Goal name'] && Number(values['Target amount']) > 0) {
                await api.createGoal({
                    name: values['Goal name'], target: Number(values['Target amount']), current: 0,
                    date: new Date(new Date().getFullYear() + 1, 11, 31).toISOString(),
                    contribution: 0, priority: 'medium'
                });
            }
            localStorage.setItem('fintwin-onboarding', JSON.stringify({ completedAt: new Date().toISOString(), income, expenses }));
            location.href = 'dashboard.html';
        } catch (error) {
            nextButton.disabled = false;
            nextButton.textContent = 'Create My Financial Twin';
            alert(error.message || 'Unable to save onboarding details.');
        }
    };
}

render();
