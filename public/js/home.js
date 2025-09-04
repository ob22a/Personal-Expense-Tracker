// Access Token from server-side rendering
import {generateAccessToken} from './auth.js';
const accessToken= await generateAccessToken();

import { allEvents } from './homeEl.js';
import {editTransaction,deleteTransaction} from './transaction.js';
import {editGoal,deleteGoal,showGoalLogs} from './goal.js';

document.addEventListener('DOMContentLoaded', allEvents());

window.accessToken = accessToken;
window.showGoalLogs = showGoalLogs;
window.editGoal = editGoal;
window.deleteGoal = deleteGoal;
window.editTransaction=editTransaction;
window.deleteTransaction=deleteTransaction;