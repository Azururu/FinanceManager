'use strict';

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async function login(event){
  event.preventDefault();
  const usernameValue = document.querySelector('#username').value;
  const passwordValue = document.querySelector('#passwd').value;
  const strUser = usernameValue.toString();
  const strPsw = passwordValue.toString();
  try {
    const response = await fetch(`http://localhost:3000/login/${strUser}/${strPsw}`);
    const jsonData = await response.json();
    console.log(jsonData);

    if (jsonData === "result: successful") {
      window.location.replace('/html/page.html')
    } else {
      alert("Invalid username or password.");
    }
  } catch (error) {
      console.log(error);
  }
});

const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', async function createAccount(event) {
  event.preventDefault();
  const usernameValue = document.querySelector('#create-username').value;
  const passwordValue = document.querySelector('#create-passwd').value;
  const confirmPasswordValue = document.querySelector('#create-passwd-confirm').value;
  const strUser = usernameValue.toString();
  const strPsw = passwordValue.toString();
  const strConfirmPsw = confirmPasswordValue.toString();
  try {
    const response = await fetch(`http://localhost:3000/register/${strUser}/${strPsw}/${strConfirmPsw}`);
    const jsonData = await response.json();

    if (jsonData === "result: successful") {
      window.location.replace('/html/page.html')
    } else {
      alert("Passwords do not match.");
    }
  } catch (error) {
    console.log(error);
  }
});

const createButton = document.querySelector('#create-button');
createButton.addEventListener('click', function create(event) {
  event.preventDefault();
  const creationWindow = document.querySelector('#account-creation');
  creationWindow.style.display = 'flex';
  if (creationWindow.style.display === 'flex') {
    creationWindow.style.animationDirection = 'forwards';
    creationWindow.style.animation = 'none';
    creationWindow.offsetHeight;
    creationWindow.style.animation = 'pop-out 1s ease forwards';
  }
  const overlay = document.querySelector('#overlay');
  overlay.style.display = 'block';
  if (overlay.style.display === 'block') {
    overlay.style.animation = 'none';
    overlay.offsetHeight;
    overlay.style.animation = 'adjust-brightness 0.8s ease-out forwards';
    overlay.addEventListener('animationend', function listener() {
      overlay.addEventListener('click', clickOut);
  });
  }
});

function clickOut() {
  try {
    const creationWindow = document.querySelector('#account-creation');
    creationWindow.style.animation = 'none';
    creationWindow.offsetHeight;
    creationWindow.style.animation = 'pop-out 0.3s ease-out reverse forwards';

    const overlay = document.querySelector('#overlay');
    overlay.style.animation = 'none';
    overlay.offsetHeight;
    overlay.style.animation = 'adjust-brightness 0.3s ease-out reverse forwards';

    creationWindow.addEventListener('animationend', function hideForm() {
      creationWindow.style.display = 'none';
      overlay.style.display = 'none';
      overlay.removeEventListener('click', clickOut);
      if (creationWindow.style.display === 'none') {
        creationWindow.removeEventListener('animationend', hideForm);
      }
    });
  } catch (error) {
      console.log(error);
  }
}