// Pagination state
let txCurrentPage = 1;
const txPageLimit = 10;
let txHasMore = false;

// Load and display transactions (paginated)
async function loadTransactions() {
    const sortBy = document.getElementById('sort-by').value;
    const sortOrder = document.getElementById('sort-order').value;
    try {
        const response = await fetch(`/api/transactions?sortBy=${encodeURIComponent(sortBy)}&sortOrder=${encodeURIComponent(sortOrder)}&page=${txCurrentPage}&limit=${txPageLimit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + accessToken
            }
        });
        if (response.ok) {
            const { data, page, limit, hasMore } = await response.json();
            txCurrentPage = page || txCurrentPage;
            txHasMore = !!hasMore;
            displayTransactions(data || []);
            updatePaginationControls();
        } else {
            console.error('Error loading transactions');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Edit transaction functionality
function editTransaction(id, name, amount, detail) {
    document.getElementById('edit-transaction-id').value = id;
    document.getElementById('edit-transaction-name').value = name;
    document.getElementById('edit-transaction-amount').value = amount;
    document.getElementById('edit-transaction-detail').value = detail;
    document.getElementById('edit-transaction-modal').classList.remove('hidden');
}

// Delete transaction functionality
async function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                }
            });

            if (response.ok) {
                alert('Transaction deleted successfully!');
                loadTransactions();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            alert('Error deleting transaction: ' + error.message);
        }
    }
}

function displayTransactions(transactions) {
    const transactionsList = document.getElementById('transactions-list');
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="no-data">No transactions found.</p>';
        return;
    }

    const transactionsHTML = transactions.map(transaction => `
        <div class="transaction-item" data-id="${transaction.transaction_id}">
            <div class="transaction-info">
                <h4>${transaction.transaction_name}</h4>
                <p class="amount">$${transaction.transaction_amount}</p>
                <p class="detail">${transaction.transaction_detail || 'No details'}</p>
                <p class="date">${new Date(transaction.created_at).toLocaleDateString()}</p>
            </div>
            <div class="transaction-actions">
                <button class="btn btn-small btn-edit" onclick="editTransaction(${transaction.transaction_id}, '${transaction.transaction_name}', ${transaction.transaction_amount}, '${transaction.transaction_detail || ''}')">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteTransaction(${transaction.transaction_id})">Delete</button>
            </div>
        </div>
    `).join('');

    transactionsList.innerHTML = transactionsHTML;
}

export function transactionEvents(){
    // Transaction functionality
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const showTransactionsBtn = document.getElementById('show-transactions-btn');
    const addTransactionForm = document.getElementById('add-transaction');
    const showTransactions = document.getElementById('show-transactions');
    const cancelTransactionBtn = document.getElementById('cancel-transaction');
    const transactionForm = document.getElementById('transaction-form');

    addTransactionBtn.addEventListener('click', () => {
        addTransactionForm.classList.remove('hidden');
        showTransactions.classList.add('hidden');
    });

    showTransactionsBtn.addEventListener('click', () => {
        showTransactions.classList.remove('hidden');
        addTransactionForm.classList.add('hidden');
        txCurrentPage = 1;
        loadTransactions();
    });

    cancelTransactionBtn.addEventListener('click', () => {
        addTransactionForm.classList.add('hidden');
        transactionForm.reset();
    });

    // Form submissions
    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const transactionData = {
            name: document.getElementById('transaction-name').value,
            amount: parseFloat(document.getElementById('transaction-amount').value),
            detail: document.getElementById('transaction-detail').value,
        };

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(transactionData)
            });

            if (response.ok) {
                alert('Transaction added successfully!');
                transactionForm.reset();
                addTransactionForm.classList.add('hidden');
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            alert('Error adding transaction: ' + error.message);
        }
    });

    // Sorting functionality
    document.getElementById('apply-sort').addEventListener('click', () => {
        txCurrentPage = 1;
        loadTransactions();
    });

    // Pagination controls
    const pagination = document.getElementById('transactions-pagination');
    const prevBtn = document.getElementById('tx-prev-page');
    const nextBtn = document.getElementById('tx-next-page');
    if (pagination && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (txCurrentPage > 1) {
                txCurrentPage -= 1;
                loadTransactions();
            }
        });
        nextBtn.addEventListener('click', () => {
            if (txHasMore) {
                txCurrentPage += 1;
                loadTransactions();
            }
        });
    }

    // Modal close functionality
    document.getElementById('close-transaction-modal').addEventListener('click', () => {
        document.getElementById('edit-transaction-modal').classList.add('hidden');
    });

    document.getElementById('cancel-edit-transaction').addEventListener('click', () => {
        document.getElementById('edit-transaction-modal').classList.add('hidden');
    });

    // Edit form submissions
    document.getElementById('edit-transaction-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-transaction-id').value;
        const transactionData = {
            name: document.getElementById('edit-transaction-name').value,
            amount: parseFloat(document.getElementById('edit-transaction-amount').value),
            detail: document.getElementById('edit-transaction-detail').value
        };

        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(transactionData)
            });

            if (response.ok) {
                alert('Transaction updated successfully!');
                document.getElementById('edit-transaction-modal').classList.add('hidden');
                loadTransactions();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            alert('Error updating transaction: ' + error.message);
        }
    });
}

// Export functions to be used in home.js
export {editTransaction,deleteTransaction};

function updatePaginationControls() {
    const pagination = document.getElementById('transactions-pagination');
    const prevBtn = document.getElementById('tx-prev-page');
    const nextBtn = document.getElementById('tx-next-page');
    const indicator = document.getElementById('tx-page-indicator');
    if (!pagination || !prevBtn || !nextBtn || !indicator) return;
    pagination.classList.remove('hidden');
    indicator.textContent = `Page ${txCurrentPage}`;
    prevBtn.disabled = txCurrentPage <= 1;
    nextBtn.disabled = !txHasMore;
}