const state = {
  mode: "signin",
  toastTimer: null,
};

const elements = {
  html: document.documentElement,
  panelTitle: document.getElementById("panelTitle"),
  panelFootnote: document.getElementById("panelFootnote"),
  signInForm: document.getElementById("signInForm"),
  signUpForm: document.getElementById("signUpForm"),
  signInTab: document.getElementById("signInTab"),
  signUpTab: document.getElementById("signUpTab"),
  toast: document.getElementById("toast"),
  themeToggle: document.getElementById("themeToggle"),
  particles: document.getElementById("particles"),
  strengthFill: document.getElementById("strengthFill"),
  strengthText: document.getElementById("strengthText"),
  signupPassword: document.getElementById("signupPassword"),
  verifyOtpBtn: document.getElementById("verifyOtpBtn"),
  otpCard: document.getElementById("otpCard"),
};

const copyMap = {
  signin: {
    title: "Sign in to Nebula",
    footnote:
      'New here? <button class="inline-switch" type="button" data-mode-target="signup">Create an account</button>',
  },
  signup: {
    title: "Create your Nebula account",
    footnote:
      'Already have an account? <button class="inline-switch" type="button" data-mode-target="signin">Sign in instead</button>',
  },
};

// Restore lightweight preferences so the demo feels closer to a real product.
initTheme();
initRememberedUser();
setMode(localStorage.getItem("authMode") || "signin");
createParticles();
attachEvents();
updateStrengthMeter("");

function attachEvents() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  document.addEventListener("click", (event) => {
    const switcher = event.target.closest("[data-mode-target]");
    if (switcher) {
      setMode(switcher.dataset.modeTarget);
    }
  });

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => togglePassword(button));
  });

  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.signInForm.addEventListener("submit", handleSignIn);
  elements.signUpForm.addEventListener("submit", handleSignUp);
  elements.signupPassword.addEventListener("input", (event) => {
    updateStrengthMeter(event.target.value);
  });
  elements.verifyOtpBtn.addEventListener("click", handleOtpVerification);

  document.querySelectorAll(".otp-inputs input").forEach((input, index, list) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
      if (input.value && index < list.length - 1) {
        list[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && index > 0) {
        list[index - 1].focus();
      }
    });
  });
}

function setMode(mode) {
  state.mode = mode;
  localStorage.setItem("authMode", mode);

  const isSignIn = mode === "signin";
  elements.signInForm.classList.toggle("active", isSignIn);
  elements.signUpForm.classList.toggle("active", !isSignIn);
  elements.signInTab.classList.toggle("active", isSignIn);
  elements.signUpTab.classList.toggle("active", !isSignIn);
  elements.signInTab.setAttribute("aria-selected", String(isSignIn));
  elements.signUpTab.setAttribute("aria-selected", String(!isSignIn));
  elements.panelTitle.textContent = copyMap[mode].title;
  elements.panelFootnote.innerHTML = copyMap[mode].footnote;
  elements.otpCard.classList.toggle("active", mode === "signup" && elements.otpCard.dataset.visible === "true");
  clearFormErrors(elements.signInForm);
  clearFormErrors(elements.signUpForm);
}

function togglePassword(button) {
  const input = document.getElementById(button.dataset.togglePassword);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  button.querySelector("span").textContent = isPassword ? "Hide" : "Show";
  button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
}

function handleSignIn(event) {
  event.preventDefault();
  clearFormErrors(elements.signInForm);

  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  let isValid = true;

  if (!validateEmail(email)) {
    setFieldError("signinEmail", "Please enter a valid work email.");
    isValid = false;
  }

  if (password.length < 8) {
    setFieldError("signinPassword", "Password must be at least 8 characters.");
    isValid = false;
  }

  if (!isValid) {
    showToast("Please fix the highlighted sign-in fields.", "error");
    return;
  }

  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  simulateSubmit(event.submitter, () => {
    showToast(`Welcome back, ${email}. Sign-in successful.`, "success");
  });
}

