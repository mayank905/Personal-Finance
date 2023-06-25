var data1;
let total = {
  'income': 0,
  'expense': 0,
  'goal': 0,
  'remaining': 0,
  'goal-priority': 100,
  'budget': 0,
  'budget-priority': 100
}
let currentGoalPriority;
let expense;
let budgetPriorities;
let goalPriorities;
let initialState = {
  'goal_state': [],
  'budget_state': [],
  'expense_state': [],
  'income_state': []
}
const obj = {
  'income_RowValues': [],
  'goal_RowValues': [],
  'budget_RowValues': [],
  'expense_RowValues': [],
}
var expenseHtml = `
<td><input type="number" step="0.01" class="amount" required></td>
<td><input type="text" class="category" required></td>
<td><input type="text" class="description"></td>
<td><input type="date" class="date" required></td>
<td class="hidden"><input type="number" class="id"></td>
<td class="hidden"><input type="checkbox" class="del"></td>
<td class="hidden"><input type="checkbox" class="edit"></td>
<td><button class="remove-row">Remove</button></td>

`;
var goalHtml = `
<td class="hidden"><input type="checkbox" class="lock-priority" value="false"></td>
<td class="hidden"><input type="range" min="0" max="100" value=0 class="priority" required> <span id="goal-rangeValue"></span></td>
<td><input type="text" class="category" required></td>
<td><input type="number" step="1" class="amount" required></td>
<td><input type="date" class="date" required></td>
<td class="hidden"></td>
<td class="hidden"></td>
<td class="hidden"><input type="number" class="id"></td>
<td class="hidden"><input type="checkbox" class="del"></td>
<td class="hidden"><input type="checkbox" class="edit"></td>
<td class="editRemove"><button class="remove-row">Remove</button></td>
`;

var budgetHtml = `
<td class="hidden"><input type="checkbox" class="lock-priority" value="false"></td>
<td><input type="range" min="0" max="100" value="0" class="priority" required></td>
<td class="category"></td>
<td class="amount"></td>
<td class="budget"></td>
<td class="hidden"><input type="number" class="id"></td>
`;
function ddmmyyyy(date1) {
  const date = new Date(date1);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: Months are zero-based
  const year = date.getFullYear();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  return `${year}-${formattedMonth}-${formattedDay}`;
}

function receiveCurrentTable(data, tableprefix) {
  if (tableprefix === 'income') {
    insertIncomeExpenseData(data, tableprefix);
  }
  else if (tableprefix === 'expense') {
    insertIncomeExpenseData(data[0], tableprefix);
    insertBudgetData(data[1], 'budget');
  }
  else if (tableprefix === 'goal') {
    insertGoalData(data, tableprefix);
  }
  else if (tableprefix === 'budget') {
    insertBudgetData(data, tableprefix);
  }
}

function insertBudgetData(data, tableprefix) {
  const table = document.getElementById(`${tableprefix}-TableOuter`);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  budgetPriorities = {};
  expense = {};
  initialState[tableprefix + '_state'] = [];
  total[tableprefix + '-priority'] = 100;
  // total[tableprefix]=0;
  data.forEach((row) => {
    if (row.lock_priority === true) {
      total[tableprefix + '-priority'] -= row.priority;
    }
    // total[tableprefix]+=row.amount;
    budgetPriorities[row.category] = [row.priority, row.lock_priority];
    expense[row.category] = row.amount;
    let newRow = document.createElement('tr');
    initialState[tableprefix + '_state'].push(getRowState(row));
    const propName = `${tableprefix}_id`;
    let budgetAlloted = Math.round(row.priority / 100 * total['income']);
    let budgetUsed;
    if (budgetAlloted == 0) {
      budgetUsed = 0;
    }
    else if (row.category === 'Savings') {
      budgetUsed = currentGoalPriority;
      total['goal'] = budgetAlloted;
    }
    else {
      budgetUsed = Math.round(row.amount / budgetAlloted * 100);
    }
    newRow.innerHTML = `
        ${budgetPriorities[row.category][1] === true ? `<td><input type="checkbox" class="lock-priority" value="true" checked></td>` : `<td><input type="checkbox" class="lock-priority" value="false"></td>`}
        ${budgetPriorities[row.category][1] === true ? `<td><input type="range" min="0" max="100"class="priority" disabled value=${budgetPriorities[row.category][0]} required> <span id="goal-rangeValue">${budgetPriorities[row.category][0]}</span></td>` : `<td><input type="range" min="0" max="100"class="priority" value=${budgetPriorities[row.category][0]} required> <span id="goal-rangeValue">${budgetPriorities[row.category][0]}</span></td>`}
        <td>${row.category}</td>
        <td>₹ ${budgetAlloted}</td>
        <td>${budgetUsed} %</td>
        <td class="hidden">${row[propName]}</td>
        <td class="hidden"><input type="checkbox" value="false" class="edit"></td>
        <td class="hidden"><input type="checkbox" value="false" class="del"></td>
      `;
    tbody.appendChild(newRow);
  });
  console.log('budgetpriority ' + total[tableprefix + '-priority']);
}

