const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;

const showPassword = () => {
  var checkbox = document.getElementById('toggle');
  var label = document.getElementById('toggleLabel');
  var passwordInput = document.getElementById('password');


  if (checkbox.checked) {
    label.innerText = 'hide';
    passwordInput.type = 'text';
  } else {
    label.innerText = 'show';
    passwordInput.type = 'password';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
      email: email,
      password: password
    };

    fetch('/auth/login', {
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
        if (!data.success) {
          handleLoginError(data.message);
        } else if (data.success) {
          handleLoginSuccess(data.redirect);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  });

  const handleLoginError = (errorMessage) => {
    let existingParagraph = document.getElementById("errorParagraph");

    if (!existingParagraph) {
      const p = document.createElement("p");
      p.id = "errorParagraph";
      const text = document.createTextNode(errorMessage);
      p.className = "text-white text-center";
      p.appendChild(text);

      form.appendChild(p);

      setTimeout(() => {
        form.removeChild(p);
      }, 5000);
    } else {
      existingParagraph.innerText = errorMessage;
    }
  }

  const handleLoginSuccess = (redirectUrl) => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
});
