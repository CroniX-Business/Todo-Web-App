const currentYear = new Date().getFullYear();
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

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const register = document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const repeatPassword = document.getElementById('repeat-password');

    if (validateEmail(email.value) && (password.value === repeatPassword.value)) {
      const userData = {
        email: email.value,
        password: password.value,
      };

      fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            handleRegisterSuccess(data.redirect);
          } else {
            handleRegisterError(data.message);
          }
          email.value = "";
          password.value = "";
          repeatPassword.value = "";
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    } else if (!validateEmail(email.value)) {
      handleRegisterError("pogrešan format emaila");
    } else if (password.value !== repeatPassword.value) {
      handleRegisterError("lozinke nisu jednake");
    }
  });

  const handleRegisterSuccess = (redirectUrl) => {
    console.log(redirectUrl)
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
  
  const handleRegisterError = (errorMessage) => {
    let errorMess = document.getElementById("errorMess");
  
    if (!errorMess) {
      const p = document.createElement("p");
      p.id = "errorMess";
      const text = document.createTextNode(errorMessage);
      p.className = "mt-5 text-white text-center";
      p.appendChild(text);
  
      form.appendChild(p);
  
      setTimeout(() => {
        form.removeChild(p);
      }, 5000);
    } else {
      errorMess.innerText = errorMessage;
    }
  }
});