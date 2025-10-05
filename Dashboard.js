// Set up dummy data
if (!localStorage.getItem('chiradexUser')) {
  localStorage.setItem(
    'chiradexUser',
    JSON.stringify({
      balance: 0,
      pin: null,
      transactions: [],
      accountNumber: 'AC' + Math.floor(1000000000 + Math.random() * 9000000000)
    })
  );
}

const user = JSON.parse(localStorage.getItem('chiradexUser'));

document.querySelector('.balance').textContent = `$${user.balance}`;
document.querySelector('.account-number').textContent = `Account #: ${user.accountNumber}`;

// Handle Deposit
document.querySelector('.btn-box:nth-child(3)').onclick = () => {
  const amount = prompt('Enter amount to deposit:');
  if (!amount || isNaN(amount) || amount <= 0) return alert('Invalid amount');
  user.balance += Number(amount);
  user.transactions.unshift({ type: 'Deposit', amount, date: new Date().toLocaleString() });
  updateUser(user);
};

// Handle Withdraw
document.querySelector('.btn-box:nth-child(1)').onclick = () => {
  const amount = prompt('Enter amount to withdraw:');
  if (!amount || isNaN(amount) || amount <= 0 || Number(amount) > user.balance) {
    return alert('Invalid or insufficient amount');
  }
  user.balance -= Number(amount);
  user.transactions.unshift({ type: 'Withdraw', amount, date: new Date().toLocaleString() });
  updateUser(user);
};

// Handle Transfer with PIN
document.querySelector('.btn-box:nth-child(2)').onclick = () => {
  const pin = prompt(user.pin ? 'Enter your PIN:' : 'Set a 4-digit PIN:');
  if (!pin || pin.length !== 4) return alert('Invalid PIN');

  if (!user.pin) {
    user.pin = pin;
    alert('PIN set successfully. Proceed with transfer.');
  } else if (pin !== user.pin) {
    return alert('Incorrect PIN!');
  }

  const acct = prompt('Enter recipient account number:');
  const amount = prompt('Enter amount to transfer:');
  if (!amount || isNaN(amount) || amount <= 0 || Number(amount) > user.balance) {
    return alert('Invalid or insufficient amount');
  }

  user.balance -= Number(amount);
  user.transactions.unshift({
    type: 'Transfer',
    amount,
    to: acct,
    date: new Date().toLocaleString()
  });
  updateUser(user);
};

// Update DOM & storage
function updateUser(updatedUser) {
  localStorage.setItem('chiradexUser', JSON.stringify(updatedUser));
  document.querySelector('.balance').textContent = `$${updatedUser.balance}`;
  updateActivity();
}

// Show Recent Activity
function updateActivity() {
  const list = user.transactions.slice(0, 5).map(
    (t) =>
      `<p>${t.date} - ${t.type} - $${t.amount}${t.to ? ' to ' + t.to : ''}</p>`
  );
  document.querySelector('.recent-activity').innerHTML =
    '<h3>Recent Activity</h3>' + (list.length ? list.join('') : '<p>No recent transactions</p>');
}

// Initialize
updateActivity();
