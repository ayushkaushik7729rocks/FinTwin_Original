// import{data,load,save}from'./mockData.js';import{api}from'./api.js';load();
// const $=s=>document.querySelector(s),page=document.body.dataset.page;
// const links=[['dashboard','Dashboard'],['transactions','Transactions'],['budget','Budget'],['goals','Goals'],['financial-twin','Financial Twin'],['simulator','Simulator'],['affordability','Can I Afford?'],['coach','AI Coach'],['settings','Settings']];
// const rupee=n=>'₹'+Number(n).toLocaleString('en-IN');
// function shell(title,sub,content,action=''){document.body.innerHTML=`<div class="app"><aside class="sidebar"><a class="brand" href="dashboard.html">Fin<b>Twin</b></a><nav class="side-nav">${links.map(([p,n])=>`<a class="${page===p?'active':''}" href="${p}.html">${n}</a>`).join('')}</nav><a class="profile" href="settings.html">● ${data.user.name}<br><small>Personal account</small></a></aside><main class="main"><header class="topbar"><div><h1>${title}</h1><p>${sub}</p></div><div><button class="menu-button" aria-label="Open navigation">☰</button>${action}</div></header>${content}</main></div>`;$('.menu-button')?.addEventListener('click',()=>$('.sidebar').classList.toggle('open'))}
// const line=`<svg viewBox="0 0 600 200" preserveAspectRatio="none"><path d="M0,145 C45,120 80,150 125,95 S210,110 260,70 S350,105 405,55 S485,80 600,18"/></svg>`;
// const metrics=()=>`<section class="metric-grid"><div class="metric"><span>Monthly Income</span><strong>${rupee(data.income)}</strong><small class="positive">↑ Stable</small></div><div class="metric"><span>Monthly Expenses</span><strong>${rupee(data.expenses)}</strong><small class="muted">58% of income</small></div><div class="metric"><span>Monthly Surplus</span><strong>${rupee(data.surplus)}</strong><small class="positive">↑ Healthy margin</small></div><div class="metric"><span>Financial Resilience</span><strong>${data.resilience} / 100</strong><small class="positive">Strong</small></div></section>`;
// const goals=()=>data.goals.map(g=>{let p=Math.round(g.current/g.target*100);return `<div class="goal-row"><div><b>${g.name}</b><span>${rupee(g.current)} / ${rupee(g.target)}</span></div><div class="progress"><i style="width:${p}%"></i></div><small class="muted">${p}% complete · ${g.date}</small></div>`}).join('');
// function dashboard(){shell('Good evening 👋',"Here's your financial picture today.",`${metrics()}<div class="content-grid"><section class="card"><h2>Cash flow overview</h2><div class="large-chart">${line}</div><div class="pills"><span class="pill">● Income</span><span class="pill">● Expenses</span><span class="pill">● Surplus</span></div></section><section class="card"><h2>Your goals</h2>${goals()}<a class="btn ghost" href="goals.html">View all goals →</a></section></div><div class="content-grid"><section class="card"><span class="badge">✦ AI INSIGHT</span><p class="insight">Your spending on dining increased this month. Reducing it by ₹1,500 could move your laptop goal closer by approximately 18 days.</p></section><section class="card"><h2>Quick actions</h2><div class="actions"><a class="btn secondary" href="transactions.html">Add Expense</a><a class="btn secondary" href="goals.html">Create Goal</a><a class="btn secondary" href="affordability.html">Can I Afford?</a><a class="btn secondary" href="simulator.html">Run Simulation</a></div></section></div>`)}
// function transactions(){shell('Transactions','Track the movement behind your financial picture.',`<section class="card"><div class="toolbar"><input class="input" id="search" placeholder="Search transactions"><select class="input" id="filter"><option value="">All categories</option>${[...new Set(data.transactions.map(x=>x.category))].map(x=>`<option>${x}</option>`)}</select><button class="btn" id="addTransaction">+ Add Transaction</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Type</th><th></th></tr></thead><tbody id="txRows"></tbody></table></div></section>`);const render=()=>$('#txRows').innerHTML=data.transactions.filter(x=>x.description.toLowerCase().includes($('#search').value.toLowerCase())&&(!$('#filter').value||x.category===$('#filter').value)).map(x=>`<tr><td>${x.date}</td><td><b>${x.description}</b></td><td>${x.category}</td><td class="${x.type==='Income'?'positive':'danger'}">${x.type==='Income'?'+':'-'}${rupee(x.amount)}</td><td>${x.type}</td><td><button class="icon-button" data-del="${x.id}" aria-label="Delete transaction">Delete</button></td></tr>`).join('')||'<tr><td colspan="6" class="muted">No transactions found.</td></tr>';render();$('#search').oninput=render;$('#filter').onchange=render;$('#txRows').onclick=async e=>{if(e.target.dataset.del){await api.deleteTransaction(e.target.dataset.del);render();toast('Transaction deleted')}};$('#addTransaction').onclick=()=>modal('Add transaction',`<label class="field">Description<input class="input" name="description" required></label><label class="field">Amount<input class="input" name="amount" type="number" required></label><label class="field">Category<input class="input" name="category" value="Other" required></label><label class="field">Type<select class="input" name="type"><option>Expense</option><option>Income</option></select></label>`,async f=>{await api.createTransaction({description:f.description.value,amount:+f.amount.value,category:f.category.value,type:f.type.value,date:'Today'});render();toast('Transaction added')})}
// function budget(){let cats=['Housing','Food','Transport','Shopping','Entertainment','Utilities','Other'];shell('Your Personalized Budget','A clear spending plan built around your financial priorities.',`<div class="content-grid"><section class="card">${metrics()}<h2 style="margin-top:22px">Budget health <span class="positive">82 / 100</span></h2><div class="progress"><i style="width:82%"></i></div><p class="muted">You’re maintaining a thoughtful balance between essentials, flexibility, and future goals.</p><button class="btn" id="generate">Generate Personalized Budget</button></section><section class="card"><h2>Available surplus</h2><strong style="font-size:2.3rem">${rupee(data.surplus)}</strong><p class="muted">Ready to be allocated to the goals that matter most.</p></section></div><section class="budget-grid" style="margin-top:18px">${cats.map((x,i)=>`<div class="card"><h2>${x}</h2><div class="muted">Budget ${rupee(3500+i*900)}</div><b>${rupee(1700+i*470)} spent</b><div class="progress"><i style="width:${35+i*6}%"></i></div><small class="positive">${rupee(1800+i*430)} remaining</small></div>`).join('')}</section>`);$('#generate').onclick=()=>toast('Personalized demo budget generated')}
// function goalsPage(){shell('Your Financial Goals','Put every rupee of surplus to work toward what matters.',`<div class="page-header"><span class="badge">DEMONSTRATION RESULTS</span><button class="btn" id="addGoal">+ Add Goal</button></div><section class="goal-grid" id="goalCards">${goalCards()}</section><section class="card" style="margin-top:18px"><h2>Goal Optimizer</h2><p class="muted">Available monthly surplus: <b class="positive">${rupee(data.surplus)}</b></p><div class="goal-grid"><div>Emergency Fund — <b>₹8,000</b></div><div>Laptop — <b>₹7,000</b></div><div>Investment — <b>₹5,000</b></div><div>Vacation — <b>₹3,000</b></div></div></section>`);$('#addGoal').onclick=()=>modal('Create financial goal',`<label class="field">Goal name<input class="input" name="name" required></label><label class="field">Target amount<input class="input" type="number" name="target" required></label><label class="field">Current amount<input class="input" type="number" name="current" value="0"></label><label class="field">Target date<input class="input" name="date" placeholder="Dec 2027"></label>`,async f=>{await api.createGoal({name:f.name.value,target:+f.target.value,current:+f.current.value,date:f.date.value||'TBD',contribution:0,priority:'Medium'});$('#goalCards').innerHTML=goalCards();toast('Goal created')})}function goalCards(){return data.goals.map(g=>`<article class="card goal-card"><span class="badge">${g.priority} priority</span><h3>${g.name}</h3><strong>${rupee(g.current)} <small class="muted">of ${rupee(g.target)}</small></strong><div class="progress"><i style="width:${g.current/g.target*100}%"></i></div><p class="muted">Target: ${g.date}<br>Monthly contribution: ${rupee(g.contribution)}</p></article>`).join('')}
// function twin(){shell('Your Financial Digital Twin','A living model of your financial state.',`<section class="card"><div class="twin-visual"><div class="twinnode">Income</div><div class="twinnode">Savings</div><div class="twinnode">Expenses</div><div class="twinnode">Debt</div><div class="twin-core">FINANCIAL<br>DIGITAL TWIN<small>Live financial model</small></div><div class="twinnode">Goals</div><div class="twinnode">Cash Flow</div><div class="twinnode">Risk</div><div class="twinnode">Resilience</div></div></section><section class="twin-stats" style="margin-top:18px"><div class="metric"><span>Resilience</span><strong>78 / 100</strong></div><div class="metric"><span>Savings Rate</span><strong>41.6%</strong></div><div class="metric"><span>Emergency Coverage</span><strong>3.8 mo</strong></div><div class="metric"><span>Monthly Surplus</span><strong>₹25K</strong></div><div class="metric"><span>Goal Completion</span><strong>56%</strong></div></section><section class="card" style="margin-top:18px"><h2>Financial state timeline</h2><div class="large-chart">${line}</div></section>`)}
// function simulator(){shell('Financial Time Machine','See the consequences before you make the decision.',`<section class="card"><span class="badge">HERO FEATURE</span><h2 style="font-size:1.4rem;margin-top:15px">What do you want to simulate?</h2><div class="scenario-form"><label class="field">Scenario<select class="input" id="scenario"><option>Purchase</option><option>Salary Change</option><option>New EMI</option><option>Unexpected Expense</option><option>Increase Savings</option></select></label><label class="field">Purchase amount<input class="input" id="amount" type="number" value="100000"></label><label class="field">Purchase date<select class="input"><option>Next Month</option><option>This Month</option><option>In 3 Months</option></select></label></div><button class="btn" id="simulate" style="margin-top:18px">Simulate</button></section><div id="simResult" class="simulation-results hidden"></div>`);$('#simulate').onclick=async()=>{let r=await api.simulateScenario(+$(' #amount'.trim()).value);$('#simResult').innerHTML=`<div class="result-grid"><section class="card"><span class="badge">BASELINE</span><h2>Savings <strong>${rupee(300000)}</strong></h2><p>Resilience <b>78</b></p><p>Goal completion <b>6 months</b></p></section><section class="card"><span class="badge">SCENARIO</span><h2>Savings <strong class="warning">${rupee(r.savings)}</strong></h2><p>Resilience <b class="warning">${r.resilience}</b></p><p>Goal completion <b>8 months</b></p></section></div><section class="card" style="margin-top:15px"><h2>Why did this happen?</h2><p class="insight">A ${rupee(r.amount)} purchase reduces the cash buffer that supports your emergency coverage and delays your goal contributions by roughly two months.</p><div class="large-chart">${line}</div></section>`;$('#simResult').classList.remove('hidden')}}
// function affordability(){shell('Can I Afford This?',"Don't just ask whether you have enough money. Ask whether it's financially safe.",`<section class="card"><div class="scenario-form"><label class="field">Purchase name<input class="input" id="purchaseName" value="New laptop"></label><label class="field">Purchase amount<input class="input" id="purchaseAmount" type="number" value="100000"></label><label class="field">Purchase date<select class="input"><option>Next Month</option><option>Today</option></select></label></div><button class="btn" id="analyze" style="margin-top:18px">Analyze Purchase</button></section><section id="affResult" class="hidden" style="margin-top:18px"></section>`);$('#analyze').onclick=async()=>{let amount=+$('#purchaseAmount').value,r=await api.checkAffordability(amount);$('#affResult').className='card';$('#affResult').innerHTML=`<span class="status warning">CAUTION</span><h2>${$('#purchaseName').value}: financially possible, but not optimal</h2><div class="metric-grid"><div class="metric"><span>Current savings</span><strong>₹3.0L</strong></div><div class="metric"><span>Purchase cost</span><strong>${rupee(amount)}</strong></div><div class="metric"><span>Emergency coverage</span><strong>2.1 months</strong></div><div class="metric"><span>Resilience</span><strong class="warning">78 → ${r.resilience}</strong></div></div><h2 style="margin-top:22px">Why?</h2><div class="reasons"><div class="reason">Your emergency fund drops below the preferred 3-month buffer.</div><div class="reason">Your laptop goal would be delayed by around two months.</div><div class="reason">A future unexpected expense would have less room to absorb.</div></div><p class="insight" style="margin-top:17px"><b>Better alternative:</b> Wait 3 months and preserve financial resilience.</p>`}}
// function coach(){shell('AI Decision Coach','Financial intelligence built around your next best move.',`<section class="coach-grid"><div class="card"><span class="badge">TODAY'S INSIGHT</span><h2>Your spending increased 12% this month.</h2><p class="muted">Dining and shopping are the primary drivers.</p></div><div class="card"><span class="badge">GOAL PROGRESS</span><h2>Emergency fund is progressing well.</h2><p class="muted">You’re on track to meet your target in December.</p></div><div class="card"><span class="badge">FINANCIAL RISK</span><h2>Laptop goal may be delayed.</h2><p class="muted">Discretionary spending could extend its timeline.</p></div><div class="card"><span class="badge">RECOMMENDED ACTION</span><h2>Move ₹1,500 from dining to goals.</h2><p class="muted">This can bring your target closer by 18 days.</p></div></section><section class="card" style="margin-top:18px"><h2>Ask FinTwin</h2><div class="pills"><button class="pill question">Can I afford a new laptop?</button><button class="pill question">Why is my resilience falling?</button><button class="pill question">Where am I overspending?</button></div><p id="coachReply" class="insight" style="margin-top:15px">Choose a question for a mock, explainable recommendation.</p></section>`);document.querySelectorAll('.question').forEach(b=>b.onclick=async()=>$('#coachReply').textContent=await api.getCoachInsight())}
// function settings(){shell('Settings','Manage your profile, preferences, and account controls.',`<section class="content-grid"><div class="card"><h2>Profile</h2><label class="field">Name<input class="input" value="${data.user.name}"></label><label class="field" style="margin-top:12px">Email<input class="input" value="${data.user.email}"></label><h2 style="margin-top:24px">Financial Preferences</h2><label class="field">Monthly income<input class="input" value="₹60,000"></label><label class="field" style="margin-top:12px">Planning preference<select class="input"><option>Balanced growth</option><option>Conservative</option><option>Growth focused</option></select></label></div><div class="card"><h2>Notifications</h2><p><label><input type="checkbox" checked> Email alerts</label></p><p><label><input type="checkbox" checked> Goal reminders</label></p><p><label><input type="checkbox"> Budget alerts</label></p><h2 style="margin-top:28px">Security</h2><button class="btn secondary">Change Password</button><button class="btn ghost" id="logout">Logout</button><h2 class="danger" style="margin-top:28px">Danger Zone</h2><button class="btn secondary">Delete Account</button></div></section>`);$('#logout').onclick=()=>location.href='login.html'}
// function modal(title,fields,submit){let el=document.createElement('div');el.className='modal';el.innerHTML=`<div class="modal-box"><button class="icon-button" aria-label="Close">Close</button><h2>${title}</h2><form>${fields}<button class="btn">Save</button></form></div>`;document.body.append(el);el.querySelector('.icon-button').onclick=()=>el.remove();el.querySelector('form').onsubmit=async e=>{e.preventDefault();await submit(e.target);el.remove()}}
// function toast(msg){let x=document.createElement('div');x.className='toast';x.textContent=msg;document.body.append(x);setTimeout(()=>x.remove(),2500)}
// ({dashboard,transactions,budget,goals:goalsPage,'financial-twin':twin,simulator,affordability,coach,settings}[page]||dashboard)();

