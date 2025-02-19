const getUsername = () => {
  return localStorage.getItem("username");
};
const siderController = () => {
  const sider = document.getElementById("sider");
  const toggleSider = document.getElementById("toggle-sider");
  const toggleSider1 = document.getElementById("toggle-sider1");
  const windowInnerWidth = window.innerWidth;

  if (windowInnerWidth <= 1165) {
  }
  const sider_content = document.querySelector(".sider_content");

  toggleSider.addEventListener("click", () => {
    // alert(1);
    sider.classList.toggle("active");
    sider_content.classList.toggle("active");
  });
  toggleSider1.addEventListener("click", () => {
    // alert(1);
    sider.classList.toggle("active");
    sider_content.classList.toggle("active");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const userName = document.querySelectorAll(".user_name");
  userName.forEach((name) => {
    name.innerHTML = "";
    console.log(getUsername());
    name.innerHTML = getUsername();
    console.log(userName);
  });

  siderController();
});
