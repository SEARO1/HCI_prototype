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

  // Hide login/register container and show chat page
  const authContainer = document.querySelector(".container");
  if (authContainer) authContainer.classList.add("hidden");
  document.getElementById("chatPage").classList.remove("hidden");

  // Reset body styles for chat page
  document.body.style.display = "block";
  document.body.style.padding = "0";

  loginForm.reset();
  loginButton.disabled = true;

  // Initialize chat functionality
  initializeChat();
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = registerUsername.value.trim();

  alert(
    `Registration successful!\nUsername: ${username}\nYou can now login with your credentials.`
  );

  // Switch to login form
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  resetForms();
});

// Chat functionality
let stressLevel = 0;
let lastScrollTime = 0;
let lastScrollPosition = 0;
let deleteCount = 0;
let stressWarningShown = false;
let selectedEmoji = null;

function initializeChat() {
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const stressBar = document.getElementById("stressBar"); // vertical fill element
  const stressPercentage = document.getElementById("stressPercentage");
  const closeAppBtn = document.getElementById("closeAppBtn");

  // Modals
  const stressModal = document.getElementById("stressModal");
  const feedbackModal = document.getElementById("feedbackModal");
  const responseModal = document.getElementById("responseModal");
  const continueBtn = document.getElementById("continueBtn");
  const takeBreakBtn = document.getElementById("takeBreakBtn");
  const submitFeedbackBtn = document.getElementById("submitFeedbackBtn");
  const closeResponseBtn = document.getElementById("closeResponseBtn");
  const emojiBtns = document.querySelectorAll(".emoji-btn");

  // Update stress bar display
  function updateStressBar() {
    stressBar.style.height = `${stressLevel}%`;
    stressPercentage.textContent = `${Math.round(stressLevel)}%`;

    // Change color based on level
    stressBar.classList.remove("medium", "high");
    if (stressLevel >= 70) {
      stressBar.classList.add("high");
      if (!stressWarningShown) {
        showStressWarning();
      }
    } else if (stressLevel >= 40) {
      stressBar.classList.add("medium");
    }
  }

  // Increase stress level
  function increaseStress(amount) {
    stressLevel = Math.min(100, stressLevel + amount);
    updateStressBar();
  }

  // Decrease stress level gradually
  function decreaseStress() {
    if (stressLevel > 0) {
      stressLevel = Math.max(0, stressLevel - 0.5);
      updateStressBar();
    }
  }

  // Gradual stress decrease over time
  setInterval(decreaseStress, 1000);

  // Detect fast scrolling
  chatMessages.addEventListener("scroll", () => {
    const currentTime = Date.now();
    const currentPosition = chatMessages.scrollTop;
    const timeDiff = currentTime - lastScrollTime;
    const scrollDiff = Math.abs(currentPosition - lastScrollPosition);

    // If scrolling fast (large distance in short time)
    if (timeDiff < 100 && scrollDiff > 50) {
      increaseStress(2);
    }

    lastScrollTime = currentTime;
    lastScrollPosition = currentPosition;
  });

  // Detect text deletion in chat input
  chatInput.addEventListener("input", (e) => {
    const currentLength = chatInput.value.length;

    // Check if text was deleted
    if (currentLength < (chatInput.dataset.lastLength || 0)) {
      deleteCount++;
      if (deleteCount > 2) {
        increaseStress(3);
        deleteCount = 0;
      }
    } else {
      deleteCount = 0;
    }

    chatInput.dataset.lastLength = currentLength;
  });

  // Send message
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;

    // Add user message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "message user-message";
    userMessageDiv.innerHTML = `
      <div class="message-bubble">
        <p>${message}</p>
      </div>
    `;
    chatMessages.appendChild(userMessageDiv);

    // Clear input
    chatInput.value = "";
    chatInput.dataset.lastLength = "0";

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I understand. Can you tell me more about that?",
        "That's interesting. How does that make you feel?",
        "I'm here to listen. What else is on your mind?",
        "Thank you for sharing. Would you like to talk about something else?",
        "I see. Take your time, there's no rush.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessageDiv = document.createElement("div");
      aiMessageDiv.className = "message ai-message";
      aiMessageDiv.innerHTML = `
        <div class="message-bubble">
          <p>${randomResponse}</p>
        </div>
      `;
      chatMessages.appendChild(aiMessageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
  }

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Show stress warning modal
  function showStressWarning() {
    stressWarningShown = true;
    stressModal.classList.remove("hidden");
  }

  // Continue button - close stress modal
  continueBtn.addEventListener("click", () => {
    stressModal.classList.add("hidden");
    stressWarningShown = false;
  });

  // Take a break button - reduce stress and close modal
  takeBreakBtn.addEventListener("click", () => {
    stressLevel = Math.max(0, stressLevel - 30);
    updateStressBar();
    stressModal.classList.add("hidden");
    stressWarningShown = false;
  });

  // Close app button - show feedback modal
  closeAppBtn.addEventListener("click", () => {
    feedbackModal.classList.remove("hidden");
    selectedEmoji = null;
    submitFeedbackBtn.disabled = true;
    emojiBtns.forEach((btn) => btn.classList.remove("selected"));
  });

  // Emoji selection
  emojiBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      emojiBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedEmoji = btn.dataset.emoji;
      submitFeedbackBtn.disabled = false;
    });
  });

  // Submit feedback
  submitFeedbackBtn.addEventListener("click", () => {
    if (selectedEmoji) {
      feedbackModal.classList.add("hidden");
      responseModal.classList.remove("hidden");
    }
  });

  // Close response modal and exit to login page
  closeResponseBtn.addEventListener("click", () => {
    responseModal.classList.add("hidden");

    // Return to login/auth page
    const authContainer = document.querySelector(".container");
    const chatPage = document.getElementById("chatPage");
    if (chatPage) chatPage.classList.add("hidden");
    if (authContainer) authContainer.classList.remove("hidden");

    // Reset forms and state
    resetForms();
    // Restore original body layout for auth view
    document.body.style.display = "";
    document.body.style.padding = "20px";
  });
}