import { data, load, save } from './mockData.js';
import { api } from './api.js';

load();


// ========================================
// DOM & PAGE CONFIGURATION
// ========================================

const $ = (selector) => document.querySelector(selector);

const page = document.body.dataset.page;

const links = [
    ['dashboard', 'Dashboard'],
    ['transactions', 'Transactions'],
    ['budget', 'Budget'],
    ['goals', 'Goals'],
    ['financial-twin', 'Financial Twin'],
    ['simulator', 'Simulator'],
    ['affordability', 'Can I Afford?'],
    ['coach', 'AI Coach'],
    ['settings', 'Settings']
];


// ========================================
// UTILITY FUNCTIONS
// ========================================

const rupee = (amount) =>
    '₹' + Number(amount).toLocaleString('en-IN');


// ========================================
// APPLICATION SHELL
// ========================================

function shell(title, sub, content, action = '') {

    document.body.innerHTML = `
        <div class="app">

            <!-- Sidebar -->

            <aside class="sidebar">

                <a
                    class="brand"
                    href="dashboard.html"
                >
                    Fin<b>Twin</b>
                </a>

                <nav class="side-nav">

                    ${links
                        .map(
                            ([path, name]) => `
                                <a
                                    class="${page === path ? 'active' : ''}"
                                    href="${path}.html"
                                >
                                    ${name}
                                </a>
                            `
                        )
                        .join('')}

                </nav>

                <a
                    class="profile"
                    href="settings.html"
                >
                    ● ${data.user.name}
                    <br>
                    <small>Personal account</small>
                </a>

            </aside>


            <!-- Main Content -->

            <main class="main">

                <header class="topbar">

                    <div>
                        <h1>${title}</h1>
                        <p>${sub}</p>
                    </div>

                    <div>

                        <button
                            class="menu-button"
                            aria-label="Open navigation"
                        >
                            ☰
                        </button>

                        ${action}

                    </div>

                </header>

                ${content}

            </main>

        </div>
    `;


    // Mobile navigation

    $('.menu-button')?.addEventListener('click', () => {
        $('.sidebar').classList.toggle('open');
    });

}


