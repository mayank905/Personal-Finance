// add on click event to register button
document.getElementById("registration-form").addEventListener("submit", function(event) {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirm-password').value;
  var email = document.getElementById('email').value;
  if (password != confirmPassword) {
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').innerHTML = 'Passwords do not match';
      document.getElementById('error').style.color = 'red';
      return;
  }

  var data = {
      Username: username,
      Password: password,
      Email: email
  };
  let url = 'https://65.2.85.58:8090/register';
  let data1=JSON.stringify(data);
  fetch(url, {
      method: 'POST',
      body: data1,
      headers: {
          'Content-Type': 'application/json'
      }
  }).then(response => {
    if (!response.ok) {
      return response.json().then(errorData => {
        throw new Error(errorData.message);
      });
    }
    return response.json();  
  })
      .then(response => {
        console.log(response);
          document.getElementById('error').innerHTML = response.message;
          document.getElementById('error').style.display = 'block';
          document.getElementById('error').style.color = 'green';
          if (response.status == 'success') {
            setTimeout(function() {
              window.location.href = '../login/login.html';},1000);}
      })
      .catch(error => {
          console.error('Error:', error);
          document.getElementById('error').innerHTML = error.message;
          document.getElementById('error').style.display = 'block';
          document.getElementById('error').style.color = 'red';
      });
});
//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', 'http://localhost:8090/register', true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(JSON.stringify(data));

//   xhr.onreadystatechange = function() {
//     console.log(xhr);
//       if (xhr.readyState == 4 && xhr.status == 201) {
//           var response = JSON.parse(xhr.responseText);
//           document.getElementById('error').innerHTML = response.message;
//           document.getElementById('error').style.display = 'block';
//           if (response.status == 'success') {
//             setTimeout(function() {
//               window.location.href = '../login/login.html';
//           },1000);}
//         }
//       else{
//             var response = JSON.parse(xhr.responseText);
//             document.getElementById('error').innerHTML = response.message;
//             document.getElementById('error').style.display = 'block';
//       }
//     }
// });




