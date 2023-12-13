// DOM Elements Selection

const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

//local storage for saving added list items
var task=task = todosJson.filter(todo => todo.status === "pending").length;


updateTaskCount();
showTodos();

// list items addition and deletion
function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

//if list item get added then image will not be displayed
function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

// to add new task and show updated list and task number
function addTodo(todo)  {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  task++;
  updateTaskCount();
  showTodos();
}

// to add task after pressing enter key
input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

// to add task after clicking add button
addButton.addEventListener("click", () => {
  
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

// to make the task complete/incomplete
function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
    task--;
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
    task++;
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
  updateTaskCount();
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

// filtering
filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

//delete all functionality
deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  task = 0;
  updateTaskCount(); 
  showTodos();
});


//update task count 
function updateTaskCount() {
  const task_no = document.getElementById("task-no");
  task_no.innerHTML = `${task} task${task !== 1 ? 's' : ''} left`;
}
