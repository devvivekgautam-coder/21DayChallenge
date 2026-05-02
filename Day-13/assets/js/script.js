const data = [
    "JavaScript",
    "Java",
    "Python",
    "PHP",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "MongoDB",
    "Express",
    "Angular",
    "Laravel",
    "MySql",
    "Ruby"
];

let timer;

function debounceSearch(value) {
    clearTimeout(timer);

    timer = setTimeout(() => {
        performSearch(value);
    }, 500);
}

function performSearch(query) {
    const resultBox = document.getElementById("result");

    if (query === "") {
        resultBox.innerHTML = "";
        return;
    }

    const filtered = data.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    resultBox.innerHTML = filtered.length
        ? filtered.map(item => `<p>${item}</p>`).join("")
        : "No results found";
}

document.getElementById("search").addEventListener("input", (e) => {
    debounceSearch(e.target.value);
});