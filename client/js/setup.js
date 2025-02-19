const checkAuth = () => {
  const userLogined = localStorage.getItem("username");
  if (userLogined) {
    alert(`Добро пожаловать ${userLogined}`);
    window.location.href = "./pages/home.html";
  } else {
    alert("Не залогинен");
    window.location.href = "./pages/auth.html";
  }
};
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});
