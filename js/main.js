'use strict';

// Event listener for submit button press and a function for sending the input values to the endpoint
const plannerForm = document.querySelector('#planner-form');
plannerForm.addEventListener('submit', async function submit(event){
    event.preventDefault();
    const budgetValue = document.querySelector('#amount').value;
    const date = document.querySelector('#date').value;
    console.log(budgetValue);
    console.log(date);

    try {
        const response = await fetch(`http://localhost:3000/budget/${budgetValue}/${date}`);
        await update(event)
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


        let spentFloat = await parseFloat(jsonSpent);
        // Checking if the total amount spent or gained is more, equal or less than 0 to change the prefix
        if (spentFloat >= 0) {
            let spent = document.querySelector('#total-spent');
            spent.innerText = `+${jsonSpent}€ since ${dateJSON.start_date}`;
        } else {
            let spent = document.querySelector('#total-spent');
            spent.innerText = `${jsonSpent}€ since ${dateJSON.start_date}`;
    }
    } catch (error) {
        console.log(error);
    }
}