// ========================================
// CHART
// ========================================

const line = `
    <svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
    >
        <path
            d="M0,145 C45,120 80,150 125,95
               S210,110 260,70
               S350,105 405,55
               S485,80 600,18"
        />
    </svg>
`;


// ========================================
// METRICS
// ========================================

const metrics = () => `
    <section class="metric-grid">

        <div class="metric">
            <span>Monthly Income</span>
            <strong>${rupee(data.income)}</strong>
            <small class="positive">↑ Stable</small>
        </div>

        <div class="metric">
            <span>Monthly Expenses</span>
            <strong>${rupee(data.expenses)}</strong>
            <small class="muted">58% of income</small>
        </div>

        <div class="metric">
            <span>Monthly Surplus</span>
            <strong>${rupee(data.surplus)}</strong>
            <small class="positive">↑ Healthy margin</small>
        </div>

        <div class="metric">
            <span>Financial Resilience</span>
            <strong>${data.resilience} / 100</strong>
            <small class="positive">Strong</small>
        </div>

    </section>
`;


// ========================================
// GOALS SUMMARY
// ========================================

const goals = () =>
    data.goals
        .map((goal) => {

            const percentage = Math.round(
                (goal.current / goal.target) * 100
            );

            return `
                <div class="goal-row">

                    <div>
                        <b>${goal.name}</b>
                        <span>
                            ${rupee(goal.current)}
                            /
                            ${rupee(goal.target)}
                        </span>
                    </div>

                    <div class="progress">
                        <i style="width: ${percentage}%"></i>
                    </div>

                    <small class="muted">
                        ${percentage}% complete · ${goal.date}
                    </small>

                </div>
            `;

        })
        .join('');


