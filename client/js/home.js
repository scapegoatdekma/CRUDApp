const getUsername = () => {
  return localStorage.getItem("username");
};
const siderController = () => {
  const sider = document.getElementById("sider");
  const sider_content = document.querySelector(".sider_content");
  const chat = document.getElementById("chat");
  const toggleSider = document.getElementById("toggle-sider");
  const toggleChat = document.getElementById("toggle-chat");

  toggleSider.addEventListener("click", () => {
    // alert(1);
    sider.classList.toggle("active");
    sider_content.classList.toggle("active");
  });
};

const avatarController = () => {
  const avatarpath = localStorage.getItem("avatar");
  const avatars = document.querySelectorAll(".avatar");
  console.log("ava", avatarpath);
  avatars.forEach((avatar) => {
    avatar.setAttribute("src", avatarpath);
  });
};
document.addEventListener("DOMContentLoaded", () => {
  window.dispatchEvent(new Event("resize"));

  const windowInnerWidth = window.innerWidth;
  const sider = document.getElementById("sider");
  const sider_content = document.querySelector(".sider_content");

  if (windowInnerWidth <= 1165) {
    sider.classList.remove("active");
    sider_content.classList.remove("active");
  }
  const userName = document.querySelectorAll(".user_name");
  userName.forEach((name) => {
    name.innerHTML = "";
    console.log(getUsername());
    name.innerHTML = getUsername();
    console.log(userName);
  });

  siderController();
  avatarController();
});
