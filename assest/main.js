const tableTodo = document.querySelector("#tableTodo");
const formTodo = document.querySelector("#formTodo");
const titulo = document.getElementById("titulo");

const BASEURL = "http://localhost:3000/posts";

let todoEditing = null;

function printTask(posts) {
    let html = "";

    posts.forEach(({ id, desc, title }) => {
        html += `
            <tr class="table-body">
                    <th scope="row">${id}</th>
                    <td>${title}</td>
                    <td>${desc}</td>
                    <td>
                        <button type="button" class="btn-danger" id="${id}">X</button>
                        <button type="button" class="btn-warning" id="${id}">E</button>
                    </td>
                </tr>
        `
        tableTodo.innerHTML = html;
    });
}

async function getTodo(id) {
    try {
        const data = await fetch(`${BASEURL}/${id}`);
        todoEditing = await data.json();
    } catch (error) {
        console.log(error);
    }
}

async function getTodos() {
    try {
        const data = await fetch(BASEURL);
        const res = await data.json()

        printTask(res)
    } catch (error) {
        console.log(error);
    }
}


async function postTodo(todo) {
    try {
        await fetch(BASEURL, {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
    } catch (error) {
        console.log(error);
    }
}

async function putTodo(todo, id) {
    try {
        await fetch(`${BASEURL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(todo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
    } catch (error) {
        console.log(error);
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`${BASEURL}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.log(error);
    }
}

formTodo.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const desc = e.target.desc.value.trim();

    const todo = {
        title,
        desc
    }

    if (!Object.values(todo).every((value) => value !== ""))
        return alert("todos los campos son requeridos")

    if (todoEditing) {
        putTodo(todo, todoEditing.id)
    } else {
        postTodo(todo)
    }
});

tableTodo.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-danger")) {
        const idTodo = Number(e.target.id)

        deleteTodo(idTodo)
    }

    if (e.target.classList.contains("btn-warning")) {
        const idTodo = Number(e.target.id)
        await getTodo(idTodo)

        titulo.textContent = "Editando Una Tarea"

        formTodo.title.value = todoEditing.title;
        formTodo.desc.value = todoEditing.desc;
    }

});

getTodos()