// ========================================
// DASHBOARD
// ========================================

function dashboard() {

    shell(
        'Good evening 👋',
        "Here's your financial picture today.",
        `
            ${metrics()}

            <div class="content-grid">

                <!-- Cash Flow -->

                <section class="card">

                    <h2>
                        Cash flow overview
                    </h2>

                    <div class="large-chart">
                        ${line}
                    </div>

                    <div class="pills">

                        <span class="pill">
                            ● Income
                        </span>

                        <span class="pill">
                            ● Expenses
                        </span>

                        <span class="pill">
                            ● Surplus
                        </span>

                    </div>

                </section>


                <!-- Goals -->

                <section class="card">

                    <h2>
                        Your goals
                    </h2>

                    ${goals()}

                    <a
                        class="btn ghost"
                        href="goals.html"
                    >
                        View all goals →
                    </a>

                </section>

            </div>


            <div class="content-grid">

                <!-- AI Insight -->

                <section class="card">

                    <span class="badge">
                        ✦ AI INSIGHT
                    </span>

                    <p class="insight">
                        Your spending on dining increased this month.
                        Reducing it by ₹1,500 could move your laptop
                        goal closer by approximately 18 days.
                    </p>

                </section>


                <!-- Quick Actions -->

                <section class="card">

                    <h2>
                        Quick actions
                    </h2>

                    <div class="actions">

                        <a
                            class="btn secondary"
                            href="transactions.html"
                        >
                            Add Expense
                        </a>

                        <a
                            class="btn secondary"
                            href="goals.html"
                        >
                            Create Goal
                        </a>

                        <a
                            class="btn secondary"
                            href="affordability.html"
                        >
                            Can I Afford?
                        </a>

                        <a
                            class="btn secondary"
                            href="simulator.html"
                        >
                            Run Simulation
                        </a>

                    </div>

                </section>

            </div>
        `
    );

}


