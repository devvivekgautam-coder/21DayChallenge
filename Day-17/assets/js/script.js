let isLogin = false;

function toggleForm() {
    isLogin = !isLogin;
    document.getElementById('title').innerText = isLogin ? 'Login' : 'Signup';
    document.getElementById('name').style.display = isLogin ? 'none' : 'block';
    document.getElementById('toggleText').innerText = isLogin
        ? "Don't have an account? Signup"
        : "Already have an account? Login";
    document.getElementById('msg').innerHTML = '';
}

function validate(name, email, password) {
    if (!email || !password || (!isLogin && !name)) {
        return "All fields required";
    }

    if (!email.includes('@')) return "Invalid email";
    if (password.length < 6) return "Min 6 char password";

    return null;
}

function handleSubmit() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const msg = document.getElementById('msg');

    const error = validate(name, email, password);
    if (error) {
        msg.innerHTML = `<span class='error'>${error}</span>`;
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (isLogin) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            msg.innerHTML = `<span class='success'>Welcome back ${user.name} 🚀</span>`;
        } else {
            msg.innerHTML = `<span class='error'>Invalid credentials</span>`;
        }
    } else {
        if (users.find(u => u.email === email)) {
            msg.innerHTML = `<span class='error'>User already exists</span>`;
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        msg.innerHTML = `<span class='success'>Account created 🎉</span>`;
    }
}