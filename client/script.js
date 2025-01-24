async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    const productsList = document.getElementById("products-list");
    productsList.innerHTML =
      "Ошибка при загрузке данных. Попробуйте перезагрузить страницу.";
  }
}
s;
function displayProducts(products) {
  const productsList = document.getElementById("products__list");
  products.forEach((product) => {
    const li = document.createElement("li");
    li.style.display = "block";
    li.className = "products__li";
    li.textContent = `${product.productname} - $${product.productprice}`;
    productsList.appendChild(li);
  });
}

fetchProducts();
