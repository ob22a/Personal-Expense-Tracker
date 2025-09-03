function errMsg(msg, color){
    const msgEl = document.getElementById('error-msg');
    msgEl.textContent = msg;
    msgEl.style.color = color;
    msgEl.style.display = 'block';
}

export { errMsg };