const menuToggleBtn = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");


const buyButtons = document.querySelectorAll(".buy-button");

const cartToggleBtn = document.getElementById("cart-toggle");
const cartCloseBtn = document.getElementById("cart-close");
const cart = document.getElementById("cart");

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalContainer = document.getElementById("cart-total");

const cartCountElement = document.getElementById("cart-count");
const clearCartButton = document.getElementById("clear-cart");

const cartItems = {};

buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.name;
    const price = Number(button.dataset.price);
    const qtyInput = button.parentElement.querySelector(".qty-input");
    const quantity = Number(qtyInput.value);

    if (cartItems[productName]) {
      cartItems[productName].quantity += quantity;
    } else {
      cartItems[productName] = { quantity: quantity, price: price };
    }

    //console.log(cartItems);

    renderCart();
  });
});

menuToggleBtn.addEventListener("click", () => {
  mainNav.classList.toggle("open");
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
