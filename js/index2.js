const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const priorityInput = document.querySelectorAll("input[name = 'priority']");
const taskList = document.getElementById("task-list");
const tasks = [];
let editingTaskId = null;

taskForm.addEventListener("submit", function(e){
    e.preventDefault();

    const taskData = getFormData();

    if(editingTaskId){
        taskData.id = editingTaskId;
        updateTask(taskData);
        editingTaskId = null;
    }else{
        addTask(taskData);
    }

    taskForm.reset();
})

function getFormData(){
    const title = titleInput.value;
    const description = descriptionInput.value;
    const date = dateInput.value;
    let priority = '';

    for(const radio of priorityInput){
        if(radio.checked){
            priority = radio.value;
        }
    }

    const taskData ={
        id: Date.now(),
        title: title,
        description: description,
        date: date,
        priority: priority,
        status: "pending"
    }

    return taskData;
}

function addTask(taskData){
    
    tasks.push(taskData);

    saveTasksToLocalStorage();
    renderTasks();
}

function renderTasks(){
    taskList.innerHTML = "";
    tasks.forEach(task => createTaskCard(task));
}

function updateTask(taskData){
    const index = tasks.findIndex(task => task.id === editingTaskId);
    if(index !== -1){
        tasks[index] =taskData;
        saveTasksToLocalStorage();
        renderTasks(); 
    }
}

function saveTasksToLocalStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage(){
    const storedTasks = localStorage.getItem("tasks");

    if(storedTasks){
        const parsedTasks = JSON.parse(storedTasks);
        tasks.push(...parsedTasks);
        renderTasks();
    }
}

function createTaskCard(taskData){
    const taskElement = document.createElement("div");
    const titleElement = document.createElement("h3");
    const descriptionElement = document.createElement("p");
    const dateElement = document.createElement("p");
    const priorityElement = document.createElement("p");
    const statusElement = document.createElement("p");
    const deleteButton = createDeleteButton(taskElement, taskData);
    const editButton = createEditButton(taskData);

    taskElement.classList.add("task-card");

    titleElement.textContent = taskData.title;
    descriptionElement.textContent = taskData.description;
    dateElement.textContent = `Date: ${taskData.date}`;
    priorityElement.textContent = `Priority: ${taskData.priority}`;
    statusElement.textContent = `Status: ${taskData.status}`;

    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(dateElement);
    taskElement.appendChild(priorityElement);
    taskElement.appendChild(statusElement);
    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);
    taskList.appendChild(taskElement);
}

function createDeleteButton(taskElement, taskData){
    const buttonElement = document.createElement("button");

    buttonElement.classList.add("btn" , "btn-delete")

    buttonElement.textContent= `Delete`;

    buttonElement.addEventListener("click", function(){
        const index = tasks.findIndex(task => task.id === taskData.id);
        if(index !== -1){
            tasks.splice(index, 1);
        }
        taskList.removeChild(taskElement);
        saveTasksToLocalStorage();
    });
    return buttonElement;
}

function createEditButton(taskData){
    const buttonElement = document.createElement("button");

    buttonElement.classList.add("btn", "btn-edit")
    buttonElement.textContent = `Edit`;

    buttonElement.addEventListener("click", function(){
        editingTaskId = taskData.id;
        titleInput.value = taskData.title;
        descriptionInput.value = taskData.description;
        dateInput.value = taskData.date;
        for(const radio of priorityInput){
            if(radio.value === taskData.priority){
                radio.checked = true;
            }
        }
    });
    return buttonElement;
}

loadTasksFromLocalStorage();

