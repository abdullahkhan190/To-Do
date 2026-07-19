async function deleteItem(id) {
    console.log("deleted");
    await fetch(`https://to-do-w84r.onrender.com/${id}`,{
        method: 'DELETE'
    });
    updateList();
}
async function editItem(id) {
    const newText = prompt("Enter new text");
    await fetch(`https://to-do-w84r.onrender.com/${id}`,{
        method: 'PUT',
        body: JSON.stringify({todoText : newText})
    });
    updateList();
}
async function updateList() {
    let data = await fetch('https://to-do-w84r.onrender.com');
    let res = await data.json();
    console.log(res);

    document.getElementById("list").innerHTML = "";

    for (let i = 0; i < res.length; i++) {
        let newLi = document.createElement("li");
        newLi.innerHTML = `<div>
        ${res[i].todoText}
        <button id = "deleteButton" onclick = "deleteItem('${res[i]._id}')"><img class = "icon" src = "./img/delete.jpg"></button>
        <button id = "editButton" onclick = "editItem('${res[i]._id}')"><img class = "icon" src = "./img/edit.jpg"></button>
        </div>` ;
        document.getElementById("list").appendChild(newLi);
    }
}

async function clicked() {
    let li = document.createElement("li");
    await fetch('https://to-do-w84r.onrender.com',{
        method: 'POST',
        body: JSON.stringify({todoText : document.getElementById("lable").value})
    });

    updateList();

}

updateList();