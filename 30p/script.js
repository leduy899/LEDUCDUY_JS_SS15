const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;
  const user = {
    email: emailValue,
    password: passwordValue,
  };

  console.log("user:");
  console.log(user);
});
