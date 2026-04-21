const text = document.getElementById("text");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    text.innerText = "Hello Developer It's Night Mode";
}

function changeTheme() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        text.innerText = "Hello Developer It's Night Mode";
    } else {
        localStorage.setItem("theme", "light");
        text.innerText = `Hello Developer, It's Day Mode`;
    }
}