function sendData(form,tableId) {
  const table = document.getElementById(tableId);
  const rowValues = [];

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
        cellValue = input.value;
      }
      cellValues.push(cellValue);
    }

    rowValues.push(cellValues);
  }
  console.log(rowValues);
  fetch('http://localhost:8090/api/income', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      income: rowValues
    }),
    credentials: 'include' // Include cookies in the request
  })
    .then(response =>
      {console.log(response);
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message);
          });
        }
        return response.json();
      })
    .then(data => {
      form.reset();
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });


}

// Add Row Event
function addRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');

  const newRow = document.createElement('tr');

  if (tableId === 'budgetTable' || tableId === 'goalTable') {
    newRow.innerHTML = `
        <td><input type="range" min="0" max="100" value="1" class="priority" required></td>
        <td><input type="text" class="category" required></td>
        <td><input type="number" step="0.01" class="amount" required></td>
        ${tableId === 'goalTable' ? '<td><input type="number" step="0.01" class="current-amount" required></td><td><input type="date" class="date" required></td>' : ''}
        
        <td><input type="number" class="id"></td>
        <td><button class="remove-row">Remove</button></td>
        
      `;
  } else {
    newRow.innerHTML = `
        <td><input type="number" step="0.01" class="amount" required></td>
        <td><input type="text" class="category" required></td>
        <td><input type="text" class="description"></td>
        <td><input type="date" class="date" required></td>
        <td><input type="number" class="id"></td>
        <td><button class="remove-row">Remove</button></td>
        
      `;
  }

  tbody.appendChild(newRow);
}

// Remove Row Event
function removeRow(button) {
  const row = button.closest('tr');
  row.remove();
}

// Add Row Button Click Event
// const addRowButtons = document.getElementsByClassName('add-row');
// for (const button of addRowButtons) {
//   button.addEventListener('click', function () {
//     const tableId = this.parentNode.querySelector('table').id;
//     addRow(tableId);
//   });
// }

// Remove Row Button Click Event
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-row')) {
    removeRow(event.target);
  }
  else if (event.target.classList.contains('add-row')) {
    event.preventDefault();
    const tableId = event.target.parentNode.querySelector('table').id;
    addRow(tableId);
  }
  else if (event.target.classList.contains('submit')) {
    const form = event.target.closest('form');
    if (form.checkValidity()) {
      event.preventDefault(); // Prevent default form submission
    }
    const tableId = event.target.parentNode.querySelector('table').id;
    sendData(form,tableId);
  }
});



// custom validation

// A

// const input1 = document.getElementsByClassName('category')[0];
// input1.addEventListener('input', function() {
//   if (input1.value.length < 5) {
//     input1.setCustomValidity('Input must be at least 5 characters long.');
//   } else {
//     input1.setCustomValidity('');
//   }
// });

// B


// const form = document.getElementById('expense');

// form.addEventListener('submit', function(event) {
//   if (form.checkValidity()) {
//     console.log('Form is valid - will send to server');
//     event.preventDefault(); // Prevent default form submission
//   }
// });

// form.addEventListener('input', function(event) {
//   const input = event.target;
//   if (!input.checkValidity()) {
//     showErrorMessage(input);
//   } else {
//     hideErrorMessage(input);
//   }
// });

// function showErrorMessage(input) {
//   const errorElement = input.nextElementSibling;
//   if (errorElement && errorElement.classList.contains('error-message')) {
//     errorElement.textContent = input.validationMessage;
//     errorElement.style.display = 'block';
//   }
// }

// function hideErrorMessage(input) {
//   const errorElement = input.nextElementSibling;
//   if (errorElement && errorElement.classList.contains('error-message')) {
//     errorElement.style.display = 'none';
//   }
// }