// ========================================
// TRANSACTIONS
// ========================================

function transactions() {

    shell(
        'Transactions',
        'Track the movement behind your financial picture.',
        `
            <section class="card">

                <div class="toolbar">

                    <input
                        class="input"
                        id="search"
                        placeholder="Search transactions"
                    >

                    <select
                        class="input"
                        id="filter"
                    >
                        <option value="">
                            All categories
                        </option>

                        ${[
                            ...new Set(
                                data.transactions.map(
                                    (transaction) =>
                                        transaction.category
                                )
                            )
                        ]
                            .map(
                                (category) => `
                                    <option>
                                        ${category}
                                    </option>
                                `
                            )
                            .join('')}

                    </select>

                    <button
                        class="btn"
                        id="addTransaction"
                    >
                        + Add Transaction
                    </button>

                </div>


                <div class="table-wrap">

                    <table class="data-table">

                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody id="txRows"></tbody>

                    </table>

                </div>

            </section>
        `
    );


    const render = () => {

        const searchValue =
            $('#search').value.toLowerCase();

        const filterValue =
            $('#filter').value;


        $('#txRows').innerHTML =
            data.transactions
                .filter(
                    (transaction) =>
                        transaction.description
                            .toLowerCase()
                            .includes(searchValue) &&
                        (
                            !filterValue ||
                            transaction.category === filterValue
                        )
                )
                .map(
                    (transaction) => `
                        <tr>

                            <td>
                                ${transaction.date}
                            </td>

                            <td>
                                <b>
                                    ${transaction.description}
                                </b>
                            </td>

                            <td>
                                ${transaction.category}
                            </td>

                            <td
                                class="${
                                    transaction.type === 'Income'
                                        ? 'positive'
                                        : 'danger'
                                }"
                            >
                                ${
                                    transaction.type === 'Income'
                                        ? '+'
                                        : '-'
                                }${rupee(transaction.amount)}
                            </td>

                            <td>
                                ${transaction.type}
                            </td>

                            <td>

                                <button
                                    class="icon-button"
                                    data-del="${transaction.id}"
                                    aria-label="Delete transaction"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                    `
                )
                .join('') ||
            `
                <tr>
                    <td
                        colspan="6"
                        class="muted"
                    >
                        No transactions found.
                    </td>
                </tr>
            `;

    };


    render();

    $('#search').oninput = render;
    $('#filter').onchange = render;


    $('#txRows').onclick = async (event) => {

        if (event.target.dataset.del) {

            await api.deleteTransaction(
                event.target.dataset.del
            );

            render();

            toast('Transaction deleted');
        }

    };


    $('#addTransaction').onclick = () =>
        modal(
            'Add transaction',
            `
                <label class="field">
                    Description

                    <input
                        class="input"
                        name="description"
                        required
                    >
                </label>

                <label class="field">
                    Amount

                    <input
                        class="input"
                        name="amount"
                        type="number"
                        required
                    >
                </label>

                <label class="field">
                    Category

                    <input
                        class="input"
                        name="category"
                        value="Other"
                        required
                    >
                </label>

                <label class="field">
                    Type

                    <select
                        class="input"
                        name="type"
                    >
                        <option>Expense</option>
                        <option>Income</option>
                    </select>

                </label>
            `,
            async (form) => {

                await api.createTransaction({
                    description: form.description.value,
                    amount: +form.amount.value,
                    category: form.category.value,
                    type: form.type.value,
                    date: 'Today'
                });

                render();

                toast('Transaction added');

            }
        );

}


// ========================================
// BUDGET
// ========================================

function budget() {

    const categories = [
        'Housing',
        'Food',
        'Transport',
        'Shopping',
        'Entertainment',
        'Utilities',
        'Other'
    ];


    shell(
        'Your Personalized Budget',
        'A clear spending plan built around your financial priorities.',
        `
            <div class="content-grid">

                <section class="card">

                    ${metrics()}

                    <h2 style="margin-top: 22px">
                        Budget health
                        <span class="positive">
                            82 / 100
                        </span>
                    </h2>

                    <div class="progress">
                        <i style="width: 82%"></i>
                    </div>

                    <p class="muted">
                        You’re maintaining a thoughtful balance
                        between essentials, flexibility, and future goals.
                    </p>

                    <button
                        class="btn"
                        id="generate"
                    >
                        Generate Personalized Budget
                    </button>

                </section>


                <section class="card">

                    <h2>
                        Available surplus
                    </h2>

                    <strong style="font-size: 2.3rem">
                        ${rupee(data.surplus)}
                    </strong>

                    <p class="muted">
                        Ready to be allocated to the goals
                        that matter most.
                    </p>

                </section>

            </div>


            <section
                class="budget-grid"
                style="margin-top: 18px"
            >

                ${categories
                    .map(
                        (category, index) => `
                            <div class="card">

                                <h2>
                                    ${category}
                                </h2>

                                <div class="muted">
                                    Budget
                                    ${rupee(3500 + index * 900)}
                                </div>

                                <b>
                                    ${rupee(1700 + index * 470)}
                                    spent
                                </b>

                                <div class="progress">
                                    <i
                                        style="
                                            width: ${35 + index * 6}%;
                                        "
                                    ></i>
                                </div>

                                <small class="positive">
                                    ${rupee(1800 + index * 430)}
                                    remaining
                                </small>

                            </div>
                        `
                    )
                    .join('')}

            </section>
        `
    );


    $('#generate').onclick = () =>
        toast(
            'Personalized demo budget generated'
        );

}


