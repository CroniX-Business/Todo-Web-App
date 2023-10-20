const currentYear = new Date().getFullYear();

document.getElementById('year').textContent = currentYear;

function showPassword() {
  var checkbox = document.getElementById('toggle');
  var label = document.getElementById('toggleLabel');
  var passwordInput = document.getElementById('password');
  var repeatPasswordInput = document.getElementById('repeat-password');


  if (checkbox.checked) {
    label.innerText = 'hide';
    passwordInput.type = 'text';
    repeatPasswordInput.type = 'text';
  } else {
    label.innerText = 'show';
    passwordInput.type = 'password';
    repeatPasswordInput.type = 'password';
  }
}

function openPopup() {
  var popup = document.getElementById('popup');
  var overlay = document.getElementById('overlay');

  popup.style.display = 'block';
  overlay.style.display = 'block';
}

function closePopup() {
  var popup = document.getElementById('popup');
  var overlay = document.getElementById('overlay');

  popup.style.display = 'none';
  overlay.style.display = 'none';
}