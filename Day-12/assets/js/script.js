const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function generatePassword() {
    const length = lengthSlider.value;
    const upper = document.getElementById("upper").checked;
    const lower = document.getElementById("lower").checked;
    const number = document.getElementById("number").checked;
    const symbol = document.getElementById("symbol").checked;

    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+";

    let allChars = "";

    if (upper) allChars += upperChars;
    if (lower) allChars += lowerChars;
    if (number) allChars += numberChars;
    if (symbol) allChars += symbolChars;

    if (allChars === "") {
        alert("Select at least one option!");
        return;
    }

    let password = "";

    for (let i = 0; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    document.getElementById("password").value = password;

    checkStrength(password);
}

function checkStrength(password) {
    const bar = document.getElementById("strengthBar");

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    bar.className = "strength-bar";

    if (strength <= 2) {
        bar.classList.add("weak");
    } else if (strength === 3) {
        bar.classList.add("medium");
    } else {
        bar.classList.add("strong");
    }
}

function copyPassword() {
    const password = document.getElementById("password").value;

    if (!password) {
        alert("No password!");
        return;
    }

    navigator.clipboard.writeText(password);

    const btn = document.querySelector(".output button");
    btn.innerText = "Copied!";

    setTimeout(() => {
        btn.innerText = "Copy";
    }, 1500);
}