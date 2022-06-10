'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Solomon Aboagye Dacosta',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
let id = 0;
// displaying movements in accounts
const displayMovements = function (account, isSorted = false) {
  const movements = account.movements;
  containerMovements.innerHTML = '';
  (isSorted
    ? movements.slice().sort((movOne, movTwo) => movOne - movTwo)
    : movements
  ).forEach((movement, index) => {
    const type = movement >= 0 ? 'deposit' : 'withdrawal';
    const template = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } deposit</div>
          <div class="movements__date">${genDate(
            account.locale,
            account.movementsDates[index]
          )}</div>
          <div class="movements__value">${formatCurrency(
            movement,
            account.locale,
            account.currency
          )}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', template);
  });
  labelDate.textContent = genDate(
    account.locale,
    new Date().toISOString(),
    true
  );
  toggleTimer();
};
console.log(labelDate.textContent);

const displayBalance = function (balance) {
  labelBalance.textContent = balance;
};

//calculating and printing the interest and income and outgoing
const calcDisplaySummary = function (loginAccount) {
  const movements = loginAccount.movements;
  const interestRate = loginAccount.interestRate;
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const outGoing = movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter(dep => dep > 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = formatCurrency(
    incomes,
    loginAccount.locale,
    loginAccount.currency
  );
  labelSumOut.textContent = formatCurrency(
    outGoing,
    loginAccount.locale,
    loginAccount.currency
  );
  labelSumInterest.textContent = formatCurrency(
    interest,
    loginAccount.locale,
    loginAccount.currency
  );
};

// creating usernames from initials
const createUserName = function (username) {
  const initials = username
    .toLowerCase()
    .split(' ')
    .map(name => name.at(0))
    .join('');
  return initials;
};

//calculating user balance
const balance = function (movements) {
  return movements.reduce((acc, cur) => acc + cur, 0);
};

//setting the username for the accounts
const setUserDetails = function (accounts) {
  accounts.forEach(account => {
    account.username = createUserName(account.owner);
  });
};

// finding the user
const findUser = function (accounts, userInput, confirm) {
  return accounts.find(
    account =>
      account.username === userInput.username &&
      (confirm || account.pin === +userInput.pin)
  );
};

//selecting login features
let loginAccount = '';

const updateUi = movements => {
  displayBalance(
    formatCurrency(
      balance(movements),
      loginAccount.locale,
      loginAccount.currency
    )
  );
  displayMovements(loginAccount);
  calcDisplaySummary(loginAccount);
};

// creating date generator
const genDate = function (country, date, isBalance = false) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(isBalance && { hour: '2-digit', minute: '2-digit' }),
  };

  const currentDate = new Date(date);
  const interDate = new Intl.DateTimeFormat(country, options).format(
    currentDate
  );
  console.log(interDate);
  return interDate;
};

//creating currency formatter
const formatCurrency = function (amount, locale, currency) {
  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    unitDisplay: 'short',
  }).format(amount);
  return formattedCurrency;
};

//creating countdown for logout
const logoutAccount = function () {
  let time = 5 * 60;
  const ticker = function () {
    --time;
    const minutes = Math.trunc(time / 60);
    const seconds = time % 60;
    labelTimer.textContent = `${String(minutes).padStart(2, 0)} : ${String(
      seconds
    ).padStart(2, 0)}`;

    if (time === 0) {
      clearInterval(id);
      signUserOut();
    }
  };
  ticker();
  id = setInterval(ticker, 1000);
  return id;
};

//toggling the timer
const toggleTimer = function () {
  if (id > 0) {
    clearInterval(id);
  }
  logoutAccount();
};

// calculating the balance of the bank
const bankBalanceCalc = function () {
  const totalMovements = accounts.map(account => account.movements).flat();
  return balance(totalMovements);
};

