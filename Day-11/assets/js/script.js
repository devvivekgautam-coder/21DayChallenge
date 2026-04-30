const quizData = [
    {
        question: "What is HTML?",
        options: ["Language", "Markup Language", "DB", "OS"],
        answer: "Markup Language"
    },
    {
        question: "CSS used for?",
        options: ["Logic", "Styling", "DB", "API"],
        answer: "Styling"
    },
    {
        question: "JS stands for?",
        options: ["JavaSource", "JavaScript", "JSON", "None"],
        answer: "JavaScript"
    },
    {
        question: "Which is not JS framework?",
        options: ["React", "Angular", "Laravel", "Vue"],
        answer: "Laravel"
    },
    {
        question: "Which tag for link?",
        options: ["<a>", "<p>", "<h1>", "<div>"],
        answer: "<a>"
    },
    {
        question: "Which is backend?",
        options: ["HTML", "CSS", "Node.js", "Bootstrap"],
        answer: "Node.js"
    },
    {
        question: "Which is DB?",
        options: ["MySQL", "HTML", "CSS", "JS"],
        answer: "MySQL"
    },
    {
        question: "Which is CSS framework?",
        options: ["React", "Bootstrap", "Node", "Mongo"],
        answer: "Bootstrap"
    },
    {
        question: "JS can run in?",
        options: ["Browser", "Server", "Both", "None"],
        answer: "Both"
    },
    {
        question: "Which is not language?",
        options: ["Python", "HTML", "Java", "C++"],
        answer: "HTML"
    }
];

let current = 0;
let score = 0;
let timeLeft = 10;
let timer;

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById("time").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").innerText = timeLeft;

        if (timeLeft === 0) nextQuestion();
    }, 1000);

    const q = quizData[current];
    document.getElementById("question").innerText = q.question;
    document.getElementById("qNum").innerText = current + 1;

    document.getElementById("progressBar").style.width = ((current + 1) / quizData.length) * 100 + "%";

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt;

        btn.onclick = () => selectAnswer(btn, opt);
        optionsDiv.appendChild(btn);
    });
}

function selectAnswer(button, selected) {
    const correct = quizData[current].answer;

    const buttons = document.querySelectorAll(".options button");

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === correct) btn.classList.add("correct");
    });

    if (selected === correct) {
        score++;
    } else {
        button.classList.add("wrong");
    }
}

function nextQuestion() {
    current++;

    if (current < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    clearInterval(timer);

    document.querySelector(".container").innerHTML = `
    <h2>Quiz Completed 🎉</h2>
    <p style="margin:10px 0;">Score: ${score} / ${quizData.length}</p>
    <button onclick="location.reload()" class="next-btn">Restart</button>
  `;
}

loadQuestion();