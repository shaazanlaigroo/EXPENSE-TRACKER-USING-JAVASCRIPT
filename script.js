var balance = document.querySelector('.balance span');
var money_plus = document.querySelector('#credit .add');
var money_minus = document.querySelector('#debit .sub');
var list = document.querySelector('.list');
var form = document.querySelector('form');
var text = document.querySelector('#text');
var amount = document.querySelector('#amount');
var type = document.querySelector('#type');
var localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add text and amount');
    } else {
        const transactionType = type.value;
        const transactionAmount = transactionType === "credit" ? +amount.value : -amount.value;
        
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: transactionAmount
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.classList.add('history');

    item.innerHTML = `
      ${transaction.text} <span class="${transaction.amount < 0 ? 'minus' : 'plus'}">${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `+₹${income}`;
    money_minus.innerText = `-₹${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function Init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

Init();

form.addEventListener('submit', addTransaction);
