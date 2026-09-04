// const steps=[['Income','What comes in each month?','Monthly income','60000'],['Expenses','Help us understand your regular spending.','Fixed monthly expenses','22000','Variable monthly expenses','13000'],['Financial Position','Your current foundation informs every recommendation.','Savings','75000','Investments','120000','Debt / EMI','0'],['Goals','Give your future a clear destination.','Goal name','Emergency Fund','Target amount','100000'],['Preferences','Choose how FinTwin should plan with you.','Planning preference','Balanced growth']];let current=0;const app=document.querySelector('.onboard-box');function render(){let s=steps[current],fields='';for(let i=2;i<s.length;i+=2)fields+=`<label class="field">${s[i]}<input class="input" value="${s[i+1]}"></label>`;app.innerHTML=`<a class="brand" href="../index.html">Fin<b>Twin</b></a><div class="stepper">${steps.map((_,i)=>`<i class="${i<=current?'active':''}"></i>`).join('')}</div><span class="badge">STEP ${current+1} / 5</span><h1>${s[0]}</h1><p class="muted">${s[1]}</p><div class="onboard-fields">${fields}</div><div class="onboard-actions"><button class="btn ghost" id="back" ${current===0?'disabled':''}>Back</button><button class="btn" id="next">${current===4?'Create My Financial Twin':'Continue'}</button></div>`;document.querySelector('#back').onclick=()=>{current--;render()};document.querySelector('#next').onclick=()=>{if(current<4){current++;render()}else{localStorage.setItem('fintwin-onboarding',JSON.stringify({completedAt:new Date().toISOString(),income:60000,expenses:35000}));document.querySelector('#next').textContent='Creating your twin…';setTimeout(()=>location.href='dashboard.html',700)}}}render();

import { data, save } from './mockData.js';

const steps = [
    [
        'Income',
        'What comes in each month?',
        'Monthly income',
        '60000'
    ],

    [
        'Expenses',
        'Help us understand your regular spending.',
        'Fixed monthly expenses',
        '22000',
        'Variable monthly expenses',
        '13000'
    ],

    [
        'Financial Position',
        'Your current foundation informs every recommendation.',
        'Savings',
        '75000',
        'Investments',
        '120000',
        'Debt / EMI',
        '0'
    ],

    [
        'Goals',
        'Give your future a clear destination.',
        'Goal name',
        'Emergency Fund',
        'Target amount',
        '100000'
    ],

    [
        'Preferences',
        'Choose how FinTwin should plan with you.',
        'Planning preference',
        'Balanced growth'
    ]
];


let current = 0;

const values = {};

const app = document.querySelector('.onboard-box');


function render() {

    const step = steps[current];

    let fields = '';


    // Generate fields for the current step

    for (let i = 2; i < step.length; i += 2) {

        const field = step[i];

        fields += `
            <label class="field">
                ${field}

                <input
                    class="input"
                    data-field="${field}"
                    value="${values[field] ?? step[i + 1]}"
                >
            </label>
        `;

    }


    // Render onboarding UI

    app.innerHTML = `
        <a
            class="brand"
            href="../index.html"
        >
            Fin<b>Twin</b>
        </a>


        <div class="stepper">

            ${steps
                .map(
                    (_, i) => `
                        <i class="${i <= current ? 'active' : ''}"></i>
                    `
                )
                .join('')}

        </div>


        <span class="badge">
            STEP ${current + 1} / 5
        </span>


        <h1>
            ${step[0]}
        </h1>


        <p class="muted">
            ${step[1]}
        </p>


        <div class="onboard-fields">
            ${fields}
        </div>


        <div class="onboard-actions">

            <button
                class="btn ghost"
                id="back"
                ${current === 0 ? 'disabled' : ''}
            >
                Back
            </button>


            <button
                class="btn"
                id="next"
            >
                ${current === 4
                    ? 'Create My Financial Twin'
                    : 'Continue'}
            </button>

        </div>
    `;


    // Back button

    const saveCurrentValues = () => {
        document.querySelectorAll('[data-field]').forEach((input) => {
            values[input.dataset.field] = input.value.trim();
        });
    };

    document.querySelector('#back').onclick = () => {

        saveCurrentValues();

        current--;

        render();

    };


    // Next button

    document.querySelector('#next').onclick = () => {

        saveCurrentValues();

        if (current < 4) {

            current++;

            render();

        } else {

            const income = Number(values['Monthly income']) || data.income;
            const expenses =
                (Number(values['Fixed monthly expenses']) || 0) +
                (Number(values['Variable monthly expenses']) || 0);

            data.income = income;
            data.expenses = expenses || data.expenses;
            data.surplus = Math.max(0, data.income - data.expenses);

            if (values['Goal name']) {
                data.goals[0].name = values['Goal name'];
            }

            if (Number(values['Target amount']) > 0) {
                data.goals[0].target = Number(values['Target amount']);
            }

            save();

            localStorage.setItem(
                'fintwin-onboarding',
                JSON.stringify({
                    completedAt: new Date().toISOString(),
                    income: data.income,
                    expenses: data.expenses
                })
            );


            document.querySelector('#next').textContent =
                'Creating your twin…';


            setTimeout(() => {
                location.href = 'dashboard.html';
            }, 700);

        }

    };

}


render();
