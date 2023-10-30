const fs = require('fs').promises; // Uso promesas para leer y escribir archivos
const { v4: uuidv4 } = require('uuid'); // Importa uuid

class ProductManager {
  // constructor(filePath) {
  //   this.filePath = filePath;
  //   this.products = [];
  // }

  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.loadProducts(); // Carga los productos al crear una instancia
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
    if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((p) => p.code === product.code)) {
      console.error("El campo 'code' debe ser único. Este código ya existe.");
      return;
    }

    product.id = uuidv4(); // Genera un nuevo ID único
    product.status = true; // Establece el estado como verdadero por defecto
    this.products.push(product);
    await this.saveProducts();
    console.log("Producto agregado con éxito:", product);
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
