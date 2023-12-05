document.addEventListener('DOMContentLoaded', function () {
  fetchUsers();
});

const fetchUsers = () => {
  fetch('/admin/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(users => {
      console.log(users);
      const usersTableBody = document.getElementById('usersTableBody');
      usersTableBody.innerHTML = ''; // Clear existing rows

      users.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
        row.setAttribute('data-user-id', user._id); // Add data-user-id attribute
        row.innerHTML = `
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${user.email}</td>
          <td class="px-6 py-4">${user.role}</td>
          <td class="px-6 py-4">
            <button onclick="editUser('${user._id}')">Edit</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        `;
        usersTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
}

const deleteUser = (userId) => {
  const isConfirmed = confirm('Are you sure you want to delete this user?');

  if (!isConfirmed) {
    return;
  }

  fetch(`/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);

      const deletedRow = document.querySelector(`tr[data-user-id="${userId}"]`);
      if (deletedRow) {
        deletedRow.remove();
      }
    })
    .catch(error => {
      console.error('Error deleting user:', error);
    });
}

const editUser = (userId) => {
  const editModal = document.getElementById('editModal');
  const editUserForm = document.getElementById('editUserForm');

  editModal.classList.remove('hidden');

  editUserForm.addEventListener('submit', function (event) {
    event.preventDefault();

    fetch(`/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: editUserForm.elements.editUserEmail.value,
        userRole: editUserForm.elements.editUserRole.value,
      }),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);


        if(result.success){
          fetchUsers();
        } else {
          alert(result.message)
        }

        editUserForm.elements.editUserEmail.value = "";
        editUserForm.elements.editUserRole.value = "";
        
        editModal.classList.add('hidden');
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  });

  const closeEditModalBtn = document.getElementById('closeEditModal');
  closeEditModalBtn.addEventListener('click', function () {
    editModal.classList.add('hidden');
  });
}