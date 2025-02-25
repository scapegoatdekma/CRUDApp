const navController = () => {
  const navList = document.querySelector(".sider-menu");
  const items = navList.getElementsByClassName(".item");

  const path = window.location.pathname;
  const filenameWithExtension = path.split("/").pop();
  const filename = filenameWithExtension.split(".").slice(0, -1).join("."); // Удаляем расширение

  const currentItem = navList.querySelector(`#${filename}`);
  console.log(currentItem);
  currentItem.classList.add("active");
};

document.addEventListener("DOMContentLoaded", () => {
  navController();
});
