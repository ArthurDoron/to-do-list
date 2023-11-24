document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function addTask() {
    var taskInput = document.getElementById('task');

    if (taskInput.value.trim() !== '') {
        var task = {
            id: new Date().getTime(),
            text: taskInput.value.trim(),
            completed: false
        };

        var tasks = getTasks();
        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';

        renderTasks();
    }
}

function removeTask(id) {
    var tasks = getTasks();

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
}

function editTask(id) {
    var tasks = getTasks();

    var taskToEdit = tasks.find(function (task) {
        return task.id === id;
    });

    // Check if the task is completed before allowing editing
    if (!taskToEdit.completed) {
        var taskTextElement = document.getElementById('task-text-' + id);

        taskTextElement.contentEditable = true;
        taskTextElement.focus();

        taskTextElement.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                taskTextElement.blur();
            }
        });

        taskTextElement.addEventListener('blur', function () {
            taskToEdit.text = taskTextElement.innerText;
            taskTextElement.contentEditable = false;

            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        });
    }
}

function toggleTaskStatus(id) {
    var tasks = getTasks();

    var taskToUpdate = tasks.find(function (task) {
        return task.id === id;
    });

    taskToUpdate.completed = !taskToUpdate.completed;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
}

function renderTasks() {
    var taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    var tasks = getTasks();

    tasks.forEach(function (task) {
        var listItem = document.createElement('li');
        listItem.classList.add('task-item');

        var taskText = document.createElement('div');
        taskText.classList.add('task-text');
        taskText.innerText = task.text;
        taskText.id = 'task-text-' + task.id;

        // Check if the task is completed
        if (task.completed) {
            listItem.classList.add('completed');
        } else {
            // Add click event for editing only if the task is not completed
            taskText.addEventListener('click', function () {
                editTask(task.id);
            });
        }

        listItem.appendChild(taskText);

        var taskButtons = document.createElement('div');
        taskButtons.classList.add('task-buttons');

        var editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.onclick = function () {
            editTask(task.id);
        };
        taskButtons.appendChild(editButton);

        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = function () {
            removeTask(task.id);
        };
        taskButtons.appendChild(deleteButton);

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = function () {
            toggleTaskStatus(task.id);
        };

        listItem.appendChild(taskText);
        listItem.appendChild(checkbox);
        listItem.appendChild(taskButtons);

        taskList.appendChild(listItem);
    });
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    renderTasks();
}