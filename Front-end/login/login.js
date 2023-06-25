// add on click event to register button
document.getElementById("registration-form").addEventListener("submit", function(event) {
  event.preventDefault();
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;

  var data = {
      'Password': password,
      'Email': email
  };
  let data1=JSON.stringify(data);
  fetch('https://65.2.85.58:8090/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: data1,
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
    document.getElementById('error').innerHTML = data.message;
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').style.color = 'green';
    if (data.status == 'success') {
      setTimeout(function() {
        window.location.href = '../profile/profile.html';},1000);}
  })
  .catch(error => {
    // Handle any errors
    document.getElementById('error').innerHTML = error;
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').style.color = 'red';
  });
});


//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', 'http://localhost:8090/login', true);
//   xhr.withCredentials = true;
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(data1);

//   xhr.onreadystatechange = function() {
//     console.log(xhr.cookie);
//       if (xhr.readyState == 4 && xhr.status == 201) {
//           var response = JSON.parse(xhr.responseText);
//           console.log(response);
//           console.log(document.cookie);
//           document.getElementById('error').innerHTML = response.message;
//           document.getElementById('error').style.display = 'block';
//           // if (response.status == 'success') {
//           //   setTimeout(function() {
//           //     window.location.href = '/login/login.html';
//           // },1000);}
//         }
//       else{
//             var response = JSON.parse(xhr.responseText);
//             document.getElementById('error').innerHTML = response.message;
//             document.getElementById('error').style.display = 'block';
//       }
//     }
// });




