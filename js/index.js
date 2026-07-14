//create Array to store the tasks
const tasks = [];

// Prevent event default behavior of form submission
const taskForm = document.getElementById("task-form");
taskForm.addEventListener("submit",function(event){
event.preventDefault();

    //get the input fields  
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const dateInput = document.getElementById("date");
    const priorityInput = document.querySelectorAll("input[name='priority']");
    
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

    // Log the input values to the console
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Date:", date);
    console.log("Priority:", priority);

    //create object to store the task data
    const taskData ={
        title: title,
        description: description,
        date: date,
        priority: priority,
        status: "pending"
    }

    //add the task data to the tasks array
    tasks.push(taskData);
     console.log("Tasks Array:", tasks);

    createTaskCard(taskData);

    taskForm.reset(); // Reset the form after submission


});

//get the task list container
const taskList = document.getElementById("task-list"); 

function createTaskCard(taskData) {

    //create a new task element
    const taskElement = document.createElement("div");
    const titleElement = document.createElement("h3");
    const descriptionElement = document.createElement("p");
    const dateElement = document.createElement("p");
    const priorityElement = document.createElement("span");
    const statusElement = document.createElement("span");
    
    //set the class of the task element
    taskElement.classList.add("task-card");
    //set the content of the task element
    titleElement.textContent = taskData.title;
    descriptionElement.textContent = taskData.description;
    dateElement.textContent = `Date: ${taskData.date}`;
    priorityElement.textContent = `Priority: ${taskData.priority}`;
    statusElement.textContent = `Status: ${taskData.status}`;
    // Append child elements to the task card
    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(dateElement);
    taskElement.appendChild(priorityElement);
    taskElement.appendChild(statusElement);
    taskList.appendChild(taskElement);
}





