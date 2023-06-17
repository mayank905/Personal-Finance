var data1;
const total={
  'income':0,
  'expense':0,
  'saving':0
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
<td><input type="number" class="id"></td>
<td><button class="remove-row">Remove</button></td>

`;
var goalHtml = `
<td><input type="range" min="0" max="100" value="1" class="priority" required></td>
<td><input type="text" class="category" required></td>
<td><input type="number" step="0.01" class="amount" required></td>
<td><input type="number" step="0.01" class="current-amount" required>
</td><td><input type="date" class="date" required></td>
<td><input type="number" class="id"></td>
<td><button class="remove-row">Remove</button></td>
`;

var budgetHtml = `
<td><input type="range" min="0" max="100" value="1" class="priority" required></td>
<td><input type="text" class="category" required></td>
<td><input type="number" step="0.01" class="amount" required></td>
<td><input type="number" class="id"></td>
<td><button class="remove-row">Remove</button></td>
`;
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: Months are zero-based
  const year = date.getFullYear().toString().slice(-2);

  // Pad single-digit day and month with leading zero if needed
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${year}-${formattedMonth}-${formattedDay}`;
}
function insertIncomeExpenseData(data,tableprefix){
  const table = document.getElementById(`${tableprefix}-TableOuter`);
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  total[tableprefix]=0;
  data.forEach((row) => {
    total[tableprefix]+=row.amount;
    const date = formatDate(row.date);
    const newRow = document.createElement('tr');
    const propName=`${tableprefix}_id`;
    newRow.innerHTML = `
        <td>₹ ${row.amount}</td>
        <td>${row.category}</td>
        <td>${row.description}</td>
        <td>${date}</td>
        <td class="id">${row[propName]}</td>
        <td><button class="remove-row remove-${tableprefix}">Remove</button></td>
      `;
    tbody.appendChild(newRow);
  });
  const totalElement=document.getElementById(`${tableprefix}-total`);
  totalElement.innerText=`₹ ${total[tableprefix]}`;
  const totalSavingElement=document.getElementById(`saving-total`);
  totalSavingElement.innerText=`₹ ${total['income']-total['expense']}`;
}

function insertData() {
  insertIncomeExpenseData(data1[0],'expense');
  insertIncomeExpenseData(data1[1],'income');
}


function retreiveData(tableId) {
  const table = document.getElementById(tableId);
  if (table.rows.length === 0) {
    console.log('empty');
    return;
  }
  const prefix = tableId.split('-')[0];
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
          cellValue = input.value;
        }

      }
      cellValues.push(cellValue);
    }

    obj[`${prefix}_RowValues`].push(cellValues);
  }
}

function sendData(form, formData) {
  const finalData = obj[formData];
  const prefix = formData.split('_')[0];
  if (finalData.length === 0) {
    console.log('empty');
    return;
  }
  console.log(finalData);
  fetch(`http://localhost:8090/api/${prefix}`, {
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
      insertIncomeExpenseData(data,prefix);
    })
    .catch((error) => {
      if(error.message==='Unauthorized'){
      setTimeout(function () {
        window.location.href = '../login/login.html';
      }, 1000);}
      console.error('Error:', error);
    });


}

// Add Row Event
function addRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');

  const newRow = document.createElement('tr');

  if (tableId === 'budgetTable' || tableId === 'goalTable') {
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
  const cellValues = [];
  const regex1 = /₹ /;
  const regex2 = /^\d{2}-\d{2}-\d{2}$/;
  const delRow=button.closest('section').id;
  if (button.classList.contains(`remove-${delRow}`)) {
    for (let j = 0; j < row.cells.length - 1; j++) {
      const cellValue = row.cells[j].innerText;
      if (cellValue.match(regex1)) {
        cellValues.push(cellValue.split(regex1)[1]);
      }
      else if (cellValue.match(regex2)) {
        cellValues.push('20' + cellValue);
      }
      else {
        cellValues.push(cellValue);
      }
    }
    obj[`${delRow}_RowValues`].push(cellValues);
  }
  console.log(obj[`${delRow}_RowValues`]);
  row.remove();
}


// eventListeners

window.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:8090/api/information', {
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
      if(error.message==='Unauthorized'){
      setTimeout(function () {
        window.location.href = '../login/login.html';
      }, 1000);}
      console.error(error);
    });
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
      sendData(form, finalData);
    }
    else {
      if (!form.checkValidity()) {
        console.log('invalid');// Prevent default form submission
        return;
      }
      event.preventDefault();
      retreiveData(tableId);
      sendData(form, finalData);
    }

  }
  // else if(event.target.classList.contains('logout')){
  //   event.preventDefault();
  //   fetch('http://localhost:8090/api/logout', {
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
  //         window.location.href = "http://localhost:8090/login.html";
  //       })
  //       .catch(error => {
  //         // Handle any errors
  //         console.error(error);
  //       });
  // }
  else if (event.target.classList.contains('overlay-button')) {
    event.preventDefault();
    const section = event.target.closest('section');
    const divs=section.querySelectorAll('div');
    const secondDiv=divs[1];
    secondDiv.style.display = 'flex';
  }
  else if (event.target.classList.contains('overlay')) {

    if (event.target.style.display === 'flex') {
      event.target.style.display = 'none';
    }
  }
});

