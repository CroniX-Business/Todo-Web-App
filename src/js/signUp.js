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
          email.value = "";
          password.value = "";
          repeatPassword.value = "";

          const p = document.createElement("p");
          p.id = "errorEmail";
          const text = document.createTextNode("Uspješno ste registrirani");
          p.className = "text-white text-center";
          p.appendChild(text);

          form.appendChild(p);

          setTimeout(() => {
            form.removeChild(p);
          }, 5000);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    } else if (!validateEmail(email.value)) {
      let existingEmail = document.getElementById("errorEmail");

      if (!existingEmail) {
        const p = document.createElement("p");
        p.id = "errorEmail";
        const text = document.createTextNode("Pogrešan oblik email-a");
        p.className = "mt-5 text-white text-center";
        p.appendChild(text);

        form.appendChild(p);

        setTimeout(() => {
          form.removeChild(p);
        }, 5000);
      } else {
        existingEmail.innerText = "Pogrešan oblik email-a";
      }
    } else if (password.value !== repeatPassword.value) {
      let existingPass = document.getElementById("errorPass");

      if (!existingPass) {
        const p = document.createElement("p");
        p.id = "errorPass";
        const text = document.createTextNode("lozinke nisu jednake");
        p.className = "mt-5 text-white text-center";
        p.appendChild(text);

        form.appendChild(p);

        setTimeout(() => {
          form.removeChild(p);
        }, 5000);
      } else {
        existingPass.innerText = "lozinke nisu jednake";
      }
    }
  });
});