const API = 'https://to-do-w84r.onrender.com';

// --- Auth ---

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch(API + '/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    document.getElementById('auth-msg').textContent = data.message || data.error;
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch(API + '/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
        document.getElementById('auth-msg').textContent = data.error;
        return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    showTodos();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('todo-section').style.display = 'none';
}

function showTodos() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
    document.getElementById('welcome').textContent = 'Hi, ' + localStorage.getItem('username') + '!  ';
    updateList();
}

// --- Todos (same as before, just with token header added) ---

function authHeader() {
    return { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
}

async function deleteItem(id) {
    console.log("deleted");
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeader() });
    updateList();
}

async function editItem(id) {
    const newText = prompt("Enter new text");
    await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ todoText: newText })
    });
    updateList();
}

async function updateList() {
    let data = await fetch(API, { headers: authHeader() });
    let res = await data.json();
    console.log(res);

    document.getElementById("list").innerHTML = "";

    for (let i = 0; i < res.length; i++) {
        let newLi = document.createElement("li");
        newLi.innerHTML = `<div>
        ${res[i].todoText}
        <button id="deleteButton" onclick="deleteItem('${res[i]._id}')"><img class="icon" src="./img/delete.jpg"></button>
        <button id="editButton" onclick="editItem('${res[i]._id}')"><img class="icon" src="./img/edit.jpg"></button>
        </div>`;
        document.getElementById("list").appendChild(newLi);
    }
}

async function clicked() {
    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ todoText: document.getElementById("lable").value })
    });
    updateList();
}

// On page load — if already logged in, skip the login screen
if (localStorage.getItem('token')) {
    showTodos();
}
