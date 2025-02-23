document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let avatar = document.getElementById("avatar").files[0];

    const formdata = new FormData();
    formdata.append("username", username);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("avatar", avatar);

    console.log(formdata.get("username")); // Добавляем проверку
    console.log(formdata.get("email")); // Добавляем проверку
    console.log(formdata.get("password")); // Добавляем проверку
    console.log(formdata.get("avatar")); // Добавляем проверку

    axios
      .post("http://localhost:4200/api/users", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const user = res.data;
        if (user) {
          localStorage.setItem("id", user.id);
          localStorage.setItem("username", user.username);
          localStorage.setItem("email", user.email);
          localStorage.setItem("hash", user.password);
          localStorage.setItem("avatar", user.avatar);

          console.log(user.username);
          window.location.href = "./home.html";
        } else {
          alert("Ошибка регистрации. Пожалуйста, попробуйте еще раз.");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
