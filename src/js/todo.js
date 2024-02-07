function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

const username = getCookie('username');

const usernameHeader = document.getElementById('usernameHeader');
if (usernameHeader && username) {
  usernameHeader.innerText = `${username} settings`;
}

function getCurrentDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

let currentDate = new Date();
let formattedDate;

updateDate();

function updateDate() {
  formattedDate = formatDate(currentDate);
  document.getElementById('currentDate').innerText = formattedDate;
  document.getElementById('currentDate').classList.toggle('text-green-500', isCurrentDay());

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

function createTaskElement(taskTitle, taskDescription, creationDate, taskId) {
  var taskElement = document.createElement('div');
  taskElement.dataset.taskId = taskId;
  taskElement.className = 'p-2.5 bg-gray-200 rounded-lg flex items-center justify-between';

  var leftSide = document.createElement('div');
  leftSide.className = 'flex items-center';

  var titleElement = document.createElement('div');
  titleElement.textContent = taskTitle;
  titleElement.className = 'mr-2';
  leftSide.appendChild(titleElement);

  var descriptionElement = document.createElement('div');
  descriptionElement.textContent = `∙ ${taskDescription}`;
  descriptionElement.style.opacity = '0.7';
  descriptionElement.className = 'mr-2';
  leftSide.appendChild(descriptionElement);

  taskElement.appendChild(leftSide);

  var rightSide = document.createElement('div');
  rightSide.className = 'flex items-center';

  var timeElement = document.createElement('div');
  timeElement.textContent = creationDate;
  timeElement.style.opacity = '0.7';
  timeElement.className = 'mr-2';
  rightSide.appendChild(timeElement);

  var finishButton = document.createElement('button');
  finishButton.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
  finishButton.className = 'mr-2 finish-button';
  finishButton.addEventListener('click', function () {
    taskElement.classList.add('bg-gray-700');

    const taskId = taskElement.dataset.taskId;

    finishTaskOnServer(taskId);

    finishButton.remove();
  });
  rightSide.appendChild(finishButton);

  var deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fa-solid fa-x text-red-500"></i>';
  deleteButton.addEventListener('click', function () {
    const taskId = taskElement.dataset.taskId;
    console.log(taskId);

    deleteTaskOnServer(taskId);

    taskElement.remove();
  });
  rightSide.appendChild(deleteButton);

  taskElement.appendChild(rightSide);

  return taskElement;
}

document.getElementById('taskForm').addEventListener('submit', function (event) {
  event.preventDefault();

  var taskTitle = document.getElementById('taskTitle').value;
  var taskDescription = document.getElementById('taskDescription').value;
  var taskTime = document.getElementById('taskTime').value;
  
  // var taskElement = createTaskElement(taskTitle, taskDescription);
  // document.getElementById('checkboxContainer').appendChild(taskElement);

  saveTaskToServer(taskTitle, taskDescription, formattedDate, taskTime);
  
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  //document.getElementById('taskDescription').value = '';

});

function sortTasksByTitle() {
  const checkboxContainer = document.getElementById('checkboxContainer');
  const tasks = Array.from(checkboxContainer.children);

  tasks.sort((a, b) => {
    const titleA = a.querySelector('div > div >div:first-child').textContent.toLowerCase();
    const titleB = b.querySelector('div > div > div:first-child').textContent.toLowerCase();
    return titleA.localeCompare(titleB);
  });

  checkboxContainer.innerHTML = '';

  tasks.forEach(task => checkboxContainer.appendChild(task));
}

function sortTasksByTime() {
  const checkboxContainer = document.getElementById('checkboxContainer');
  const tasks = Array.from(checkboxContainer.children);

  tasks.sort((a, b) => {
      const timeElementA = a.querySelector('.flex.items-center:last-child').textContent.trim();
      const timeElementB = b.querySelector('.flex.items-center:last-child').textContent.trim();
      return compareTime(timeElementA, timeElementB);
  });

  checkboxContainer.innerHTML = '';

  tasks.forEach(task => checkboxContainer.appendChild(task));
}

function compareTime(timeA, timeB) {
  // Split the time string into date and time components
  const [dateA, timePartA] = timeA.split(' '); // Split by space to get date and time
  const [dateB, timePartB] = timeB.split(' '); // Split by space to get date and time

  // Split the time part into hours and minutes
  const [hoursA, minutesA] = timePartA.split(':').map(Number); // Convert to numbers
  const [hoursB, minutesB] = timePartB.split(':').map(Number); // Convert to numbers

  // Compare the dates (not included in the initial function)
  if (dateA !== dateB) {
    // If the dates are different, return the result of comparing the dates
    return dateA.localeCompare(dateB);
  }

  // If dates are equal, compare the time
  // Compare the hours first
  if (hoursA !== hoursB) {
    return hoursA - hoursB;
  }

  // If hours are equal, compare minutes
  return minutesA - minutesB;
}



function TasksFromServer(formattedDate) {
  console.log(formattedDate);

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
      const existingTasks = Array.from(checkboxContainer.children);

      // Iterate through tasks received from server
      tasksFromServer.forEach(task => {
        const existingTaskElement = existingTasks.find(element => element.dataset.taskId === task._id);

        if (!existingTaskElement) { // If task is not already displayed, create new task element
          const taskElement = createTaskElement(task.taskName, task.taskDesc, task.creationDate, task._id);
          checkboxContainer.appendChild(taskElement);
        } else if (task.finished) { // If task is finished, update its style
          existingTaskElement.classList.add('bg-gray-700');
          const finishButton = existingTaskElement.querySelector('.finish-button');
          if (finishButton) {
            finishButton.remove();
          }
        }
      });

      // Remove tasks that are no longer present in the server response
      existingTasks.forEach(existingTask => {
        const taskId = existingTask.dataset.taskId;
        if (!tasksFromServer.some(task => task._id === taskId)) {
          existingTask.remove();
        }
      });
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}

function saveTaskToServer(taskName, taskDesc, creationDate, taskTime) {

  fetch('/user/task/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskName, taskDesc, creationDate, taskTime }),
  })
    .then(response => response.json())
    .then(savedTask => {
      console.log('Task saved successfully:', savedTask);
      TasksFromServer(formattedDate);
    })
    .catch(error => console.error('Error saving task:', error));
}

function deleteTaskOnServer(taskId) {
  fetch('/user/task/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskId }),
  })
    .then(response => response.json())
    .then(deletedTask => {
      console.log('Task deleted successfully:', deletedTask);
      //TasksFromServer(formattedDate);
    })
    .catch(error => console.error('Error deleting task:', error));
}

function finishTaskOnServer(taskId) {
  fetch('/user/task/finished', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskId }),
  })
    .then(response => response.json())
    .then(updatedTask => {
      console.log('Task marked as finished:', updatedTask);
    })
    .catch(error => console.error('Error marking task as finished:', error));
}

function searchTasks() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  filterTasks(searchQuery);
}

function filterTasks(searchQuery) {
  const tasks = document.getElementById('checkboxContainer').children;

  Array.from(tasks).forEach(task => {
      const taskTitle = task.querySelector('div > div > div:first-child').textContent.toLowerCase();
      const taskDescription = task.querySelector('div > div > div:nth-child(2)').textContent.toLowerCase();

      if (taskTitle.includes(searchQuery) || taskDescription.includes(searchQuery)) {
          task.style.display = '';
      } else {
          task.style.display = 'none';
      }
  });
}