// ========================================
// GOALS
// ========================================

function goalsPage() {

    shell(
        'Your Financial Goals',
        'Put every rupee of surplus to work toward what matters.',
        `
            <div class="page-header">

                <span class="badge">
                    DEMONSTRATION RESULTS
                </span>

                <button
                    class="btn"
                    id="addGoal"
                >
                    + Add Goal
                </button>

            </div>


            <section
                class="goal-grid"
                id="goalCards"
            >
                ${goalCards()}
            </section>


            <section
                class="card"
                style="margin-top: 18px"
            >

                <h2>
                    Goal Optimizer
                </h2>

                <p class="muted">
                    Available monthly surplus:
                    <b class="positive">
                        ${rupee(data.surplus)}
                    </b>
                </p>

                <div class="goal-grid">

                    <div>
                        Emergency Fund —
                        <b>₹8,000</b>
                    </div>

                    <div>
                        Laptop —
                        <b>₹7,000</b>
                    </div>

                    <div>
                        Investment —
                        <b>₹5,000</b>
                    </div>

                    <div>
                        Vacation —
                        <b>₹3,000</b>
                    </div>

                </div>

            </section>
        `
    );


    $('#addGoal').onclick = () =>
        modal(
            'Create financial goal',
            `
                <label class="field">
                    Goal name

                    <input
                        class="input"
                        name="name"
                        required
                    >
                </label>

                <label class="field">
                    Target amount

                    <input
                        class="input"
                        type="number"
                        name="target"
                        required
                    >
                </label>

                <label class="field">
                    Current amount

                    <input
                        class="input"
                        type="number"
                        name="current"
                        value="0"
                    >
                </label>

                <label class="field">
                    Target date

                    <input
                        class="input"
                        name="date"
                        placeholder="Dec 2027"
                    >
                </label>
            `,
            async (form) => {

                await api.createGoal({
                    name: form.name.value,
                    target: +form.target.value,
                    current: +form.current.value,
                    date: form.date.value || 'TBD',
                    contribution: 0,
                    priority: 'Medium'
                });

                $('#goalCards').innerHTML =
                    goalCards();

                toast('Goal created');

            }
        );

}


function goalCards() {

    return data.goals
        .map(
            (goal) => `
                <article class="card goal-card">

                    <span class="badge">
                        ${goal.priority} priority
                    </span>

                    <h3>
                        ${goal.name}
                    </h3>

                    <strong>
                        ${rupee(goal.current)}

                        <small class="muted">
                            of ${rupee(goal.target)}
                        </small>
                    </strong>

                    <div class="progress">

                        <i
                            style="
                                width: ${
                                    (goal.current / goal.target) * 100
                                }%;
                            "
                        ></i>

                    </div>

                    <p class="muted">
                        Target: ${goal.date}
                        <br>
                        Monthly contribution:
                        ${rupee(goal.contribution)}
                    </p>

                </article>
            `
        )
        .join('');

}


// ========================================
// FINANCIAL DIGITAL TWIN
// ========================================

function twin() {

    shell(
        'Your Financial Digital Twin',
        'A living model of your financial state.',
        `
            <section class="card">

                <div class="twin-visual">

                    <div class="twinnode">
                        Income
                    </div>

                    <div class="twinnode">
                        Savings
                    </div>

                    <div class="twinnode">
                        Expenses
                    </div>

                    <div class="twinnode">
                        Debt
                    </div>

                    <div class="twin-core">

                        FINANCIAL
                        <br>
                        DIGITAL TWIN

                        <small>
                            Live financial model
                        </small>

                    </div>

                    <div class="twinnode">
                        Goals
                    </div>

                    <div class="twinnode">
                        Cash Flow
                    </div>

                    <div class="twinnode">
                        Risk
                    </div>

                    <div class="twinnode">
                        Resilience
                    </div>

                </div>

            </section>


            <section
                class="twin-stats"
                style="margin-top: 18px"
            >

                <div class="metric">
                    <span>Resilience</span>
                    <strong>78 / 100</strong>
                </div>

                <div class="metric">
                    <span>Savings Rate</span>
                    <strong>41.6%</strong>
                </div>

                <div class="metric">
                    <span>Emergency Coverage</span>
                    <strong>3.8 mo</strong>
                </div>

                <div class="metric">
                    <span>Monthly Surplus</span>
                    <strong>₹25K</strong>
                </div>

                <div class="metric">
                    <span>Goal Completion</span>
                    <strong>56%</strong>
                </div>

            </section>


            <section
                class="card"
                style="margin-top: 18px"
            >

                <h2>
                    Financial state timeline
                </h2>

                <div class="large-chart">
                    ${line}
                </div>

            </section>
        `
    );

}


// ========================================
// SIMULATOR
// ========================================