function getRowState(row) {
  const regex = /.+_id$/;
  let id;
  const cellValues = Object.entries(row).filter(([category]) => {
    const match = category.match(regex);
    if (match) { id = category; }
    return (!match && category !== "created_at" && category !== "updated_at")
  }).map(cell => `${cell[1]}`);
  cellValues.unshift(row[id]);
  return cellValues.join(',');
}


function insertGoalData(data, tableprefix) {
  const table = document.getElementById(`${tableprefix}-TableOuter`);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  currentGoalPriority = 0;
  total[tableprefix] = 0;
  goalPriorities = {};
  initialState[tableprefix + '_state'] = [];
  console.log(total[tableprefix + '-priority']);
  data.forEach((row) => {
    currentGoalPriority += row.priority;
    if (row.lock_priority === true) {
      total[tableprefix + '-priority'] -= row.priority;
    }
    total[tableprefix] += row.current_saving;
    const newRow = document.createElement('tr');
    const propName = `${tableprefix}_id`;
    const date = ddmmyyyy(row.target_date);
    row.target_date = date;
    initialState[tableprefix + '_state'].push(getRowState(row));
    goalPriorities[row.category] = [row.priority, row.lock_priority];
    newRow.innerHTML = `
        ${goalPriorities[row.category][1] === true ? `<td><input type="checkbox" class="lock-priority" value="true" checked></td>` : `<td><input type="checkbox" class="lock-priority" value="false"></td>`}
        ${goalPriorities[row.category][1] === true ? `<td><input type="range" min="0" max="100"class="priority" disabled value=${goalPriorities[row.category][0]} required> <span id="goal-rangeValue">${goalPriorities[row.category][0]}</span></td>` : `<td><input type="range" min="0" max="100"class="priority" value=${goalPriorities[row.category][0]} required> <span id="goal-rangeValue">${goalPriorities[row.category][0]}</span></td>`}
        <td><input class="outerForm category" type="text" value="${row.category}"></td>
        <td><input class="outerForm target-amount" type="text" value="₹ ${row.target_amount}"></td>
        <td><input class="outerForm target-date" type="date" value="${date}"></td>
        <td>₹ ${row.current_saving}</td>
        <td>${row.status} %</td>
        <td class="hidden">${row[propName]}</td>
        <td class="hidden"><input type="checkbox" value="false" class="del"></td>
        <td class="hidden"><input type="checkbox" value="false" class="edit"></td>
        <td class="editRemove"><button class="remove-row remove-${tableprefix}">Remove</button></td>
      `;
    tbody.appendChild(newRow);
  });
  console.log('goalpriority ' + total[tableprefix + '-priority']);
  console.log(initialState);
  const totalElement = document.getElementById(`${tableprefix}-total`);
  // totalElement.innerText = `₹ ${total[tableprefix]}`;
  totalElement.innerText = `₹ ${total['goal']}`;
  const totalRemainingElement = document.getElementById(`remaining-total`);
  totalRemainingElement.innerText = `₹ ${total['income'] - (total['expense'] + total['goal'])}`;
}


