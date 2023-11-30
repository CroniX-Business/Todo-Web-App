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
  } else {
    console.log('Username cookie not found');
  }