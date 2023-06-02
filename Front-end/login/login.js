// Assuming you have a login form with id "login-form" and input fields with ids "username" and "password"

// Function to handle form submission
function submitForm() {
    // Get the form input values
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    // Create an object with the login data
    var loginData = {
      username: username,
      password: password
    };
  
    // Convert the login data to JSON
    var jsonData = JSON.stringify(loginData);
  
    // Create an XMLHttpRequest object
    var xhr = new XMLHttpRequest();
  
    // Set the HTTP method and URL
    xhr.open('POST', '/login', true); // Replace '/login' with your backend login endpoint
  
    // Set the request headers
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    // Handle the response
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          // Handle the successful response from the server
          console.log(response);
        } else {
          // Handle errors or unsuccessful response
          console.error('Login failed. Status:', xhr.status);
        }
      }
    };
  
    // Send the request with the login data
    xhr.send(jsonData);
  }
  
  // Attach the submitForm function to the form's submit event
  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    submitForm();
  });
  