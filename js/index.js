//create Array to store the tasks
const tasks = [];

let editingTaskId = null; // Variable to track the task being edited

//get the input fields  
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const priorityInput = document.querySelectorAll("input[name='priority']");

// Prevent event default behavior of form submission
const taskForm = document.getElementById("task-form");
taskForm.addEventListener("submit",function(event){
event.preventDefault();
    
    const taskData = getFormData();

    if (editingTaskId) {
        // If editing, update the existing task
        taskData.id = editingTaskId; // Preserve the original ID
        updateTask(taskData);
        editingTaskId = null; // Reset editing state
    }else {
        addTask(taskData);
    }

    taskForm.reset(); // Reset the form after submission


});

function getFormData() {
    //get values of the input fields
    const title = titleInput.value;
    const description = descriptionInput.value;
    const date = dateInput.value;
    let priority = "";
    //loop through the radio buttons to find the checked one
        for (const radio of priorityInput) {
        if (radio.checked) {
            priority = radio.value;
        }
    }

    //create object to store the task data
    const taskData ={
        id: Date.now(), // Use timestamp as a unique ID
        title: title,
        description: description,
        date: date,
        priority: priority,
        status: "pending"
    }
    return taskData;
}

function addTask(taskData) {
    //add the task data to the tasks array
    tasks.push(taskData);
    
    saveTasksToLocalStorage();
    
    createTaskCard(taskData);
}

function updateTask(taskData) {
    // Find the index of the task being edited
    const index = tasks.findIndex(task => task.id === editingTaskId);
    if (index !== -1) {
        // Update the task data
        tasks[index] = taskData;
        // Save updated tasks to local storage
        saveTasksToLocalStorage();
        renderTasks(); // Re-render the task list to reflect changes
    }
}

//render the tasks to the DOM
function renderTasks() {
    taskList.innerHTML = ""; // Clear the task list
    tasks.forEach(task => createTaskCard(task));
}

function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage when the page loads
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        tasks.push(...parsedTasks);
        renderTasks();
    }
}

//get the task list container
const taskList = document.getElementById("task-list"); 

function createTaskCard(taskData) {
    
    //create a new task element
    const taskElement = document.createElement("div");
    const titleElement = document.createElement("h3");
    const descriptionElement = document.createElement("p");
    const dateElement = document.createElement("p");
    const priorityElement = document.createElement("p");//span
    const statusElement = document.createElement("p");//span

    //set the class of the task element
    taskElement.classList.add("task-card");

    //set the content of the task element
    titleElement.textContent = taskData.title;
    descriptionElement.textContent = taskData.description;
    dateElement.textContent = `Date: ${taskData.date}`;
    priorityElement.textContent = `Priority: ${taskData.priority}`;
    statusElement.textContent = `Status: ${taskData.status}`;

    const deleteButton = createDeleteButton(taskElement, taskData);
    const editButton = createEditButton(taskData);

    // Append child elements to the task card
    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(dateElement);
    taskElement.appendChild(priorityElement);
    taskElement.appendChild(statusElement);
    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);
    taskList.appendChild(taskElement);
}

function createDeleteButton(taskElement, taskData) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn" , "btn-delete");
    // Add event listener to the delete button
    deleteButton.addEventListener("click", function() {
        // Remove the task from the tasks array
        const index = tasks.findIndex(task => task.id === taskData.id);
        if (index !== -1) {
        tasks.splice(index, 1);
        }
        // Remove the task element from the DOM
        taskList.removeChild(taskElement);
        saveTasksToLocalStorage();
    });
    return deleteButton;
}

function createEditButton(taskData) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-edit");

    // Add event listener to the edit button
    editButton.addEventListener("click", function() {
        editingTaskId = taskData.id; // Set the editing task ID
        titleInput.value = taskData.title;
        descriptionInput.value = taskData.description;
        dateInput.value = taskData.date;
        //loop through the radio buttons to find the checked one
        for (const radio of priorityInput) {
            if (radio.value === taskData.priority) {
                radio.checked = true;
            }
        }
    });

    return editButton;
}

// Call the function when the page loads
loadTasksFromLocalStorage();


