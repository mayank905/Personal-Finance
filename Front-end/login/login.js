// add on click event to register button
document.getElementById("registration-form").addEventListener("submit", function(event) {
  event.preventDefault();
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  var data = {
      'Password': password,
      'Email': email
  };
  let data1=JSON.stringify(data);
//   fetch('http://localhost:8090/login', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: data1,
//   credentials: 'include' // Include cookies in the request
// })
//   .then(response => response.json())
//   .then(data => {
//     // Handle the response data
//     console.log(data);
//   })
//   .catch(error => {
//     // Handle any errors
//     console.error(error);
//   });


  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8090/login', true);
  xhr.withCredentials = true;
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data1);

  xhr.onreadystatechange = function() {
    console.log(xhr.cookie);
      if (xhr.readyState == 4 && xhr.status == 201) {
          var response = JSON.parse(xhr.responseText);
          console.log(response);
          console.log(document.cookie);
          document.getElementById('error').innerHTML = response.message;
          document.getElementById('error').style.display = 'block';
          // if (response.status == 'success') {
          //   setTimeout(function() {
          //     window.location.href = '/login/login.html';
          // },1000);}
        }
      else{
            var response = JSON.parse(xhr.responseText);
            document.getElementById('error').innerHTML = response.message;
            document.getElementById('error').style.display = 'block';
      }
    }
});




