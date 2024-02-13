document.addEventListener('DOMContentLoaded', function () {
  fetchUsers();
});

const fetchUsers = () => {
  fetch('/admin/users')
    .then(response => response.json())
    .then(displayUsers)
    .catch(handleError);
}

const displayUsers = (users) => {
  const usersTableBody = document.getElementById('usersTableBody');
  usersTableBody.innerHTML = '';

  users.forEach(user => {
    const row = createUserRow(user);
    usersTableBody.appendChild(row);
  });
}

const createUserRow = (user) => {
  const row = document.createElement('tr');
  row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
  row.setAttribute('data-user-id', user._id);

  const emailCell = document.createElement('td');
  emailCell.textContent = user.email;
  emailCell.className = 'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white';
  row.appendChild(emailCell);

  const roleCell = document.createElement('td');
  roleCell.textContent = user.role;
  roleCell.className = 'px-6 py-4';
  row.appendChild(roleCell);

  const actionsCell = document.createElement('td');
  actionsCell.className = 'px-6 py-4';
  const editButton = createActionButton('Edit', () => editUser(user._id));
  const deleteButton = createActionButton('Delete', () => deleteUser(user._id));
  actionsCell.appendChild(editButton);
  actionsCell.appendChild(document.createTextNode('\u00A0'));
  actionsCell.appendChild(deleteButton);
  row.appendChild(actionsCell);

  return row;
}

const createActionButton = (text, onClick) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

const deleteUser = (userId) => {
  const isConfirmed = confirm('Are you sure you want to delete this user?');

  if (!isConfirmed) {
    return;
  }

  fetch(`/admin/users/${userId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(result => {
      const deletedRow = document.querySelector(`tr[data-user-id="${userId}"]`);
      if (deletedRow) {
        deletedRow.remove();
      }
    })
    .catch(handleError);
}

const editUser = (userId) => {
  const editModal = document.getElementById('editModal');
  const editUserForm = document.getElementById('editUserForm');

  editModal.classList.remove('hidden');

  editUserForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const userEmail = editUserForm.elements.editUserEmail.value;
    const userRole = editUserForm.elements.editUserRole.value;

    fetch(`/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userEmail, userRole })
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          fetchUsers();
        } else {
          alert(result.message);
        }

        editUserForm.reset();
        editModal.classList.add('hidden');
      })
      .catch(handleError);
  });

  const closeEditModalBtn = document.getElementById('closeEditModal');
  closeEditModalBtn.addEventListener('click', function () {
    editModal.classList.add('hidden');
  });
}

const handleError = (error) => {
  console.error('An error occurred:', error);
}