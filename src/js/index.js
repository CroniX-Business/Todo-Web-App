const currentYear = new Date().getFullYear();

document.getElementById('year').textContent = currentYear;

document.addEventListener("DOMContentLoaded", function () {
    const navbarToggle = document.querySelector("[data-collapse-toggle]");
    const navbarMenu = document.getElementById(navbarToggle.getAttribute("aria-controls"));

    navbarToggle.addEventListener("click", function () {
        navbarMenu.classList.toggle("hidden");
    });
});

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
  
    popup.style.display = 'block';
  }
  
  function closePopup() {
    var popup = document.getElementById('popup');
  
    popup.style.display = 'none';
}

function openTerms() {
    var popup = document.getElementById('popupTerms');
  
    popup.style.display = 'block';
  }
  
  function closeTerms() {
    var popup = document.getElementById('popupTerms');
  
    popup.style.display = 'none';
}