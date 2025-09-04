// Load and display goals
async function loadGoals() {
    try {
        const response = await fetch('/api/goals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + accessToken
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayGoals(data.goals);
        } else {
            console.error('Error loading goals');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayGoals(goals) {
    const goalsList = document.getElementById('goals-list');
    
    if (goals.length === 0) {
        goalsList.innerHTML = '<p class="no-data">No goals found.</p>';
        return;
    }
    //console.log(goals);
    const goalsHTML = goals.map(goal => `
        <div class="goal-item" data-id="${goal.goal_id}">
            <div class="goal-info">
                <h4>${goal.goal_name}</h4>
                <p class="amount">$${goal.total_amount}</p>
                <p class="frequency">${goal.saving_freq} savings</p>
                <p class="deadline">Deadline: ${new Date(goal.goal_deadline).toLocaleDateString()}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goal.progress_percent || 0}%"></div>
                </div>
                <p class="progress-text">${goal.progress_percent || 0}% Complete</p>
            </div>
            <div class="goal-actions">
                <button class="btn btn-small btn-outline" onclick="showGoalLogs(${goal.goal_id})">Show Spendings</button>
                <button class="btn btn-small btn-edit" onclick="editGoal(${goal.goal_id}, '${goal.goal_name}', ${goal.total_amount}, '${goal.saving_freq}', '${goal.goal_deadline}')">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteGoal(${goal.goal_id})">Delete</button>
            </div>
        </div>
    `).join('');

    goalsList.innerHTML = goalsHTML;
}

// Edit goal functionality
function editGoal(id, name, amount, freq, deadline) {
    document.getElementById('edit-goal-id').value = id;
    document.getElementById('edit-goal-name').value = name;
    document.getElementById('edit-goal-amount').value = amount;
    document.getElementById('edit-goal-freq').value = freq;
    document.getElementById('edit-goal-deadline').value = deadline;
    document.getElementById('edit-goal-modal').classList.remove('hidden');
}

// Delete goal functionality
async function deleteGoal(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                }
            });

            if (response.ok) {
                alert('Goal deleted successfully!');
                loadGoals();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            alert('Error deleting goal: ' + error.message);
        }
    }
}

// Show goal logs functionality
export async function showGoalLogs(goalId) {
    try {
        const response = await fetch(`/api/goals/goalLog/${goalId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + accessToken
            },
        });

        if (response.ok) {
            const { data: logs } = await response.json();
            displayGoalLogs(goalId, logs);
            document.getElementById('goal-logs-modal').classList.remove('hidden');
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        alert('Error loading goal logs: ' + error.message);
    }
}

function displayGoalLogs(goalId, logs) {
    const logsList = document.getElementById('goal-logs-list');
    document.getElementById('saving-goal-id').value = goalId;
    
    if (logs.length === 0) {
        logsList.innerHTML = '<p class="no-data">No saving logs found for this goal.</p>';
        return;
    }

    const logsHTML = logs.map(log => `
        <div class="goal-log-item">
            <div class="log-info">
                <span class="log-amount">$${log.amount_saved}</span>
                <span class="log-date">${new Date(log.saved_at).toLocaleDateString()}</span>
                ${log.note ? `<span class="log-note">${log.note}</span>` : ''}
            </div>
        </div>
    `).join('');

    logsList.innerHTML = logsHTML;
}

export function goalEvents(){
    // Goal functionality
    const addGoalBtn = document.getElementById('add-goal-btn');
    const showGoalsBtn = document.getElementById('show-goals-btn');
    const addGoalForm = document.getElementById('add-goal');
    const showGoals = document.getElementById('show-goals');
    const cancelGoalBtn = document.getElementById('cancel-goal');
    const goalForm = document.getElementById('goal-form');

    addGoalBtn.addEventListener('click', () => {
        addGoalForm.classList.remove('hidden');
        showGoals.classList.add('hidden');
    });

    showGoalsBtn.addEventListener('click', () => {
        showGoals.classList.remove('hidden');
        addGoalForm.classList.add('hidden');
        loadGoals();
    });

    cancelGoalBtn.addEventListener('click', () => {
        addGoalForm.classList.add('hidden');
        goalForm.reset();
    });

    goalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const goalData = {
            name: document.getElementById('goal-name').value,
            totalAmount: parseFloat(document.getElementById('goal-amount').value),
            freq: document.getElementById('goal-freq').value.toLowerCase(),
            goalDeadline: document.getElementById('goal-deadline').value,
        };

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(goalData)
            });

            if (response.ok) {
                alert('Goal created successfully!');
                goalForm.reset();
                addGoalForm.classList.add('hidden');
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            alert('Error creating goal: ' + error.message);
        }
    });
    document.getElementById('close-goal-modal').addEventListener('click', () => {
        document.getElementById('edit-goal-modal').classList.add('hidden');
    });

    

    document.getElementById('cancel-edit-goal').addEventListener('click', () => {
        document.getElementById('edit-goal-modal').classList.add('hidden');
    });

    // Goal logs modal functionality
    document.getElementById('close-goal-logs-modal').addEventListener('click', () => {
        document.getElementById('goal-logs-modal').classList.add('hidden');
    });

    document.getElementById('cancel-saving').addEventListener('click', () => {
        document.getElementById('goal-logs-modal').classList.add('hidden');
    });

    document.getElementById('add-saving-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const goalId = document.getElementById('saving-goal-id').value;
        const amount = parseFloat(document.getElementById('saving-amount').value);
        const note = document.getElementById('saving-note').value;

        try {
            const response = await fetch(`/api/goals/goalLog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({ amount, note,goalId })
            });

            if (response.ok) {
                alert('Saving logged successfully!');
                document.getElementById('add-saving-form').reset();
                // Refresh the goal logs
                showGoalLogs(goalId);
                // Refresh the goals list to show updated progress
                loadGoals();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            alert('Error logging saving: ' + error.message);
        }
    });


    document.getElementById('edit-goal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-goal-id').value;
        const goalData = {
            name: document.getElementById('edit-goal-name').value,
            totalAmount: parseFloat(document.getElementById('edit-goal-amount').value),
            freq: document.getElementById('edit-goal-freq').value,
            goalDeadline: document.getElementById('edit-goal-deadline').value
        };

        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(goalData)
            });

            if (response.ok) {
                alert('Goal updated successfully!');
                document.getElementById('edit-goal-modal').classList.add('hidden');
                loadGoals();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            alert('Error updating goal: ' + error.message);
        }
    });
}

// Make showGoalLogs globally accessible for onclick calls
export { editGoal, deleteGoal, loadGoals };