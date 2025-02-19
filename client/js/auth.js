document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    const data = {
      username: username,
      password: password,
    };

    console.log(data);

    axios
      .get("http://localhost:4200/api/users", {
        params: data, // Передаем данные как параметры запроса
      })
      .then((response) => {
        let user = response.data[0];

        if (user) {
          // Пользователь найден
          localStorage.setItem("id", user.id);
          localStorage.setItem("username", user.username);
          localStorage.setItem("email", user.email);
          localStorage.setItem("hash", user.password);
          window.location.href = "./home.html";
        } else {
          // Пользователь не найден
          alert("Неверный логин или пароль!");
        }
      })
      .catch((error) => {
        console.error("Ошибка при запросе:", error);
        alert("Ошибка при запросе. Пожалуйста, попробуйте позже.");
      });
  });
});
