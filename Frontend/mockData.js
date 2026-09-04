// export const data={user:{name:'Aarav Mehta',email:'aarav@example.com'},income:60000,expenses:35000,surplus:25000,resilience:78,transactions:[{id:1,date:'Aug 28',description:'Amazon',category:'Shopping',amount:3200,type:'Expense'},{id:2,date:'Aug 27',description:'Salary',category:'Income',amount:60000,type:'Income'},{id:3,date:'Aug 26',description:'Uber',category:'Transport',amount:420,type:'Expense'},{id:4,date:'Aug 25',description:'Zomato',category:'Food',amount:640,type:'Expense'}],goals:[{id:1,name:'Emergency Fund',current:75000,target:100000,date:'Dec 2026',contribution:8000,priority:'High'},{id:2,name:'Laptop',current:48000,target:100000,date:'Feb 2027',contribution:7000,priority:'High'},{id:3,name:'Vacation',current:30000,target:80000,date:'Apr 2027',contribution:3000,priority:'Medium'}]};
// export function load(){try{const x=JSON.parse(localStorage.getItem('fintwin'));if(x){Object.assign(data,x)}}catch(e){}}export function save(){localStorage.setItem('fintwin',JSON.stringify(data))}
export const data = {
    user: {
        name: 'Aarav Mehta',
        email: 'aarav@example.com'
    },

    income: 60000,
    expenses: 35000,
    surplus: 25000,
    resilience: 78,

    transactions: [
        {
            id: 1,
            date: 'Aug 28',
            description: 'Amazon',
            category: 'Shopping',
            amount: 3200,
            type: 'Expense'
        },
        {
            id: 2,
            date: 'Aug 27',
            description: 'Salary',
            category: 'Income',
            amount: 60000,
            type: 'Income'
        },
        {
            id: 3,
            date: 'Aug 26',
            description: 'Uber',
            category: 'Transport',
            amount: 420,
            type: 'Expense'
        },
        {
            id: 4,
            date: 'Aug 25',
            description: 'Zomato',
            category: 'Food',
            amount: 640,
            type: 'Expense'
        }
    ],

    goals: [
        {
            id: 1,
            name: 'Emergency Fund',
            current: 75000,
            target: 100000,
            date: 'Dec 2026',
            contribution: 8000,
            priority: 'High'
        },
        {
            id: 2,
            name: 'Laptop',
            current: 48000,
            target: 100000,
            date: 'Feb 2027',
            contribution: 7000,
            priority: 'High'
        },
        {
            id: 3,
            name: 'Vacation',
            current: 30000,
            target: 80000,
            date: 'Apr 2027',
            contribution: 3000,
            priority: 'Medium'
        }
    ]
};


export function load() {

    try {

        const storedData = JSON.parse(
            localStorage.getItem('fintwin')
        );

        if (storedData) {
            Object.assign(data, storedData);
        }

    } catch (e) {

        // Ignore invalid localStorage data

    }

}


export function save() {

    localStorage.setItem(
        'fintwin',
        JSON.stringify(data)
    );

}
