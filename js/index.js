//create Array to store the tasks
const tasks = [];

let editingTaskId = null; // Variable to track the task being edited

//get the input fields  
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const priorityInput = document.querySelectorAll("input[name='priority']");
const searchInput = document.getElementById("search-input");
const statusInput = document.getElementById("status-filter");
const priorityFilterInput = document.getElementById("priority-filter");
const completedTaskList = document.getElementById("completed-task-list");
const pendingTaskList = document.getElementById("pending-task-list");

function filterTasks(){
    const searchText = searchInput.value;
    const selectedStatus = statusInput.value;
    const selectedPriority = priorityFilterInput.value;

    return tasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
        && (selectedStatus === "all" || task.status === selectedStatus) 
        && (selectedPriority === "all" || task.priority === selectedPriority)  
    );
}
// priority filter
priorityFilterInput.addEventListener("change", function(){
    renderTasks(filterTasks());
})

//status filter
statusInput.addEventListener("change", function(){
    renderTasks(filterTasks());
})

//Search input
searchInput.addEventListener("input",function(){
    renderTasks(filterTasks());
});

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
    renderTasks(tasks); // Re-render the task list to reflect changes
}

function updateTask(taskData) {
    // Find the index of the task being edited
    const index = tasks.findIndex(task => task.id === editingTaskId);
    if (index !== -1) {
        // Update the task data
        tasks[index] = taskData;
        // Save updated tasks to local storage
        saveTasksToLocalStorage();
        renderTasks(tasks); // Re-render the task list to reflect changes
    }
}

//render the tasks to the DOM
function renderTasks(tasksToRender) {
    pendingTaskList.innerHTML = ""; // Clear the pending task list
    completedTaskList.innerHTML = ""; // Clear the completed task list
    tasksToRender.forEach(task => {
        if (task.status === "pending") {
            createTaskCard(task, pendingTaskList);
        } else if (task.status === "completed") {
            createTaskCard(task, completedTaskList);
        }
    });
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
        renderTasks(tasks);
    }
}

//get the task list container
const taskList = document.getElementById("pending-task-list"); 

function createTaskCard(taskData, taskListContainer) {
    
    //create a new task element
    const taskElement = document.createElement("div");
    const titleElement = document.createElement("h3");
    const descriptionElement = document.createElement("p");
    const dateElement = document.createElement("p");
    const priorityElement = document.createElement("p");//span
    const statusElement = document.createElement("p");//span
    const buttonsContainer = document.createElement("div");

    //set the class of the task element
    taskElement.classList.add("task-card");

    buttonsContainer.classList.add("buttons-container");

    //set the content of the task element
    titleElement.textContent = taskData.title;
    descriptionElement.textContent = taskData.description;
    dateElement.textContent = `Date: ${taskData.date}`;
    priorityElement.textContent = `Priority: ${taskData.priority}`;
    statusElement.textContent = `Status: ${taskData.status}`;

    const deleteButton = createDeleteButton(taskElement, taskData);
    const editButton = createEditButton(taskData);
    const completeButton = createCompleteButton(taskData);

    // if the task is completed, hide the complete button
    if (taskData.status === "completed") {
        completeButton.style.display = "none";
    };

    // Append child elements to the task card
    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(dateElement);
    taskElement.appendChild(priorityElement);
    taskElement.appendChild(statusElement);
    buttonsContainer.appendChild(completeButton);
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);
    taskElement.appendChild(buttonsContainer);
    taskListContainer.appendChild(taskElement);
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

function createCompleteButton(taskData) {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("btn", "btn-complete");
    buttonElement.textContent = "Complete";

    buttonElement.addEventListener("click", function(){
        taskData.status = "completed";
        saveTasksToLocalStorage();
        renderTasks(tasks);

    });


    return buttonElement;
}

// Call the function when the page loads
loadTasksFromLocalStorage();


