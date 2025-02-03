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


const createButton = document.querySelector('#create-button');
createButton.addEventListener('click', function create(event){
  event.preventDefault();
  const creationWindow = document.querySelector('#account-creation');
  creationWindow.style.display = 'flex';
  if (creationWindow.style.display === 'flex') {
    creationWindow.style.animation = 'pop-out 1s ease forwards';
  }
  const overlay = document.querySelector('#overlay');
  overlay.style.display = 'block';
  overlay.style.animation = 'adjust-brightness 0.8s ease-out forwards';
  overlay.addEventListener('animationend', function listener() {
    overlay.addEventListener('click', clickOut);
  });
});

function clickOut() {
  try {
    const overlay = document.querySelector('#overlay');
    overlay.style.animationDirection = 'reverse';
    overlay.style.display = 'none';
    const creationWindow = document.querySelector('#account-creation');
    creationWindow.style.display = 'none';
  } catch (error) {
    console.log(error);
  }
}