function insertIncomeExpenseData(data, tableprefix) {
  const table = document.getElementById(`${tableprefix}-TableOuter`);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  total[tableprefix] = 0;
  initialState[tableprefix + '_state'] = [];
  data.forEach((row) => {
    total[tableprefix] += row.amount;
    const date = ddmmyyyy(row.date);
    row.date = date;
    const newRow = document.createElement('tr');
    const propName = `${tableprefix}_id`;
    initialState[tableprefix + '_state'].push(getRowState(row));
    newRow.innerHTML = `
        <td><input class="outerForm amount" type="text" value="₹ ${row.amount}"></td>
        <td><input class="outerForm category" type="text" value="${row.category}"></td>
        <td><input class="outerForm description" type="text" value="${row.description}"></td>
        <td><input class="outerForm date" type="date" value="${date}"></td>
        <td class="hidden">${row[propName]}</td>
        <td class="hidden"><input type="checkbox" value="false" class="del"></td>
        <td class="hidden"><input type="checkbox" value="false" class="edit"></td>
        <td><button class="remove-row remove-${tableprefix}">Remove</button></td>
      `;
    tbody.appendChild(newRow);
  });
  const totalElement = document.getElementById(`${tableprefix}-total`);
  totalElement.innerText = `₹ ${total[tableprefix]}`;
  const totalRemainingElement = document.getElementById(`remaining-total`);
  totalRemainingElement.innerText = `₹ ${total['income'] - (total['expense'] + total['goal'])}`;
}

function insertData() {
  insertIncomeExpenseData(data1[0], 'expense');
  insertIncomeExpenseData(data1[1], 'income');
  insertGoalData(data1[2], 'goal');
  insertBudgetData(data1[3], 'budget');
}


function retreiveData(tableId, edit,forceEdit) {
  return new Promise((resolve, reject) => {
    const table = document.getElementById(tableId);
    if (table.rows.length === 0) {
      console.log('empty');
      return;
    }
    const prefix = tableId.split('-')[0];
    const regex1 = /₹ /;
    const regex3 = / %/;

    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const cellValues = [];

      for (let j = 0; j < row.cells.length - 1; j++) {
        const cell = row.cells[j];
        const input = cell.querySelector('input[required]');
        let cellValue;
        if (input) {
          cellValue = input.value;
          if (cellValue === '') {
            return;
          }
        }
        else {
          const input = cell.querySelector('input');
          if (input) {
            if(forceEdit && input.classList.contains('edit')){
              input.value = true;
            }
            cellValue = input.value;
          }
          else {
            cellValue = cell.innerText;
          }
        }
        if (cellValue.match(regex1)) {
          cellValue = cellValue.split(regex1)[1];
        }
        else if (cellValue.match(regex3)) {
          cellValue = cellValue.split(regex3)[0];
        }
        cellValues.push(cellValue);
      }
      if (edit) {
        if (row.querySelector('.edit').value === 'true') {
          obj[`${prefix}_RowValues`].push(cellValues);
        }
      }
      else {
        obj[`${prefix}_RowValues`].push(cellValues);
      }
    }
    resolve('data retreive successfully');
  });
}

function sendTwoTableEditData(form, formData, form2, formData2) {
  const finalData1 = obj[formData];
  const finalData2 = obj[formData2];
  const prefix1 = formData.split('_')[0];
  const prefix2 = formData2.split('_')[0];
  if (finalData1.length === 0 && finalData2.length === 0) {
    console.log('empty');
    return;
  }

  fetch(`https://65.2.85.58:8090/api/${prefix1}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      finalData: finalData1
    }),
    credentials: 'include' // Include cookies in the request
  })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
      obj[formData] = [];
      return response.json();
    }
    )
    .then(data => {
      form.reset();
      console.log('Success:', data);
      receiveCurrentTable(data, prefix1);
      return fetch(`https://65.2.85.58:8090/api/${prefix2}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          finalData: finalData2
        }),
        credentials: 'include' // Include cookies in the request
      })
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
      obj[formData2] = [];
      return response.json();
    }
    )
    .then(data => {
      form2.reset();
      console.log('Success:', data);
      receiveCurrentTable(data, prefix2);
    })
    .catch((error) => {
      if (error.message === 'Unauthorized') {
        setTimeout(function () {
          window.location.href = '../login/login.html';
        }, 1000);
      }
      console.error('Error:', error);
    }
    );


}

