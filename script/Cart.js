export class Cart {
  constructor() {
    this.items = this.loadFromStorage();
  }

  add(product) {
    const found = this.items.find((item) => item.id === product.id);
    if (found) {
      found.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveToStorage();
  }

  remove(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveToStorage();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) this.remove(productId);
      else this.saveToStorage();
    }
  }

  hasProduct(productId) {
    return this.items.some((item) => item.id === productId);
  }

  getProductQuantity(productId) {
    const item = this.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  }

  clear() {
    this.items = [];
    this.saveToStorage();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  loadFromStorage() {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  }
}
