const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class CartManager {
//   constructor(filePath) {
//     this.filePath = filePath;
//     this.carts = [];
//   }

  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.loadCarts(); // Carga los carritos al crear una instancia
  }  

  async loadCarts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    await fs.writeFile(this.filePath, data, 'utf8');
  }

  async createCart() {
    const cart = {
      id: uuidv4(),
      products: [],
    };

    this.carts.push(cart);
    await this.saveCarts();
    return cart;
  }

  async getCart(cartId) {
    await this.loadCarts();
    return this.carts.find((cart) => cart.id === cartId);
  }

  async addProductToCart(cartId, productId) {
    await this.loadCarts();
    const cart = this.carts.find((c) => c.id === cartId);

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const product = cart.products.find((p) => p.product === productId);

    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.saveCarts();
  }
}

module.exports = CartManager;
