import { Image } from "./Image.js";

export class Product {
  constructor(data) {
    this.name = data.name;
    this.category = data.category;
    this.price = data.price;
    this.image = new Image(data.image);
    this.id = this.generateId();
  }

  generateId() {
    return this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  toHTML(productQuantity = 1) {
    const content = `
      <img
        src="${this.image.thumbnail}"
        srcset="${this.image.toSrcset()}"
        sizes="(max-width: 576px) 100vw, (min-width: 577px) and (max-width: 992px) 212px, 250px"
        alt="${this.name}"
      />
      <div class="btn-actions">
        <div class="quantity-selector">
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="none" viewBox="0 0 10 2">
              <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
            </svg>
          </button>
          <span>${productQuantity}</span>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 8">
              <path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
            </svg>
          </button>
        </div>
        <button class="btn-add-product"><span class="icon"></span>Add to Cart</button>
      </div>
      <p class="category">${this.category}</p>
      <h3 class="product-name">${this.name}</h3>
      <span class="price">$${this.price} </span>
    `;

    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.setAttribute("id", `product-${this.id}`);
    productCard.innerHTML = content;

    return productCard;
  }
}