function handleSignUp(event) {
  event.preventDefault();
  clearFormErrors(elements.signUpForm);

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const termsAccepted = document.getElementById("termsAccepted").checked;
  let isValid = true;

  if (name.length < 3) {
    setFieldError("signupName", "Enter your full name to continue.");
    isValid = false;
  }

  if (!validateEmail(email)) {
    setFieldError("signupEmail", "Use a valid email address.");
    isValid = false;
  }

  if (calculatePasswordScore(password) < 3) {
    setFieldError("signupPassword", "Create a stronger password before continuing.");
    isValid = false;
  }

  if (password !== confirmPassword || !confirmPassword) {
    setFieldError("signupConfirmPassword", "Passwords do not match.");
    isValid = false;
  }

  if (!termsAccepted) {
    setFieldError("termsAccepted", "You must accept the terms to create an account.");
    isValid = false;
  }

  if (!isValid) {
    showToast("Please fix the highlighted sign-up fields.", "error");
    return;
  }

  localStorage.setItem("rememberedEmail", email);
  simulateSubmit(event.submitter, () => {
    elements.otpCard.dataset.visible = "true";
    elements.otpCard.classList.add("active");
    showToast(`Account created for ${name}. Verify the OTP to finish.`, "success");
    document.querySelector(".otp-inputs input")?.focus();
  });
}

function handleOtpVerification() {
  const digits = [...document.querySelectorAll(".otp-inputs input")]
    .map((input) => input.value)
    .join("");

  if (digits.length !== 6) {
    showToast("Enter the full 6-digit OTP code.", "error");
    return;
  }

  showToast("OTP verified. Your account is ready to go.", "success");
  elements.otpCard.dataset.visible = "false";
  elements.otpCard.classList.remove("active");
  document.querySelectorAll(".otp-inputs input").forEach((input) => {
    input.value = "";
  });
  setMode("signin");
}

function simulateSubmit(button, callback) {
  button.classList.add("loading");
  button.disabled = true;

  window.setTimeout(() => {
    button.classList.remove("loading");
    button.disabled = false;
    callback();
  }, 1400);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.querySelector(`[data-error-for="${fieldId}"]`);
  const wrapper = input?.closest(".field") || input?.closest(".checkbox") || input?.parentElement;

  wrapper?.classList.add("invalid");
  if (error) {
    error.textContent = message;
  }
}

function clearFormErrors(form) {
  form.querySelectorAll(".invalid").forEach((node) => node.classList.remove("invalid"));
  form.querySelectorAll(".error").forEach((node) => {
    node.textContent = "";
  });
}

function showToast(message, type) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.className = `toast show ${type}`;

  state.toastTimer = window.setTimeout(() => {
    elements.toast.className = "toast";
  }, 3200);
}

function updateStrengthMeter(password) {
  const score = calculatePasswordScore(password);
  const widths = ["12%", "28%", "52%", "76%", "100%"];
  const copy = [
    "Use 8+ characters with mixed case, numbers, and symbols.",
    "Weak strength. Add more variation.",
    "Fair strength. Add a symbol or more length.",
    "Strong password. Almost there.",
    "Excellent password strength.",
  ];
  const gradients = [
    "linear-gradient(90deg, #ff6b8a, #ffb048)",
    "linear-gradient(90deg, #ff7a59, #ffbf44)",
    "linear-gradient(90deg, #ffbf44, #7fe86d)",
    "linear-gradient(90deg, #6de6a6, #2ec5ff)",
    "linear-gradient(90deg, #2ec5ff, #7c5cff)",
  ];

  elements.strengthFill.style.width = widths[score];
  elements.strengthFill.style.background = gradients[score];
  elements.strengthText.textContent = copy[score];
}

function calculatePasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  return Math.min(score, 4);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    elements.html.dataset.theme = savedTheme;
  }
}

function toggleTheme() {
  const nextTheme = elements.html.dataset.theme === "dark" ? "light" : "dark";
  elements.html.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
}

function initRememberedUser() {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (!rememberedEmail) return;

  document.getElementById("signinEmail").value = rememberedEmail;
  document.getElementById("signupEmail").value = rememberedEmail;
  document.getElementById("rememberMe").checked = true;
}

function createParticles() {
  const particleCount = window.innerWidth < 720 ? 18 : 34;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${40 + Math.random() * 65}%`;
    particle.style.animationDuration = `${12 + Math.random() * 14}s`;
    particle.style.animationDelay = `${Math.random() * -14}s`;
    particle.style.opacity = `${0.2 + Math.random() * 0.5}`;
    elements.particles.appendChild(particle);
  }
}