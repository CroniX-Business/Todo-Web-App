const currentYear = new Date().getFullYear();
console.log(currentYear)

document.getElementById('year').textContent = currentYear;

const showPassword = () => {
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
};