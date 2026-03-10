const userId = localStorage.getItem("userId");

if (!userId) {
    alert("Please login first!");
    window.location.href = "home.html";
}

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
        themeIcon.className = "fa-solid fa-sun"; 
    } else {
        document.body.classList.remove("dark");
        themeIcon.className = "fa-regular fa-moon"; 
    }
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeIcon.className = "fa-solid fa-sun"; 
        localStorage.setItem("darkMode", "enabled");
    } else {
        themeIcon.className = "fa-regular fa-moon"; 
        localStorage.setItem("darkMode", "disabled");
    }
});

const API_URL = "http://localhost:5000/api/notes";

async function fetchNotes(){

    const userId = localStorage.getItem("userId");

    const res = await fetch(`http://localhost:5000/api/notes/${userId}`);

    const notes = await res.json();

    displayNotes(notes);
}

function displayNotes(notes) {

    const container = document.getElementById("notes-container");
    container.innerHTML = "";

    notes.forEach(note => {

        const el = document.createElement("div");
        el.classList.add("note");

        const created = new Date(note.createdAt).toLocaleString();
        const updated = new Date(note.updatedAt).toLocaleString();

        el.innerHTML = `
            <h3>${note.title}</h3>

            <span>
            Created: ${created}<br>
            ${created !== updated ? `Edited: ${updated}` : ""}
            </span>

            <p>${note.content}</p>

            <div class="note-actions">
                <button onclick="openEditModal('${note._id}','${note.title}','${note.content}')">
                    Edit
                </button>

                <button onclick="deleteNote('${note._id}')">
                    Delete
                </button>
            </div>
        `;

        container.appendChild(el);
    });
}

async function addNote() {

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const userId = localStorage.getItem("userId");

    if (!title || !content) {
        alert("Enter title and content");
        return;
    }

    await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            content,
            userId
        })
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    fetchNotes();

    document.getElementById("content").focus();
}

function openEditModal(id,title,content){
    document.getElementById("edit-id").value=id;
    document.getElementById("edit-title").value=title;
    document.getElementById("edit-content").value=content;
    document.getElementById("edit-modal").style.display="block";
}

function closeEditModal(){ document.getElementById("edit-modal").style.display="none"; }

async function updateNote(){
    const id=document.getElementById("edit-id").value;
    const title=document.getElementById("edit-title").value;
    const content=document.getElementById("edit-content").value;
    if(!title||!content) return alert("Cannot be empty");

    await fetch(`${API_URL}/${id}`,{method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title,content})});
    closeEditModal(); fetchNotes();
}

async function deleteNote(id) {

    const confirmDelete = confirm("Are you sure you want to delete this note?");

    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE"
    });

    fetchNotes();
}

function searchNotes(){
    const query=document.getElementById("search").value.toLowerCase();
    document.querySelectorAll(".note").forEach(note=>{
        const title=note.querySelector("h3").textContent.toLowerCase();
        const content=note.querySelector("p").textContent.toLowerCase();
        note.style.display = title.includes(query)||content.includes(query) ? "block" : "none";
    });
}

function logout() {
    localStorage.removeItem("userId");  
    localStorage.removeItem("darkMode"); 
    window.location.href = "index.html"; 
}

fetchNotes();

window.onload = fetchNotes;


