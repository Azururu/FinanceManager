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

    if (jsonData === "result: successful") {
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
    overlay.style.animationPlayState = 'paused';
    overlay.addEventListener('click', clickOut);
    overlay.removeEventListener('animationend', listener);
  });
});

function clickOut() {
  try {
    const overlay = document.querySelector('#overlay');
    overlay.style.animation = 'adjust-brightness 0.8s ease-out backwards';
    const creationWindow = document.querySelector('#account-creation');
    creationWindow.style.animation = 'pop-in 1s ease reverse';
    creationWindow.addEventListener('animationend', function hideForm() {
      creationWindow.style.display = 'none';
      creationWindow.removeEventListener('animationend', hideForm);
    });
  }catch (error) {
    console.log(error);
  }
}