const signUserOut = function () {
  labelWelcome.innerHTML = 'Log in to get started';
  containerApp.style.opacity = '0';
};
/////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////
//adding event listeners
/////////////////////////////////////////
document.querySelectorAll('button').forEach(el => {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    toggleTimer();
  });
});

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;
  inputLoginUsername.value = inputLoginPin.value = '';
  loginAccount = findUser(accounts, { username, pin });

  // displaying ui
  if (loginAccount) {
    containerApp.style.opacity = '1';
    labelWelcome.innerHTML = `Welcome back, <b>${loginAccount.owner
      .split(' ')
      .at(0)}</b>`;
    updateUi(loginAccount.movements);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  console.log('clicked');
  const username = inputTransferTo.value;
  const amount = +inputTransferAmount.value;
  const findReceiver = findUser(accounts, { username }, true);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    findReceiver &&
    amount <= balance(loginAccount.movements) &&
    amount > 0 &&
    findReceiver?.username !== loginAccount.username
  ) {
    findReceiver.movements.push(amount);
    loginAccount.movements.push(-amount);
    findReceiver.movementsDates.push(new Date().toISOString());
    loginAccount.movementsDates.push(new Date().toISOString());
    updateUi(loginAccount.movements);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loan = inputLoanAmount.value;
  inputLoanAmount.value = '';
  if (loan > 0 && loginAccount.movements.some(mov => mov >= 0.1 * loan)) {
    loginAccount.movements.push(loan);
    loginAccount.movementsDates.push(new Date().toISOString());
    updateUi(loginAccount.movements);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';

  if (loginAccount.username === username && loginAccount.pin === pin) {
    const index = accounts.findIndex(account => account === loginAccount);
    accounts.splice(index, 1);
    signUserOut();
  }
});

let isSorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  isSorted = !isSorted;
  displayMovements(loginAccount, isSorted);
});

console.log(bankBalanceCalc());
setUserDetails(accounts);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const newMovements = movements.sort((movOne, movTwo) => movTwo - movOne);
// console.log(newMovements, movements);

//practicing the use of from  and to methods of arrays

// const arr = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
// console.log(arr);
// const arr2 = new Array(7).fill(0);
// console.log(arr2);
// console.log(document.querySelectorAll('.movements__value'));
// const arr3 = Array.from(
//   document.querySelectorAll('.movements__value'),
//   node => `${node.textContent}`
// );
// const arr4 = [1, [23, [2, 3, 4, 55]], 2, 33, 44, [12]];
// console.log(arr4.flatMap(val => val));
// console.log(arr4.flat(3));
// console.log(arr4);
// console.log(arr4.flat(3).find(val => val > 1113));
// console.log(arr4.at(88));
// console.log(arr4.join(''));
// console.log(arr4);
// console.log(arr4);
// console.log(arr4.copyWithin(2, 1, 4));
// console.log(arr4);
// calcDisplaySummary(movements);
// displayBalance(balance(movements));
// console.log(balance(movements));
// console.log(createUserName(account3.owner));
// displayMovements(movements);
// console.log(accounts);

/////////////////////////////////////////////////
// console.log(findUser(accounts, userInput));
// const findUser2 = function(accounts,callback){
//   return accounts.find(account => callback(account) === true)
// }

//finding the user that is login
// const userInput = { username: 'sad', pin: 1111 };
// const average = movements =>
//   movements.reduce((acc, cur, _, arr) => acc + Math.abs(cur) / arr.length, 0);

//finding userbased on several properties
// console.log(findUser2(accounts,(account)=>{
//   console.log(average(account.movements) >= 20);
//   return average(account.movements) >= 1200;
// }))

// const max = movements.reduce((acc, cur) => {
//   acc = (acc > cur && acc) || cur;
//   return acc;
// }, movements.at(0));
// console.log(max);

// console.log(average);

// const arr = ['a','b','c','d','e','f','g']
// //slice method
// console.log(arr.slice(-3))
// //splice method
// console.log(arr)
// console.log(arr.splice(3,1))
// console.log(arr)
// //working with reverse
// const arr2 = ['m','n','o','p']
// console.log('original array',arr2)
// console.log('reversed array',arr2.reverse())
// console.log('Results of reverse on original array',arr2)
// // Concat method
// const letters = arr.concat(arr2)
// console.log('results of catenating the two arrays ',letters)
// // Push and Pop
// console.log('return value of push ',arr2.push('l','k','i'));
// console.log('output before pop',arr2)
// console.log('return value of pop : ',arr2.pop());
// console.log('output after pop',arr2);
// //shift and unshift
// console.log('the return of unshift',arr2.unshift('u','e'))
// console.log(arr2);
// console.log('return of shift : ',arr2.shift())
// //includes
// //strings have contains and arrays includes
// console.log(arr2.includes('m'))
// console.log(arr2)
// console.log(arr2.at(3))

// const converter = (a = 'the man is good',b = 'girl') =>{
//   return a.split('').reverse().map((val,index)=> (index + 1) % 3 == 0  ? `${b}${val}` : val  ).reverse().join('')
// }

// console.log(converter())
