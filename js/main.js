'use strict';

const budgetForm = document.querySelector('#budget-form');
budgetForm.addEventListener('submit', async function createBudget(event){
    event.preventDefault()
    const budgetValue = document.querySelector('#budget-amount').value;
    const startDate = document.querySelector('#start-date').value;
    try {
        const response = await fetch(`http://localhost:3000/budget/${budgetValue}/${startDate}`);
        await update()
    } catch (error) {
        console.log(error);
    }
})

// Event listener for submit button press and a function for sending the input values to the endpoint
const plannerForm = document.querySelector('#planner-form');
plannerForm.addEventListener('submit', async function updateBudget(event){
    event.preventDefault();
    const updateValue = document.querySelector('#amount').value;
    const date = document.querySelector('#date').value;
    try {
        const budgetCheck = await fetch(`http://localhost:3000/history_check`);
        const checkJSON = await budgetCheck.json();
        console.log(checkJSON);
        if (checkJSON.result === "valid") {
            const response = await fetch(`http://localhost:3000/update/${updateValue}/${date}`);
            await update()
        } else {
            alert("No budget set.");
        }
    } catch (error) {
      console.log(error);
    }
});

// asynchronous function for updating current balance and total amount spent to the website
async function update(){
    try {
        const balanceResponse = await fetch(`http://localhost:3000/balance`);
        const jsonBalance = await balanceResponse.json();
        let currentBalance = document.querySelector('#balance');
        currentBalance.innerText = `${jsonBalance}€`;
        // fetching total amount spent and budget start date
        const spentResponse = await fetch(`http://localhost:3000/spent`);
        const dateResponse = await fetch(`http://localhost:3000/start_date`);
        const jsonSpent = await spentResponse.json();
        const dateJSON = await dateResponse.json();
        // Checking if the total amount spent or gained is more, equal or less than 0 to change the prefix
        if (jsonSpent >= 0) {
            const spent = document.querySelector('#total-spent');
            spent.innerText = `+${jsonSpent}€ since ${dateJSON.start_date}`;
        } else {
            const spent = document.querySelector('#total-spent');
            spent.innerText = `${jsonSpent}€ since ${dateJSON.start_date}`;
    }
    } catch (error) {
        console.log(error);
    }
}
const plannerDiv = document.getElementById('planner-div');
const updateDiv = document.getElementById('update-div');
const balanceDiv = document.getElementById('balance-div');

dragElement(plannerDiv);
dragElement(updateDiv);
dragElement(balanceDiv);


function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    elmnt.ontouchstart = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.tagName === 'INPUT') {
            return;
        }
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let newTop = elmnt.offsetTop - pos2;
        let newLeft = elmnt.offsetLeft - pos1;

        const container = document.querySelector('.desktop-container');
        const containerRect = container.getBoundingClientRect();
        const elmntRect = elmnt.getBoundingClientRect();

        if (newTop < containerRect.top) {
            newTop = containerRect.top;
        } else if (newTop + elmntRect.height > containerRect.bottom) {
            newTop = containerRect.bottom - elmntRect.height;
        }

        if (newLeft < containerRect.left) {
            newLeft = containerRect.left;
        } else if (newLeft + elmntRect.width > containerRect.right) {
            newLeft = containerRect.right - elmntRect.width;
        }

        requestAnimationFrame(() => {
            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
            });
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }


}