function simulator() {

    shell(
        'Financial Time Machine',
        'See the consequences before you make the decision.',
        `
            <section class="card">

                <span class="badge">
                    HERO FEATURE
                </span>

                <h2
                    style="
                        font-size: 1.4rem;
                        margin-top: 15px;
                    "
                >
                    What do you want to simulate?
                </h2>

                <div class="scenario-form">

                    <label class="field">
                        Scenario

                        <select
                            class="input"
                            id="scenario"
                        >
                            <option>Purchase</option>
                            <option>Salary Change</option>
                            <option>New EMI</option>
                            <option>Unexpected Expense</option>
                            <option>Increase Savings</option>
                        </select>

                    </label>

                    <label class="field">
                        Purchase amount

                        <input
                            class="input"
                            id="amount"
                            type="number"
                            value="100000"
                        >
                    </label>

                    <label class="field">
                        Purchase date

                        <select class="input">
                            <option>Next Month</option>
                            <option>This Month</option>
                            <option>In 3 Months</option>
                        </select>

                    </label>

                </div>

                <button
                    class="btn"
                    id="simulate"
                    style="margin-top: 18px"
                >
                    Simulate
                </button>

            </section>


            <div
                id="simResult"
                class="simulation-results hidden"
            ></div>
        `
    );


    $('#simulate').onclick = async () => {

        const amount =
            +$('#amount').value;

        const result =
            await api.simulateScenario(amount);


        $('#simResult').innerHTML = `
            <div class="result-grid">

                <section class="card">

                    <span class="badge">
                        BASELINE
                    </span>

                    <h2>
                        Savings
                        <strong>
                            ${rupee(300000)}
                        </strong>
                    </h2>

                    <p>
                        Resilience
                        <b>78</b>
                    </p>

                    <p>
                        Goal completion
                        <b>6 months</b>
                    </p>

                </section>


                <section class="card">

                    <span class="badge">
                        SCENARIO
                    </span>

                    <h2>
                        Savings
                        <strong class="warning">
                            ${rupee(result.savings)}
                        </strong>
                    </h2>

                    <p>
                        Resilience
                        <b class="warning">
                            ${result.resilience}
                        </b>
                    </p>

                    <p>
                        Goal completion
                        <b>8 months</b>
                    </p>

                </section>

            </div>


            <section
                class="card"
                style="margin-top: 15px"
            >

                <h2>
                    Why did this happen?
                </h2>

                <p class="insight">
                    A ${rupee(result.amount)} purchase reduces
                    the cash buffer that supports your emergency
                    coverage and delays your goal contributions
                    by roughly two months.
                </p>

                <div class="large-chart">
                    ${line}
                </div>

            </section>
        `;


        $('#simResult').classList.remove(
            'hidden'
        );

    };

}


// ========================================
// AFFORDABILITY
// ========================================

function affordability() {

    shell(
        'Can I Afford This?',
        "Don't just ask whether you have enough money. Ask whether it's financially safe.",
        `
            <section class="card">

                <div class="scenario-form">

                    <label class="field">
                        Purchase name

                        <input
                            class="input"
                            id="purchaseName"
                            value="New laptop"
                        >
                    </label>

                    <label class="field">
                        Purchase amount

                        <input
                            class="input"
                            id="purchaseAmount"
                            type="number"
                            value="100000"
                        >
                    </label>

                    <label class="field">
                        Purchase date

                        <select class="input">
                            <option>Next Month</option>
                            <option>Today</option>
                        </select>
                    </label>

                </div>

                <button
                    class="btn"
                    id="analyze"
                    style="margin-top: 18px"
                >
                    Analyze Purchase
                </button>

            </section>


            <section
                id="affResult"
                class="hidden"
                style="margin-top: 18px"
            ></section>
        `
    );


    $('#analyze').onclick = async () => {

        const amount =
            +$('#purchaseAmount').value;

        const result =
            await api.checkAffordability(amount);


        $('#affResult').className = 'card';

        $('#affResult').innerHTML = `
            <span class="status warning">
                CAUTION
            </span>

            <h2>
                ${$('#purchaseName').value}:
                financially possible, but not optimal
            </h2>


            <div class="metric-grid">

                <div class="metric">
                    <span>Current savings</span>
                    <strong>₹3.0L</strong>
                </div>

                <div class="metric">
                    <span>Purchase cost</span>
                    <strong>
                        ${rupee(amount)}
                    </strong>
                </div>

                <div class="metric">
                    <span>Emergency coverage</span>
                    <strong>2.1 months</strong>
                </div>

                <div class="metric">
                    <span>Resilience</span>
                    <strong class="warning">
                        78 → ${result.resilience}
                    </strong>
                </div>

            </div>


            <h2 style="margin-top: 22px">
                Why?
            </h2>

            <div class="reasons">

                <div class="reason">
                    Your emergency fund drops below
                    the preferred 3-month buffer.
                </div>

                <div class="reason">
                    Your laptop goal would be delayed
                    by around two months.
                </div>

                <div class="reason">
                    A future unexpected expense would
                    have less room to absorb.
                </div>

            </div>


            <p
                class="insight"
                style="margin-top: 17px"
            >
                <b>Better alternative:</b>
                Wait 3 months and preserve financial resilience.
            </p>
        `;

    };

}


// ========================================
// AI COACH
// ========================================

