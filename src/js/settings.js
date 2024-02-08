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

const usernameHeader = document.getElementById('usernameHeader');

function updateDisplayedUsername(newUsername) {
  if (usernameHeader) {
    usernameHeader.innerText = `${newUsername} settings`;
  } else {
    console.log('Username header not found');
  }
}

updateDisplayedUsername(getCookie('username'));

function submitChange(setting) {
  const paramField = document.getElementById(setting);
  let param = '';

  if (setting === 'deactivateAccount') {
    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (!confirmation) {
      return;
    }
  } else {
    param = paramField.value;
  }

  fetch('/user/settings', {
    method: 'POST',
    body: JSON.stringify({ setting, param }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        if (setting === 'changeName') {
          paramField.value = '';
          const updatedUsername = getCookie('username');
          updateDisplayedUsername(updatedUsername);
        } else if (setting === 'deactivateAccount' || setting === 'changeEmail') {
          window.location.href = data.redirect;
        } else {
          paramField.value = '';
        }
      }
    })
    .catch(error => console.error('Error:', error));
}