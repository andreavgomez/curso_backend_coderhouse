import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

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
      console.error('Error al cargar carritos:', error);
      this.carts = [];
    }
  }

  async getCarts() {
    return this.carts;
  }  

  async saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    try {
      await fs.writeFile(this.filePath, data, 'utf8');
    } catch (error) {
      console.error('Error al guardar carritos:', error); // Imprime el error
    }
  }

  async createCart() {
    const cart = {
      id: uuidv4(),
      products: [],
    };

    this.carts.push(cart);
    try {
      await this.saveCarts();
    } catch (error) {
      console.error('Error al crear un carrito:', error);
    }
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

export default CartManager;
