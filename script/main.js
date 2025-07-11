import { Product } from "./Product.js";
import { Cart } from "./Cart.js";

const cart = new Cart();
updateCartUI();

async function loadProducts() {
  try {
    const response = await fetch("data.json");
    const productsData = await response.json();
    const list = document.getElementById("product-list");

    productsData.forEach((productData) => {
      // Prepare product data
      const product = new Product(productData);
      const productCard = product.toHTML(cart.getProductQuantity(product.id));

      // Display quantity selector if product is already in cart
      if (cart.hasProduct(product.id)) {
        productCartHandler(productCard, product);
      }

      // Add product to cart
      const addToCartBtn = productCard.querySelector(".btn-add-product");
      addToCartBtn.addEventListener("click", () => {
        cart.add({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image.thumbnail,
        });

        // Update quantity
        const quantitySelector = productCard.querySelector(".quantity-selector");
        const quantitySpan = quantitySelector.querySelector("span");
        let quantity = cart.getProductQuantity(product.id);
        quantitySpan.textContent = quantity;

        productCartHandler(productCard, product);

        // Refresh cart
        updateCartUI();
      });

      list.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error loading product list: ", error);
  }
}

function productCartHandler(productCard, product) {
  // Display quantity selector
  productCard.querySelector(".btn-actions").classList.add("added-to-cart");

  // Increase/decrease quantity
  const quantitySelector = productCard.querySelector(".quantity-selector");
  const quantitySpan = quantitySelector.querySelector("span");

  let quantity = cart.getProductQuantity(product.id);
  quantitySelector.querySelector("button:first-child").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantitySpan.textContent = quantity;
      cart.updateQuantity(product.id, quantity);
    } else {
      cart.remove(product.id);
      productCard.querySelector(".btn-actions").classList.remove("added-to-cart");
    }

    updateCartUI();
  });

  quantitySelector.querySelector("button:last-child").addEventListener("click", () => {
    quantity++;
    quantitySpan.textContent = quantity;
    cart.updateQuantity(product.id, quantity);

    updateCartUI();
  });
}

function updateCartUI() {
  const cartEl = document.querySelector(".cart");
  const cartCountEl = document.getElementById("cart-count");
  const cartItemsEl = document.querySelector(".cart-items");
  const confirmOrderBtn = document.getElementById("confirm-order");
  const cartCount = cart.getCount();

  // Reset cart count and items
  cartCountEl.textContent = cartCount;
  cartItemsEl.innerHTML = "";
  cartEl.classList.remove("empty");

  if (cartCount === 0) {
    cartEl.classList.add("empty");

    return;
  }

  cart.items.forEach((item) => {
    const cartItemEl = document.createElement("div");
    cartItemEl.className = "cart-item";
    cartItemEl.innerHTML = `
      <div class="item-details">
        <p class="item-title">${item.name}</p>
        <div class="item-price">
          <p class="quantity">${item.quantity}x</p>
          <p class="unit-price">@ $${item.price.toFixed(2)}</p>
          <p class="total-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
      <div class="item-remove">
        <button class="remove-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 10 10">
            <path
              d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
            />
          </svg>
        </button>
      </div>
    `;

    // Remove item from cart
    cartItemEl.querySelector(".remove-icon").addEventListener("click", () => {
      cart.remove(item.id);
      updateCartUI();

      // Remove quantity selector for the product card
      const productCard = document.getElementById(`product-${item.id}`);
      if (productCard) {
        productCard.querySelector(".btn-actions").classList.remove("added-to-cart");
      }
    });

    cartItemsEl.appendChild(cartItemEl);
  });

  const total = document.querySelector(".cart-total .total");
  if (total) total.textContent = "$" + cart.getTotal().toFixed(2);

  confirmOrderBtn.addEventListener("click", () => {
    document.body.classList.add("modal-show");
  });
}

loadProducts();

// When clicking outside the modal, close it
const modal = document.querySelector(".modal");
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.classList.remove("modal-show");
    }
  });
}