function coach() {

    shell(
        'AI Decision Coach',
        'Financial intelligence built around your next best move.',
        `
            <section class="coach-grid">

                <div class="card">

                    <span class="badge">
                        TODAY'S INSIGHT
                    </span>

                    <h2>
                        Your spending increased 12% this month.
                    </h2>

                    <p class="muted">
                        Dining and shopping are the primary drivers.
                    </p>

                </div>


                <div class="card">

                    <span class="badge">
                        GOAL PROGRESS
                    </span>

                    <h2>
                        Emergency fund is progressing well.
                    </h2>

                    <p class="muted">
                        You’re on track to meet your target in December.
                    </p>

                </div>


                <div class="card">

                    <span class="badge">
                        FINANCIAL RISK
                    </span>

                    <h2>
                        Laptop goal may be delayed.
                    </h2>

                    <p class="muted">
                        Discretionary spending could extend its timeline.
                    </p>

                </div>


                <div class="card">

                    <span class="badge">
                        RECOMMENDED ACTION
                    </span>

                    <h2>
                        Move ₹1,500 from dining to goals.
                    </h2>

                    <p class="muted">
                        This can bring your target closer by 18 days.
                    </p>

                </div>

            </section>


            <section
                class="card"
                style="margin-top: 18px"
            >

                <h2>
                    Ask FinTwin
                </h2>

                <div class="pills">

                    <button class="pill question">
                        Can I afford a new laptop?
                    </button>

                    <button class="pill question">
                        Why is my resilience falling?
                    </button>

                    <button class="pill question">
                        Where am I overspending?
                    </button>

                </div>

                <p
                    id="coachReply"
                    class="insight"
                    style="margin-top: 15px"
                >
                    Choose a question for a mock,
                    explainable recommendation.
                </p>

            </section>
        `
    );


    document
        .querySelectorAll('.question')
        .forEach(
            (button) => {

                button.onclick = async () => {

                    $('#coachReply').textContent =
                        await api.getCoachInsight();

                };

            }
        );

}


// ========================================
// SETTINGS
// ========================================

function settings() {

    shell(
        'Settings',
        'Manage your profile, preferences, and account controls.',
        `
            <section class="content-grid">

                <!-- Profile -->

                <div class="card">

                    <h2>
                        Profile
                    </h2>

                    <label class="field">
                        Name

                        <input
                            class="input"
                            value="${data.user.name}"
                        >
                    </label>

                    <label
                        class="field"
                        style="margin-top: 12px"
                    >
                        Email

                        <input
                            class="input"
                            value="${data.user.email}"
                        >
                    </label>


                    <h2 style="margin-top: 24px">
                        Financial Preferences
                    </h2>

                    <label class="field">
                        Monthly income

                        <input
                            class="input"
                            value="₹60,000"
                        >
                    </label>

                    <label
                        class="field"
                        style="margin-top: 12px"
                    >
                        Planning preference

                        <select class="input">

                            <option>
                                Balanced growth
                            </option>

                            <option>
                                Conservative
                            </option>

                            <option>
                                Growth focused
                            </option>

                        </select>

                    </label>

                </div>


                <!-- Notifications & Security -->

                <div class="card">

                    <h2>
                        Notifications
                    </h2>

                    <p>
                        <label>
                            <input
                                type="checkbox"
                                checked
                            >
                            Email alerts
                        </label>
                    </p>

                    <p>
                        <label>
                            <input
                                type="checkbox"
                                checked
                            >
                            Goal reminders
                        </label>
                    </p>

                    <p>
                        <label>
                            <input
                                type="checkbox"
                            >
                            Budget alerts
                        </label>
                    </p>


                    <h2 style="margin-top: 28px">
                        Security
                    </h2>

                    <button class="btn secondary">
                        Change Password
                    </button>

                    <button
                        class="btn ghost"
                        id="logout"
                    >
                        Logout
                    </button>


                    <h2
                        class="danger"
                        style="margin-top: 28px"
                    >
                        Danger Zone
                    </h2>

                    <button class="btn secondary">
                        Delete Account
                    </button>

                </div>

            </section>
        `
    );


    $('#logout').onclick = () => {
        location.href = 'login.html';
    };

}


// ========================================
// MODAL
// ========================================

function modal(title, fields, submit) {

    const element =
        document.createElement('div');

    element.className = 'modal';

    element.innerHTML = `
        <div class="modal-box">

            <button
                class="icon-button"
                aria-label="Close"
            >
                Close
            </button>

            <h2>
                ${title}
            </h2>

            <form>

                ${fields}

                <button class="btn">
                    Save
                </button>

            </form>

        </div>
    `;


    document.body.append(element);


    element
        .querySelector('.icon-button')
        .onclick = () => element.remove();


    element
        .querySelector('form')
        .onsubmit = async (event) => {

            event.preventDefault();

            await submit(event.target);

            element.remove();

        };

}


// ========================================
// TOAST
// ========================================

function toast(message) {

    const element =
        document.createElement('div');

    element.className = 'toast';

    element.textContent = message;

    document.body.append(element);


    setTimeout(() => {
        element.remove();
    }, 2500);

}


// ========================================
// PAGE ROUTER
// ========================================

const pages = {
    dashboard,
    transactions,
    budget,
    goals: goalsPage,
    'financial-twin': twin,
    simulator,
    affordability,
    coach,
    settings
};


(pages[page] || dashboard)();

