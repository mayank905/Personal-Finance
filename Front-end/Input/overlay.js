document.getElementById('openOverlayButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
  });
  
  document.getElementById('overlay').addEventListener('click', function(event) {
    if (event.target === this) {
      this.style.display = 'none';
    }
  });
  
// Add Row Event
function addRow(tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  
  const newRow = document.createElement('tr');
  
  if (tableId === 'budgetTable' || tableId === 'goalTable') {
    newRow.innerHTML = `
      <td><input type="range" min="0" max="100" class="priority" required></td>
      <td><input type="text" class="category" required></td>
      <td><input type="number" step="0.01" class="amount" required></td>
      ${tableId === 'goalTable' ? '<td><input type="number" step="0.01" class="current-amount" required></td>' : ''}
      <td><input type="date" class="date" required></td>
      <td><button class="remove-row">Remove</button></td>
    `;
  } else {
    newRow.innerHTML = `
      <td><input type="number" step="0.01" class="amount" required></td>
      <td><input type="text" class="category" required></td>
      <td><input type="text" class="description"></td>
      <td><input type="date" class="date" required></td>
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
    const tableId = event.target.parentNode.querySelector('table').id;
    addRow(tableId);
  }
});

