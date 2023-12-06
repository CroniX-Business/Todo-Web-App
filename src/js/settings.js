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
updateDisplayedUsername(username);

function updateDisplayedUsername(newUsername) {
  const usernameHeader = document.getElementById('usernameHeader');
  if (usernameHeader) {
    usernameHeader.innerText = `${newUsername} settings`;
  } else {
    console.log('Username header not found');
  }
}

function submitChange(setting) {
  const paramField = document.getElementById(`${setting}`);
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
    .then(response => response.json())
    .then(data => {
      if(data.success){
        if (setting === 'changeName') {
          paramField.value = "";
          const updatedUsername = getCookie('username');;
          updateDisplayedUsername(updatedUsername);
        }else if(setting === 'deactivateAccount'){
          window.location.href = data.redirect;
        }else if(setting === 'changeEmail'){
          window.location.href = data.redirect;
        }else{
          paramField.value = "";
        }
      }
    
    })
    .catch(error => console.error('Error:', error));
}

function updateDisplayedUsername(newUsername) {
  const usernameHeader = document.getElementById('usernameHeader');
  if (usernameHeader) {
    usernameHeader.innerText = `${newUsername} settings`;
  } else {
    console.log('Username header not found');
  }
}