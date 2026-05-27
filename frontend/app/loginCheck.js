// app/loginCheck.js
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks  = document.querySelectorAll('.logged-in');

export const loginCheck = (user) => {
    if (user) {
        loggedInLinks.forEach(el  => el.style.display = 'block');
        loggedOutLinks.forEach(el => el.style.display = 'none');
    } else {
        loggedInLinks.forEach(el  => el.style.display = 'none');
        loggedOutLinks.forEach(el => el.style.display = 'block');
    }
};
