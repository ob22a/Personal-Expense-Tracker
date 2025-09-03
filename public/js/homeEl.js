import { goalEvents } from "./goal.js";
import { transactionEvents } from "./transaction.js";
import { reportsEvents } from './reports.js';

export async function allEvents(accessToken){
    // Navigation functionality
    const transactionBtn = document.getElementById('transaction-btn');
    const goalsBtn = document.getElementById('goals-btn');
    const transactionsSection = document.getElementById('transactions-section');
    const goalsSection = document.getElementById('goals-section');

    transactionBtn.addEventListener('click', () => {
        transactionsSection.classList.add('active');
        goalsSection.classList.remove('active');
        transactionBtn.classList.add('active');
        goalsBtn.classList.remove('active');
    });

    goalsBtn.addEventListener('click', () => {
        goalsSection.classList.add('active');
        transactionsSection.classList.remove('active');
        goalsBtn.classList.add('active');
        transactionBtn.classList.remove('active');
    });

    goalEvents(accessToken);
    transactionEvents(accessToken);
    reportsEvents(accessToken);
    
    // Toggle monthly summary visibility when button is clicked
    const showMonthlySummaryBtn = document.getElementById('show-monthly-summary-btn');
    const monthlySummaryContainer = document.getElementById('monthly-summary');
    if (showMonthlySummaryBtn && monthlySummaryContainer) {
        showMonthlySummaryBtn.addEventListener('click', () => {
            // Reveal the container in the Goals section when fetching
            monthlySummaryContainer.classList.remove('hidden');
        });
    }
}