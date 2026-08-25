const menuToggleBtn = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

const productList = document.getElementById("productList");

const cartToggleBtn = document.getElementById("cart-toggle");
const cartCloseBtn = document.getElementById("cart-close");
const cart = document.getElementById("cart");

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalContainer = document.getElementById("cart-total");

const cartCountElement = document.getElementById("cart-count");
const clearCartButton = document.getElementById("clear-cart");

const cartItems = {};

// --- Hamburgermeny ---

menuToggleBtn.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

// Stäng menyn om man klickar utanför den
document.addEventListener("click", (event) => {
  const clickedInsideNav = mainNav.contains(event.target);
  const clickedToggleButton = menuToggleBtn.contains(event.target);

  if (
    mainNav.classList.contains("open") &&
    !clickedInsideNav &&
    !clickedToggleButton
  ) {
    mainNav.classList.remove("open");
  }
});

// Stäng menyn om man klickar på en länk inuti den
const navLinks = mainNav.querySelectorAll("a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
  });
});

// --- Produktlista från JSON ---

let products = [];

const fetchProducts = async () => {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    products = await response.json();

    renderProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const renderProducts = () => {
  products.forEach((product) => {
    const article = document.createElement("article");
    article.classList.add("product");

    // Badge (om produkten har en badge)
    if (product.badge) {
      const badge = document.createElement("span");
      badge.classList.add("badge");
      badge.textContent = product.badge;
      article.appendChild(badge);
    }

    // Bild
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.imageAlt;
    article.appendChild(img);

    // Innehållswrappern
    const content = document.createElement("div");
    content.classList.add("product-content");

    const title = document.createElement("h3");
    title.textContent = product.name;
    content.appendChild(title);

    const description = document.createElement("p");
    description.textContent = product.description;
    content.appendChild(description);

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `Pris: ${product.price} kr`;
    content.appendChild(price);

    // Antal-input
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.classList.add("qty-input");
    qtyInput.value = 1;
    qtyInput.min = 1;
    content.appendChild(qtyInput);

    // Köp-knapp
    const buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    buyButton.dataset.name = product.name;
    buyButton.dataset.price = product.price;
    buyButton.textContent = "Lägg i varukorg";

    buyButton.addEventListener("click", () => {
      const quantity = Number(qtyInput.value);
      if (cartItems[product.name]) {
        cartItems[product.name].quantity += quantity;
      } else {
        cartItems[product.name] = { quantity: quantity, price: product.price };
      }
      renderCart();
    });

    content.appendChild(buyButton);
    article.appendChild(content);

    productList.appendChild(article);
  });
};

fetchProducts();

// --- Varukorg ---

// Stäng varukorgen om man klickar utanför den
document.addEventListener("click", (event) => {
  const clickedInsideCart = cart.contains(event.target);
  const clickedToggleButton = cartToggleBtn.contains(event.target);

  if (
    !cart.classList.contains("hidden") &&
    !clickedInsideCart &&
    !clickedToggleButton
  ) {
    cart.classList.add("hidden");
  }
});

cart.addEventListener("click", (event) => {
  event.stopPropagation();
});

cartToggleBtn.addEventListener("click", () => {
  cart.classList.toggle("hidden");
});

cartCloseBtn.addEventListener("click", () => {
  cart.classList.add("hidden");
});

clearCartButton.addEventListener("click", () => {
  for (const key in cartItems) {
    delete cartItems[key];
  }
  renderCart();
});

const renderCart = () => {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  for (const productName in cartItems) {
    const item = cartItems[productName];
    const lineTotal = item.quantity * item.price;
    total += lineTotal;
    totalItems += item.quantity;

    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
      <div class="cart-item-top">
        <span class="cart-item-name">${productName}</span>
        <span class="cart-item-price">${lineTotal} kr</span>
    </div>
    <div class="cart-item-bottom">
        <div class="cart-item-qty-controls">
            <button class="decrease-qty">−</button>
            <span class="cart-item-qty">${item.quantity} st</span>
            <button class="increase-qty">+</button>
        </div>
        <button class="remove-item">Ta bort</button>
    </div>
    `;

    const removeButton = itemElement.querySelector(".remove-item");
    removeButton.addEventListener("click", () => {
      delete cartItems[productName];
      renderCart();
    });

    const decreaseButton = itemElement.querySelector(".decrease-qty");
    const increaseButton = itemElement.querySelector(".increase-qty");

    increaseButton.addEventListener("click", () => {
      cartItems[productName].quantity += 1;
      renderCart();
    });

    decreaseButton.addEventListener("click", () => {
      cartItems[productName].quantity -= 1;

      if (cartItems[productName].quantity <= 0) {
        delete cartItems[productName];
      }

      renderCart();
    });

    cartItemsContainer.appendChild(itemElement);
  }

  if (totalItems > 0) {
    cartCountElement.classList.remove("hidden");
  } else {
    cartCountElement.classList.add("hidden");
  }

  cartCountElement.textContent = totalItems;

  cartTotalContainer.innerHTML = `
    <span>Totalt</span>
    <span>${total} kr</span>
`;
};
