async function updateList() {
    let data = await fetch('https://to-do-w84r.onrender.com/');
    let res = await data.json();
    console.log(res);

    document.getElementById("list").innerHTML = "";

    for (let i = 0; i < res.length; i++) {
        let newLi = document.createElement("li");
        newLi.innerText = res[i];
        document.getElementById("list").appendChild(newLi);
    }
}




async function clicked() {
    let li = document.createElement("li");
    await fetch('https://to-do-w84r.onrender.com/',{
        method: 'POST',
        body: JSON.stringify(document.getElementById("lable").value)
    });

    updateList();

    // li.innerText = data;
    // document.getElementById("list").appendChild(li);
    // console.log(data);

}

updateList();