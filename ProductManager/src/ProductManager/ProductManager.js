const fs = require('fs').promises; // Uso promesas para leer y escribir archivos

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.filePath, data, 'utf8');
  }

  async addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((p) => p.code === product.code)) {
      console.error("El campo 'code' debe ser único. Este código ya existe.");
      return;
    }

    const id = this.generateUniqueId();
    this.products.push({ ...product, id });
    await this.saveProducts();
    console.log("Producto agregado con éxito:", { ...product, id });
  }

  generateUniqueId() {
    return this.products.length + 1;
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.loadProducts();
    const product = this.products.find((p) => p.id === id);
    return product;
  }

  async updateProduct(id, updatedProduct) {
    await this.loadProducts();
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct, id };
      await this.saveProducts();
      console.log("Producto actualizado con éxito:", this.products[index]);
    } else {
      console.error("Producto no encontrado.");
    }
  }

  async deleteProduct(id) {
    await this.loadProducts();
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProducts();
      console.log("Producto eliminado con éxito.");
    } else {
      console.error("Producto no encontrado.");
    }
  }
}

module.exports = ProductManager;
