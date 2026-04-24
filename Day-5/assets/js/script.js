function switchTab(id, el) {
    document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function togglePass(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

function checkStrength() {
    const val = document.getElementById("password").value;
    const fill = document.getElementById("strengthFill");

    if (val.length < 6) {
        fill.style.width = "30%";
        fill.style.background = "#e74c3c";
    } else if (/[A-Z]/.test(val) && /[0-9]/.test(val)) {
        fill.style.width = "100%";
        fill.style.background = "#2ecc71";
    } else {
        fill.style.width = "60%";
        fill.style.background = "#f39c12";
    }
}

function login() {
    let valid = true;

    const email = document.getElementById("loginEmail");
    const pass = document.getElementById("loginPass");

    if (email.value.trim() === "") {
        document.getElementById("loginEmailError").innerText = "Email required";
        valid = false;
    } else {
        document.getElementById("loginEmailError").innerText = "";
    }

    if (pass.value.trim() === "") {
        document.getElementById("loginPassError").innerText = "Password required";
        valid = false;
    } else {
        document.getElementById("loginPassError").innerText = "";
    }

    if (valid) alert("Login Successful ✅");
}

function signup() {
    let valid = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const pass = document.getElementById("password");
    const confirm = document.getElementById("confirm");

    if (name.value.trim() === "") {
        document.getElementById("nameError").innerText = "Name required";
        valid = false;
    } else document.getElementById("nameError").innerText = "";

    if (email.value.trim() === "") {
        document.getElementById("emailError").innerText = "Email required";
        valid = false;
    } else document.getElementById("emailError").innerText = "";

    if (confirm.value !== pass.value || confirm.value === "") {
        document.getElementById("confirmError").innerText = "Passwords do not match";
        valid = false;
    } else document.getElementById("confirmError").innerText = "";

    if (valid) alert("Account Created 🎉");
}