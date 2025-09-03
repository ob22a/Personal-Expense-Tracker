import { errMsg } from "./utils.js";

export function allEvents(){
        const signupForm = document.getElementById('signup-form');
        const loginForm = document.getElementById('login-form');        

        if(!signupForm) console.log("No signup form. You are currently on login page");
        if(!loginForm) console.log("No login form. You are currently on signup page");

        signupForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const pwd = document.getElementById('password').value.trim();
            const confirmPwd = document.getElementById('confirm-password').value.trim();
            const name = document.getElementById('name').value.trim();

            if(!email || !pwd || !confirmPwd || !name){
                errMsg("Fill out all the mandatory fields", "red");
                return;
            }

            if(pwd !== confirmPwd){
                errMsg("The passwords should match", "red");
                return;
            }

            try {
                const res = await fetch('/api/users/signup', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email,
                        password: pwd,
                        name
                    })
                });

                const data = await res.json();

                if(!res.ok){
                    errMsg(data.message, "red");
                    return;
                }
                errMsg("Successful Signup", "green");
                setTimeout(() => {
                    window.location.href = '/home';
                }, 1500);
            } catch (error) {
                errMsg("Network error occurred", "red");
            }
        });

        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if(!email || !password){
                errMsg("Enter both email and password", "red");
                return;
            }

            try {
                const res = await fetch('/api/users/login', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await res.json();
                
                if(!res.ok){
                    errMsg(data.message, "red");
                    return;
                }

                errMsg("Successful Login", "green");
                setTimeout(() => {
                    window.location.href = '/home';
                }, 1500);
            } catch (error) {
                errMsg("Network error occurred", "red");
            }
        });
}