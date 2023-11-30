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
updateDate();

function updateDate() {
    const formattedDate = formatDate(currentDate);
    document.getElementById('currentDate').innerText = formattedDate;
    document.getElementById('currentDate').classList.toggle('text-green-500', isCurrentDay());
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
    maxDate.setDate(today.getDate() + 30);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 30);
    return currentDate >= minDate && currentDate <= maxDate;
  }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}-${month}`;
  }

var taskCount = 0;

document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (taskCount >= 10) {
        alert('Task limit reached. You cannot add more tasks.');
        return;
    }

    var taskTitle = document.getElementById('taskTitle').value;
    var taskDescription = document.getElementById('taskDescription').value;
    taskDescription = `∙ ${taskDescription}`;

    var taskElement = document.createElement('div');
    taskElement.className = 'p-2.5 bg-gray-200 rounded-lg flex items-center justify-between';

    var leftSide = document.createElement('div');
    leftSide.className = 'flex items-center';

    var titleElement = document.createElement('div');
    titleElement.textContent = taskTitle;
    titleElement.className = 'mr-2';
    leftSide.appendChild(titleElement);

    var descriptionElement = document.createElement('div');
    descriptionElement.textContent = taskDescription;
    descriptionElement.style.opacity = '0.7';
    descriptionElement.className = 'mr-2';
    leftSide.appendChild(descriptionElement);

    taskElement.appendChild(leftSide);

    var rightSide = document.createElement('div');
    rightSide.className = 'flex items-center';

    var timeElement = document.createElement('div');
    timeElement.textContent = getCurrentDateTime();
    timeElement.style.opacity = '0.7';
    timeElement.className = 'mr-2';
    rightSide.appendChild(timeElement);

    var finishButton = document.createElement('button');
    finishButton.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
    finishButton.className = 'mr-2';
    finishButton.addEventListener('click', function () {
        taskElement.classList.add('bg-gray-700');
        finishButton.remove();
    });
    rightSide.appendChild(finishButton);

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-x text-red-500"></i>';
    deleteButton.addEventListener('click', function () {
        taskElement.remove();
        taskCount--;
    });
    rightSide.appendChild(deleteButton);

    taskElement.appendChild(rightSide);

    document.getElementById('checkboxContainer').appendChild(taskElement);

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';

    taskCount++;
});

function sortTasksByTitle() {
    const checkboxContainer = document.getElementById('checkboxContainer');
    const tasks = Array.from(checkboxContainer.children);

    tasks.sort((a, b) => {
        const titleA = a.querySelector('div > div > div:first-child').textContent.toLowerCase();
        const titleB = b.querySelector('div > div > div:first-child').textContent.toLowerCase();
        return titleA.localeCompare(titleB);
    });

    checkboxContainer.innerHTML = '';

    tasks.forEach(task => checkboxContainer.appendChild(task));
}
