'use strict';

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async function login(event){
  event.preventDefault();
  const usernameValue = document.querySelector('#username').value;
  const passwordValue = document.querySelector('#passwd').value;
  const strUser = usernameValue.toString();
  const strPsw = passwordValue.toString();
  console.log(usernameValue)
  console.log(passwordValue)
  try {
    const response = await fetch(`http://localhost:3000/login/${usernameValue}/${passwordValue}`);
    const jsonData = await response.json();
    console.log(jsonData);

    if (response === "valid") {
      window.location.replace('/html/page.html')
    }
  } catch (error) {
      console.log(error);
  }
});