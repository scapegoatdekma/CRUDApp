document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const data = {
      username: username,
      email: email,
      password: password,
    };

    console.log(data);

    axios
      .post("http://localhost:4200/api/users", data)
      .then((res) => {
        const user = res.data[0];
        if (user) {
          // Пользователь найден
          localStorage.setItem("id", user.id);
          localStorage.setItem("username", user.username);
          localStorage.setItem("email", user.email);
          localStorage.setItem("hash", user.password);

          console.log(user.username);
          window.location.href = "./home.html";
        } else {
          // Пользователь не найден
          alert("Неверный логин или пароль!");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
