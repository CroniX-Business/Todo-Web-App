function getCookie(name) {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`));
  return cookie ? cookie.substring(name.length + 1) : null;
}

const username = getCookie('username');

const usernameHeader = document.getElementById('usernameHeader');
if (usernameHeader && username) {
  usernameHeader.textContent = `${username} settings`;
}

let currentDate = new Date();
let formattedDate;

updateDate();

function updateDate() {
  formattedDate = formatDate(currentDate);
  const currentDateElement = document.getElementById('currentDate');
  if (currentDateElement) {
    currentDateElement.innerText = formattedDate;
    currentDateElement.classList.toggle('text-green-500', isCurrentDay());
  }

  TasksFromServer(formattedDate);
}

function prevDay() {
  currentDate.setDate(currentDate.getDate() - 1);
  if (isWithinRange()) {
    updateDate();
  } else {
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

function nextDay() {
  currentDate.setDate(currentDate.getDate() + 1);
  if (isWithinRange()) {
    updateDate();
  } else {
    currentDate.setDate(currentDate.getDate() - 1);
  }
}

function isCurrentDay() {
  const today = new Date();
  return currentDate.toDateString() === today.toDateString();
}

function isWithinRange() {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 10);
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 10);
  return currentDate >= minDate && currentDate <= maxDate;
}

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}-${month}`;
}


function createTaskElement(taskTitle, taskDescription, Date, taskId) {
  const taskElement = document.createElement('div');
  taskElement.dataset.taskId = taskId;
  taskElement.className = 'p-2.5 bg-gray-200 rounded-lg flex items-center justify-between';

  const leftSideHTML = `
    <div class="flex items-center">
      <div class="mr-2">${taskTitle}</div>
      <div style="opacity: 0.7;" class="mr-2">∙ ${taskDescription}</div>
    </div>
  `;
  taskElement.innerHTML += leftSideHTML;

  const rightSideHTML = `
    <div class="flex items-center">
      <div style="opacity: 0.7;" class="mr-2">${Date}</div>
      <button class="mr-2 finish-button"><i class="fa-solid fa-check text-green-500"></i></button>
      <button><i class="fa-solid fa-x text-red-500"></i></button>
    </div>
  `;
  taskElement.innerHTML += rightSideHTML;

  taskElement.querySelector('.finish-button').addEventListener('click', function () {
    taskElement.classList.add('bg-gray-700');
    const taskId = taskElement.dataset.taskId;
    finishTaskOnServer(taskId);
    this.remove();
  });

  taskElement.querySelector('.fa-x').addEventListener('click', function () {
    const taskId = taskElement.dataset.taskId;
    deleteTaskOnServer(taskId);
    taskElement.remove();
  });

  return taskElement;
}

document.getElementById('taskForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescriptionInput = document.getElementById('taskDescription');
  const taskTimeInput = document.getElementById('taskTime');

  const taskTitle = taskTitleInput.value;
  const taskDescription = taskDescriptionInput.value;
  const taskTime = taskTimeInput.value;

  saveTaskToServer(taskTitle, taskDescription, formattedDate, taskTime);

  taskTitleInput.value = '';
  taskDescriptionInput.value = '';
});


function sortTasksByTitle() {
  const checkboxContainer = document.getElementById('checkboxContainer');
  const tasks = Array.from(checkboxContainer.children);

  tasks.sort((a, b) => {
    const titleA = getTitle(a);
    const titleB = getTitle(b);
    return titleA.localeCompare(titleB);
  });

  tasks.forEach(task => checkboxContainer.appendChild(task));
}

function sortTasksByTime() {
  const checkboxContainer = document.getElementById('checkboxContainer');
  const tasks = Array.from(checkboxContainer.children);

  tasks.sort((a, b) => {
    const timeA = getTime(a);
    const timeB = getTime(b);
    return compareTime(timeA, timeB);
  });

  tasks.forEach(task => checkboxContainer.appendChild(task));
}

function getTitle(task) {
  return task.querySelector('div > div > div:first-child').textContent.trim().toLowerCase();
}

function getTime(task) {
  return task.querySelector('.flex.items-center:last-child').textContent.trim();
}

function compareTime(timeA, timeB) {
  const [dateA, timePartA] = timeA.split(' ');
  const [dateB, timePartB] = timeB.split(' ');

  const [hoursA, minutesA] = timePartA.split(':').map(Number);
  const [hoursB, minutesB] = timePartB.split(':').map(Number);

  if (dateA !== dateB) {
    return dateA.localeCompare(dateB);
  }

  if (hoursA !== hoursB) {
    return hoursA - hoursB;
  }

  return minutesA - minutesB;
}

function TasksFromServer(formattedDate) {
  fetch('/user/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date: formattedDate }),
  })
    .then(response => response.json())
    .then(data => {
      const tasksFromServer = data.tasks;
      const checkboxContainer = document.getElementById('checkboxContainer');
      const existingTaskElements = Array.from(checkboxContainer.children);

      tasksFromServer.forEach(task => {
        const existingTaskElement = existingTaskElements.find(element => element.dataset.taskId === task._id);

        if (!existingTaskElement) {
          const taskElement = createTaskElement(task.taskName, task.taskDesc, task.Date, task._id);
          checkboxContainer.appendChild(taskElement);
          if (task.finished) {
            taskElement.classList.add('bg-gray-700');
            const finishButton = taskElement.querySelector('.finish-button');
            if (finishButton) {
              finishButton.remove();
            }
          }
        } else {
          if (task.finished) {
            existingTaskElement.classList.add('bg-gray-700');
            const finishButton = existingTaskElement.querySelector('.finish-button');
            if (finishButton) {
              finishButton.remove();
            }
          }
        }
      });

      existingTaskElements.forEach(existingTaskElement => {
        const taskId = existingTaskElement.dataset.taskId;
        if (!tasksFromServer.some(task => task._id === taskId)) {
          existingTaskElement.remove();
        }
      });
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}

async function makeRequest(url, method, data) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function saveTaskToServer(taskName, taskDesc, Date, taskTime) {
  try {
    const savedTask = await makeRequest('/user/task/save', 'POST', { taskName, taskDesc, Date, taskTime });
    TasksFromServer(formattedDate);
  } catch (error) {
    console.error('Error saving task:', error);
  }
}

async function deleteTaskOnServer(taskId) {
  try {
    const deletedTask = await makeRequest('/user/task/delete', 'POST', { taskId });
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

async function finishTaskOnServer(taskId) {
  try {
    const updatedTask = await makeRequest('/user/task/finished', 'POST', { taskId });
  } catch (error) {
    console.error('Error marking task as finished:', error);
  }
}

function searchTasks() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  filterTasks(searchQuery);
}

function filterTasks(searchQuery) {
  const tasks = document.getElementById('checkboxContainer').children;

  Array.from(tasks).forEach(task => {
    const taskTitleElement = task.querySelector('div > div > div:first-child');
    const taskDescriptionElement = task.querySelector('div > div > div:nth-child(2)');

    const taskTitle = taskTitleElement.textContent.trim().toLowerCase();
    const taskDescription = taskDescriptionElement.textContent.trim().toLowerCase();

    task.style.display = (taskTitle.includes(searchQuery) || taskDescription.includes(searchQuery)) ? '' : 'none';
  });
}