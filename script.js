// DOM Elements
const loginContainer = document.getElementById("loginContainer");
const registerContainer = document.getElementById("registerContainer");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");

// Login elements
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");

// Register elements
const registerForm = document.getElementById("registerForm");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");
const registerButton = document.getElementById("registerButton");

// Password requirement elements
const reqSpecial = document.getElementById("reqSpecial");
const reqUppercase = document.getElementById("reqUppercase");
const reqLowercase = document.getElementById("reqLowercase");
const reqNumber = document.getElementById("reqNumber");
const reqMatch = document.getElementById("reqMatch");

// Switch between login and register
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
  resetForms();
});

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  resetForms();
});

// Reset forms
function resetForms() {
  loginForm.reset();
  registerForm.reset();
  loginButton.disabled = true;
  registerButton.disabled = true;
  resetPasswordRequirements();
}

// Reset password requirements
function resetPasswordRequirements() {
  reqSpecial.classList.remove("met");
  reqUppercase.classList.remove("met");
  reqLowercase.classList.remove("met");
  reqNumber.classList.remove("met");
  reqMatch.classList.remove("met");
}

// Login validation
function validateLogin() {
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  if (username !== "" && password !== "") {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

loginUsername.addEventListener("input", validateLogin);
loginPassword.addEventListener("input", validateLogin);

// Register password validation
function validatePassword() {
  const password = registerPassword.value;
  const confirm = confirmPassword.value;

  // Check for special symbol
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (hasSpecial) {
    reqSpecial.classList.add("met");
  } else {
    reqSpecial.classList.remove("met");
  }

  // Check for uppercase letter
  const hasUppercase = /[A-Z]/.test(password);
  if (hasUppercase) {
    reqUppercase.classList.add("met");
  } else {
    reqUppercase.classList.remove("met");
  }

  // Check for lowercase letter
  const hasLowercase = /[a-z]/.test(password);
  if (hasLowercase) {
    reqLowercase.classList.add("met");
  } else {
    reqLowercase.classList.remove("met");
  }

  // Check for number
  const hasNumber = /[0-9]/.test(password);
  if (hasNumber) {
    reqNumber.classList.add("met");
  } else {
    reqNumber.classList.remove("met");
  }

  // Check if passwords match
  if (password !== "" && confirm !== "" && password === confirm) {
    reqMatch.classList.add("met");
  } else {
    reqMatch.classList.remove("met");
  }

  // Enable register button if all requirements are met
  validateRegister();
}

// Register form validation
function validateRegister() {
  const username = registerUsername.value.trim();
  const password = registerPassword.value;
  const confirm = confirmPassword.value;

  // Check all password requirements
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch =
    password !== "" && confirm !== "" && password === confirm;

  // Enable button only if username is filled and all password requirements are met
  if (
    username !== "" &&
    hasSpecial &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    passwordsMatch
  ) {
    registerButton.disabled = false;
  } else {
    registerButton.disabled = true;
  }
}

registerUsername.addEventListener("input", validateRegister);
registerPassword.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

// Form submissions
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  alert(`Login successful!\nUsername: ${username}`);
  loginForm.reset();
  loginButton.disabled = true;
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = registerUsername.value.trim();
  const password = registerPassword.value;

  alert(
    `Registration successful!\nUsername: ${username}\nYou can now login with your credentials.`
  );

  // Switch to login form
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  resetForms();
});
