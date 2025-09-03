export function reportsEvents(accessToken) {
	const showMonthlySummaryBtn = document.getElementById('show-monthly-summary-btn');
	const monthlySummaryContainer = document.getElementById('monthly-summary');

	if (!showMonthlySummaryBtn || !monthlySummaryContainer) return;

	showMonthlySummaryBtn.addEventListener('click', async () => {
		showMonthlySummaryBtn.disabled = true;
		showMonthlySummaryBtn.textContent = 'Loading…';
		try {
			const resp = await fetch(`/api/reports/`,{
				headers: { 
					'Content-Type': 'application/json',
					'authorization': `Bearer ${accessToken}`
				},
				method: 'GET'
			});
			if (!resp.ok){
				console.error('Failed to fetch monthly summary', resp.message);
				throw new Error('Failed to fetch monthly summary');
			}
			const { data } = await resp.json();
			monthlySummaryContainer.innerHTML = renderMonthlySummary(data);
		} catch (e) {
			monthlySummaryContainer.innerHTML = `<div class="error">Could not load monthly summary.</div>`;
		} finally {
			showMonthlySummaryBtn.disabled = false;
			showMonthlySummaryBtn.textContent = 'Monthly Summary';
		}
	});
}

function renderMonthlySummary(rows) {
	if (!rows || rows.length === 0) {
		return `<div class="empty">No data available.</div>`;
	}
	const items = rows
		.sort((a,b)=> (a.year - b.year) || (a.month - b.month))
		.map(r => {
			const ym = `${String(r.year)}-${String(r.month).padStart(2,'0')}`;
			const total = Number(r.total_spent).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
			return `<div class="summary-row"><span class="ym">${ym}</span><span class="amount">${total}</span></div>`;
		})
		.join('');
	return `<div class="summary-list">${items}</div>`;
}


