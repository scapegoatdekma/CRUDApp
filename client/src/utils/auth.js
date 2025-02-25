// src/utils/auth.js (или любое другое подходящее место)

const logout = () => {
  // Очищаем данные пользователя из локального хранилища
  localStorage.removeItem("token"); // Пример: удаляем токен
  localStorage.removeItem("username"); // Удаляем имя пользователя
  localStorage.removeItem("avatar"); // Удаляем имя пользователя
  // Другие данные, которые нужно удалить

  // Перенаправляем пользователя на страницу авторизации
  window.location.href = "/auth"; // Предполагается, что '/auth' - это страница авторизации
};

export default logout;
