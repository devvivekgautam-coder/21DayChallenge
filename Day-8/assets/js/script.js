let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.className = "note";

        div.innerHTML = `
            <button class="delete" onclick="deleteNote(${index})">X</button>
            <p>${note}</p>
        `;

        container.appendChild(div);
    });
}

function addNote() {
    const input = document.getElementById("noteInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Write something!");
        return;
    }

    notes.push(text);
    input.value = "";

    saveNotes();
    renderNotes();
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

renderNotes();