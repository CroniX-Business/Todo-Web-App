const currentYear = new Date().getFullYear();

document.getElementById('year').textContent = currentYear;

document.addEventListener("DOMContentLoaded", function () {
    const navbarToggle = document.querySelector("[data-collapse-toggle]");
    const navbarMenu = document.getElementById(navbarToggle.getAttribute("aria-controls"));

    navbarToggle.addEventListener("click", function () {
        navbarMenu.classList.toggle("hidden");
    });
});