function sendData(form, formData) {
  const finalData = obj[formData];
  const prefix = formData.split('_')[0];
  if (finalData.length === 0) {
    console.log('empty');
    return;
  }
  console.log(finalData);
  fetch(`https://65.2.85.58:8090/api/${prefix}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      finalData: finalData
    }),
    credentials: 'include' // Include cookies in the request
  })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
      obj[formData] = [];
      return response.json();
    })
    .then(data => {
      form.reset();
      console.log('Success:', data);
      receiveCurrentTable(data, prefix);
    })
    .catch((error) => {
      if (error.message === 'Unauthorized') {
        setTimeout(function () {
          window.location.href = '../login/login.html';
        }, 1000);
      }
      console.error('Error:', error);
    });


}

// Add Row Event
function addRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');

  const newRow = document.createElement('tr');

  if (tableId === 'budgetTable' || tableId === 'goal-TableInner') {
    const rowHtml = tableId === 'budgetTable' ? budgetHtml : goalHtml;
    newRow.innerHTML = rowHtml;
  } else {
    newRow.innerHTML = expenseHtml;
  }

  tbody.appendChild(newRow);
}

// Remove Row Event
function removeRow(button) {
  const row = button.closest('tr');
  const delInput = row.querySelector('.del');
  delInput.checked = true;
  delInput.value = true;
  const cellValues = [];
  const regex1 = /₹ /;
  const regex3 = / %/;
  const delRow = button.closest('section').id;
  if (button.classList.contains(`remove-${delRow}`)) {
    for (let j = 0; j < row.cells.length - 1; j++) {
      const input = row.cells[j].querySelector('input');
      let cellValue;
      if (input) {
        if (input.classList.contains('priority')) {
          total[`${delRow}-priority`] += parseInt(input.value);
        }
        cellValue = input.value;
      } else {
        cellValue = row.cells[j].innerText;
      }
      if (cellValue.match(regex1)) {
        cellValues.push(cellValue.split(regex1)[1]);
      }
      else if (cellValue.match(regex3)) {
        cellValues.push(cellValue.split(regex3)[0]);
      }
      else {
        cellValues.push(cellValue);
      }
    }
    obj[`${delRow}_RowValues`].push(cellValues);
  }
  console.log("row abt to be remove " + obj[`${delRow}_RowValues`]);
  row.remove();
}

function calculateGoalStatus(row, saving) {
  let statusCol = row.querySelector('td:nth-child(7)');
  const amount = parseInt(row.querySelector('td:nth-child(4)').querySelector('input').value.split(' ')[1]);
  const status = Math.round(saving / amount * 100);
  statusCol.innerText = `${status} %`;
}

function calculateSavings(changedCategory, newPriority, prefix) {
  const priorities = prefix === 'goal' ? goalPriorities : budgetPriorities;
  const table = document.getElementById(`${prefix}-TableOuter`);
  const tbody = table.querySelector('tbody');
  const rows = tbody.querySelectorAll('tr');
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let category;
    if (prefix === 'goal') {
      category = row.querySelector('td:nth-child(3)').querySelector('input').value;
    }
    else {
      category = row.querySelector('td:nth-child(3)').innerText;
    }
    const priority = row.querySelector('td:nth-child(2)').querySelector('input');
    if (category === changedCategory) {
      priority.value = newPriority;
      row.querySelector('td:nth-child(2)').querySelector('span').innerText = newPriority;
    }
    else if (priorities[category][1] !== true) {
      priority.value = priorities[category][0];
      row.querySelector('td:nth-child(2)').querySelector('span').innerText = priorities[category][0];
    }
    if (prefix === 'goal') {
      const totalName = 'goal';
      const saving = Math.round(priorities[category][0] / 100 * total[totalName]);
      const savingCol = row.querySelector('td:nth-child(6)');
      savingCol.innerText = `₹ ${saving}`;
      calculateGoalStatus(row, saving);
    }
    else {
      const totalName = 'income';
      const budgetAlloted = Math.round(priorities[category][0] / 100 * total[totalName]);
      const savingCol = row.querySelector('td:nth-child(4)');
      savingCol.innerText = `₹ ${budgetAlloted}`;
      let budgetUsed = Math.round(expense[category] / budgetAlloted * 100);
      if (budgetAlloted == 0) {
        budgetUsed = 0;
      }
      if (budgetAlloted != 0 && category === 'Savings') {
        total['goal'] = budgetAlloted;
        total['remaining'] = total['income'] - (total['expense'] + total['goal']);
        budgetUsed = currentGoalPriority;
        const totalElement = document.getElementById(`goal-total`);
        totalElement.innerText = `₹ ${total['goal']}`;
        const totalRemainingElement = document.getElementById(`remaining-total`);
        totalRemainingElement.innerText = `₹ ${total['income'] - (total['expense'] + total['goal'])}`;
        calculateSavings('Savings', currentGoalPriority, 'goal');
      }
      const budgetUsedCol = row.querySelector('td:nth-child(5)');
      budgetUsedCol.innerText = `${budgetUsed} %`;
    }

  }
  if (prefix === 'goal') {
    const table2 = document.getElementById(`budget-TableOuter`);
    const tbody2 = table2.querySelector('tbody');
    const rows2 = tbody2.querySelectorAll('tr');
    for (let i = 0; i < rows2.length; i++) {
      const row = rows2[i];
      const category = row.querySelector('td:nth-child(3)').innerText;
      console.log("ForSavings " + category);
      if (category === 'Savings') {
        const budgetUsedCol = row.querySelector('td:nth-child(5)');
        budgetUsedCol.innerText = `${currentGoalPriority} %`;
        break;
      }
    }
  }
}

function recalculatePriorities(changedCategory, newPriority, prefix) {
  const priorities = prefix === 'goal' ? goalPriorities : budgetPriorities;
  const prevPriority = priorities[changedCategory][0];
  const filteredObject = Object.entries(priorities)
    .filter(([category]) => category !== changedCategory && priorities[category][1] === false);
  let length = filteredObject.length;
  const sumOfOtherPriorities = filteredObject.reduce((acc, priority) => acc + priority[1][0], 0);

  console.log('sumOfOtherPriorities ' + sumOfOtherPriorities);
  // const adjustmentRatio = (total[prefix + '-priority'] - sumOfOtherPriorities) / (total[prefix + '-priority'] - priorities[changedCategory][0]);
  // console.log(adjustmentRatio);

  priorities[changedCategory][0] = newPriority;
  if (prefix === 'goal') {
    currentGoalPriority = 0;
  }
  if (prevPriority < newPriority) {
    const diff = newPriority - prevPriority;
    for (const [category, priority] of Object.entries(priorities)) {
      if (category !== changedCategory && priority[1] !== true) {
        if (sumOfOtherPriorities === length || newPriority === total[prefix + '-priority']) {
          priorities[category][0] = 0;
        }
        else {
          if (sumOfOtherPriorities === 0) {
            priorities[category][0] = priorities[category][0];
          }
          else {
            priorities[category][0] = Math.max(0, Math.round(priority[0] - (priority[0] / sumOfOtherPriorities) * diff));
          }
        }
      }
    }
  }
  else {
    const diff = prevPriority - newPriority;
    for (const [category, priority] of Object.entries(priorities)) {
      if (category !== changedCategory && priority[1] !== true) {
        if (sumOfOtherPriorities === 0) {
          priorities[category][0] = Math.min(100, Math.round(priority[0] + (1 / length) * diff));
        }
        else {
          priorities[category][0] = Math.min(100, Math.round(priority[0] + (priority[0] / sumOfOtherPriorities) * diff));
        }
      }
    }
  }
  if (prefix === 'goal') {
    currentGoalPriority = Object.entries(priorities).reduce((acc, priority) => acc + priority[1][0], 0);
  }
  calculateSavings(changedCategory, newPriority, prefix);
}



function getCurrentState(row, prefix) {
  const cellValues = [];
  const regex1 = /₹ /;
  const regex3 = / %/;
  if (prefix === 'budget') {
    for (let j = 0; j < row.cells.length - 5; j++) {
      const input = row.cells[j].querySelector('input');
      let cellValue;
      if (input) {
        cellValue = input.value;
      } else {
        cellValue = row.cells[j].innerText;
      }
      cellValues.push(cellValue);

    }
    cellValues.unshift(row.cells[row.cells.length - 3].innerText);
    const categoryExpense = expense[row.cells[2].innerText];
    cellValues.push(categoryExpense);
    console.log(cellValues.join(','));
    return cellValues.join(',');
  }
  else {
    for (let j = 0; j < row.cells.length - 4; j++) {
      const input = row.cells[j].querySelector('input');
      let cellValue;
      if (input) {
        cellValue = input.value;
      } else {
        cellValue = row.cells[j].innerText;
      }
      if (cellValue.match(regex1)) {
        cellValues.push(cellValue.split(regex1)[1]);
      }
      else if (cellValue.match(regex3)) {
        cellValues.push(cellValue.split(regex3)[0]);
      }
      else {
        cellValues.push(cellValue);
      }
    }
    cellValues.unshift(row.cells[row.cells.length - 4].innerText);
    console.log(cellValues.join(','));
    return cellValues.join(',');
  }
}

// eventListeners

window.addEventListener('DOMContentLoaded', () => {
  fetch('https://65.2.85.58:8090/api/information', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Include cookies in the request
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
      return response.json();
    })
    .then(data => {
      // Handle the response data
      console.log(data);
      data1 = data;
      insertData();
    })
    .catch(error => {
      // Handle any errors
      if (error.message === 'Unauthorized') {
        setTimeout(function () {
          window.location.href = '../login/login.html';
        }, 1000);
      }
      console.error(error);
    });
});

document.addEventListener('change', function (event) {
  const prefix = event.target.closest('form').id.split('-')[0];
  if (event.target.classList.contains('priority')) {
    let value = event.target.value;
    console.log('totalpriority ' + total[prefix + '-priority']);
    console.log('slidervalue ' + value);
    const maxvalue = prefix === 'goal' ? total['goal-priority'] : total['budget-priority'];
    if (value > maxvalue) {
      event.target.value = maxvalue;
      value = maxvalue;
    }
    if (value <= 0) {
      event.target.value = 0;
      value = 0;
    }
    let category;
    let priorities;
    if (prefix === 'goal') {
      category = event.target.closest('tr').querySelector('td:nth-child(3)').querySelector('input').value;
      priorities = goalPriorities;
    }
    else {
      category = event.target.closest('tr').querySelector('td:nth-child(3)').innerText;
      priorities = budgetPriorities;
    }
    const prevValue = priorities[category][0];
    recalculatePriorities(category, parseInt(value), prefix);
    const currentValue = priorities[category][0];
    const priority = event.target.parentNode.querySelector('span');
    priority.innerText = value;
    if (prevValue == currentValue) {
      priority.innerText = prevValue;
      event.target.value = prevValue;
    }
    const tbody = event.target.closest('tbody');
    const rows = tbody.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      row.querySelector('.edit').value = true;
    }

  }
  else {
    if (event.target.classList.contains('lock-priority')) {
      const value = event.target.value === 'true' ? false : true;
      const tr = event.target.closest('tr');
      const priority = tr.querySelector('td:nth-child(2)');
      let category;
      if (prefix === 'goal') {
        category = tr.querySelector('td:nth-child(3)').querySelector('input').value;
      }
      else {
        category = tr.querySelector('td:nth-child(3)').innerText;
      }

      const priorities = prefix === 'goal' ? goalPriorities : budgetPriorities;
      if (value) {
        event.target.setAttribute('value', true);
        priority.querySelector('input').setAttribute('disabled', true);
        priorities[category][1] = true;
        total[prefix + '-priority'] -= priorities[category][0];
        if (total[prefix + '-priority'] < 0) {
          total[prefix + '-priority'] = 0;
        }
        console.log(total[prefix + '-priority']);
      }
      else {
        event.target.setAttribute('value', false);
        priority.querySelector('input').removeAttribute('disabled');
        priorities[category][1] = false;
        total[prefix + '-priority'] += priorities[category][0];
        if (total[prefix + '-priority'] > 100) {
          total[prefix + '-priority'] = 100;
        }
        console.log(total[prefix + '-priority']);
      }
    }
    else if (event.target.classList.contains('target-amount')) {
      const tr = event.target.closest('tr');
      const saving = tr.querySelector('td:nth-child(6)').innerText.split(' ')[1];
      calculateGoalStatus(tr, saving);
    }
    const tr = event.target.closest('tr');
    currentState = getCurrentState(tr, prefix);
    if (initialState[`${prefix}_state`].includes(currentState)) {
      console.log('not changed');
      tr.querySelector('.edit').value = false;
      console.log(tr);
    }
    else {
      console.log('changed');
      tr.querySelector('.edit').value = true;
      console.log(tr);
    }
  }
});

document.addEventListener('input', function (event) {
  if (event.target.classList.contains('priority')) {
    const prefix = event.target.closest('form').id.split('-')[0];
    const maxvalue = prefix === 'goal' ? total['goal-priority'] : total['budget-priority'];

    let value = event.target.value;
    if (value > maxvalue) {
      event.target.value = maxvalue;
      value = maxvalue;
    }
    if (value <= 0) {
      event.target.value = 0;
      value = 0;
    }
    const priority = event.target.parentNode.querySelector('span');
    priority.innerText = value;
  }
});


document.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-row')) {
    console.log(event.target);
    removeRow(event.target);
  }
  else if (event.target.classList.contains('add-row')) {
    event.preventDefault();
    const tableId = event.target.closest('form').querySelector('table').id;
    addRow(tableId);
  }
  else if (event.target.classList.contains('submit')) {
    const tableId = event.target.parentNode.querySelector('table').id;
    const prefix = tableId.split('-')[0];
    const finalData = prefix + '_RowValues';
    const suffix = tableId.split('-')[1];
    const form = document.getElementById(tableId).closest('form');
    if (suffix === 'TableOuter') {
      event.preventDefault();
      if (prefix === 'budget') {
        retreiveData(tableId, true,false).then((result) => {
          console.log(obj[finalData]);
          return retreiveData('goal-TableOuter', true,true);
        }).then((result) => { console.log(result);console.log(obj['goal_RowValues']); }).catch((error) => {
          console.error('Error:', error);
        });
        const form2 = document.getElementById('goal-TableOuter').closest('form');
        sendTwoTableEditData(form, finalData, form2, 'goal_RowValues');
      } else {
        retreiveData(tableId, true,false).then((result) => {
          console.log(result);
        }).catch((error) => {
          console.error('Error:', error);
        });
        sendData(form, finalData);
      }
    }
    else {
      if (!form.checkValidity()) {
        console.log('invalid');// Prevent default form submission
        return;
      }
      event.preventDefault();
      retreiveData(tableId, false,false).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.error('Error:', error);
      });
      sendData(form, finalData);
    }

  }
  // else if(event.target.classList.contains('logout')){
  //   event.preventDefault();
  //   fetch('https://65.2.85.58:8090/api/logout', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     credentials: 'include' // Include cookies in the request
  //   })
  //       .then(response =>{
  //         if (!response.ok) {
  //           return response.json().then(errorData => {
  //             throw new Error(errorData.message);
  //           });
  //         }
  //         return response.json();
  //       })
  //       .then(data => {
  //         // Handle the response data
  //         console.log(data);
  //         window.location.href = "https://mayank905.github.io/Personal-Finance/Front-end/login/login.html";
  //       })
  //       .catch(error => {
  //         // Handle any errors
  //         console.error(error);
  //       });
  // }
  else if (event.target.classList.contains('overlay-button')) {
    event.preventDefault();
    const section = event.target.closest('section');
    const divs = section.querySelectorAll('div');
    const secondDiv = divs[1];
    secondDiv.style.display = 'flex';
  }
  else if (event.target.classList.contains('overlay')) {

    if (event.target.style.display === 'flex') {
      event.target.style.display = 'none';
    }
  }
});






