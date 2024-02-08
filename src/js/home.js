const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;

const showPassword = () => {
  const checkbox = document.getElementById('toggle');
  const label = document.getElementById('toggleLabel');
  const passwordInput = document.getElementById('password');

  if (checkbox.checked) {
    label.textContent = 'hide';
    passwordInput.type = 'text';
  } else {
    label.textContent = 'show';
    passwordInput.type = 'password';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const userData = {
      email,
      password
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
        } else {
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
      p.textContent = errorMessage;
      p.className = "text-white text-center";

      form.appendChild(p);

      setTimeout(() => {
        form.removeChild(p);
      }, 5000);
    } else {
      existingParagraph.textContent = errorMessage;
    }
  }

  const handleLoginSuccess = (redirectUrl) => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
});